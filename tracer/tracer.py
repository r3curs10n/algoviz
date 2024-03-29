from __future__ import annotations

import sys
from types import FrameType
import json
import typing
import time
import inspect

class TimeoutException(Exception):
    pass

primitives = (int, str, bool, float)

class Variable:
    def __init__(self):
        self.val = 0
        self.isPtr = False

    @staticmethod
    def fromReal(x):
        z = Variable()
        if x is None:
            z.val = 0
            z.isPtr = True
        elif isinstance(x, tuple):
            # Represent tuple as a null ptr for now
            z.val = -1
            z.isPtr = True
        elif isinstance(x, primitives):
            z.val = x
            z.isPtr = False
        else:
            z.val = id(x)
            z.isPtr = True
        return z

    def toJson(self):
        return [self.isPtr, self.val]

    def __eq__(self, other):
        if isinstance(other, Variable):
            return self.val == other.val and self.isPtr == other.isPtr
        return False

class CustomObject:
    def __init__(self, obj):
        self.typeName = obj.__class__.__name__
        self.members = {}

    @staticmethod
    def getMembers(obj):
        return {k: obj.__getattribute__(k) for k in dir(obj) if not k.startswith('__')}

class VariableCollection:
    def __init__(self, collection: dict):
        self.vars = {}
        for varName, varVal in collection.items():
            self.vars[varName] = Variable.fromReal(varVal)

    def toJson(self):
        varsJson = {}
        for k, v in self.vars.items():
            varsJson[k] = [v.isPtr, v.val]
        return varsJson


class VirtualHeap:
    def __init__(self):
        self.objects = {}

    def trackAll(self, vars: list):
        self.objects = {}
        for v in vars:
            self.trackTransitive(v)

    def trackTransitive(self, e):
        if e is None:
            return
        if not self.objects.get(id(e)) is None:
            return
        if isinstance(e, primitives):
            return
        elif isinstance(e, list):
            if id(e) not in self.objects:
                self.objects[id(e)] = [0] * len(e)
            for i, child in enumerate(e):
                self.objects[id(e)][i] = Variable.fromReal(child)
                self.trackTransitive(child)
        elif isinstance(e, tuple):
            for nested in e:
                self.trackTransitive(nested)
        elif isinstance(e, dict):
            if id(e) not in self.objects:
                self.objects[id(e)] = {}
            for k, v in e.items():
                self.objects[id(e)][k] = Variable.fromReal(v)
                self.trackTransitive(v)
        else:
            # User defined type
            if id(e) not in self.objects:
                self.objects[id(e)] = CustomObject(e)
            for k, v in CustomObject.getMembers(e).items():
                self.objects[id(e)].members[k] = Variable.fromReal(v)
                self.trackTransitive(v)

    def toJson(self):
        jsonHeap = {}
        for ptr, e in self.objects.items():
            if isinstance(e, list):
                jsonHeap[ptr] = [z.toJson() for z in e]
            elif isinstance(e, dict):
                jsonMembers = {k: v.toJson() for k, v in e.items()}
                jsonHeap[ptr] = {"type": "dict", "members": jsonMembers}
            elif isinstance(e, CustomObject):
                jsonMembers = {k: v.toJson() for k, v in e.members.items()}
                jsonHeap[ptr] = {"type": e.typeName, "members": jsonMembers}
        return jsonHeap

    @staticmethod
    def heapDiff(prevHeapJson, curHeapJson):
        diffLog = []
        for ptr in prevHeapJson:
            if ptr not in curHeapJson:
                diffLog.append(('delete', ptr))
        for ptr, e in curHeapJson.items():
            if ptr not in prevHeapJson:
                diffLog.append(('new', ptr, curHeapJson[ptr]))
            else:
                prevE = prevHeapJson[ptr]
                if type(e) == dict:
                    diffLog += VirtualHeap.dictDiff(ptr, prevE["members"], e["members"])
                elif type(e) == list:
                    diffLog += VirtualHeap.listDiff(ptr, prevE, e)
        return diffLog

    @staticmethod
    def dictDiff(dictId, prevDict, curDict):
        diffLog = []
        for key in prevDict:
            if key not in curDict:
                diffLog.append(('removeKey', dictId, key))
        for key in curDict:
            if key not in prevDict:
                diffLog.append(('addKey', dictId, key, curDict[key]))
            elif curDict[key] != prevDict[key]:
                diffLog.append(('modifyKey', dictId, key, curDict[key]))
        return diffLog

    @staticmethod
    def listDiff(listId, prevList, curList):
        diffLog = []
        if len(prevList) == len(curList):
            for i in range(len(curList)):
                if prevList[i] != curList[i]:
                    diffLog.append(('modifyPos', listId, i, curList[i]))
        elif len(prevList) + 1 == len(curList) and prevList == curList[:-1]:
            diffLog.append(('modifyPos', listId, len(curList) - 1, curList[-1]))
        else:
            diffLog.append(('reset', listId, curList[:]))
        return diffLog

class ProgramFrame:
    def __init__(self):
        self.methodName = 'undefined'
        self.lineNumber = 0
        self.locals = {}

    @staticmethod
    def fromTraceFrame(frame: FrameType) -> ProgramFrame:
        z = ProgramFrame()
        z.lineNumber = frame.f_lineno
        z.locals = frame.f_locals.copy()
        z.methodName = frame.f_code.co_name
        return z

    def toJson(self):
        return {'function': self.methodName, 'locals': VariableCollection(self.locals).toJson(), 'line': self.lineNumber}

    def __str__(self):
        return str(self.toJson())

    def __repr__(self):
        return self.__str__()

class ProgramState:
    def __init__(self):
        self.frames = []
        self.globals = {}
        self.heap = VirtualHeap()

    def getReachableVars(self):
        vars = []
        for frame in self.frames:
            for var in frame.locals.values():
                vars.append(var)
        return vars

    def pushFrame(self, frame: ProgramFrame):

        self.frames.append(frame)

    def popFrame(self):
        self.frames.pop()

    def update(self, frame: ProgramFrame, globals):
        self.frames[-1] = frame
        self.globals = globals

    def getActiveFrame(self) -> ProgramFrame:
        return self.frames[-1]

class ProgramHistory:
    def __init__(self):
        self.state = ProgramState()
        self.log = []
        self.executionStartTimeSeconds = time.time()
        self.shouldStopTracking = False
        self.mostRecentHeapJson = self.state.heap.toJson()

    def appendBatchedOps(self, ops):
        if len(ops) > 0:
            self.log.append(('batch', ops))

    def pushFrame(self, frame: ProgramFrame):
        if self.shouldStopTracking:
            return

        prevHeap = self.mostRecentHeapJson
        self.state.pushFrame(frame)
        self.log.append(('pushFrame', frame))
        self.state.heap.trackAll(self.state.getReachableVars())
        curHeap = self.state.heap.toJson()
        self.appendBatchedOps(VirtualHeap.heapDiff(prevHeap, curHeap))

        self.mostRecentHeapJson = curHeap

    def popFrame(self, returnVal):
        if self.shouldStopTracking:
            return

        prevHeap = self.mostRecentHeapJson

        additionalVars = [returnVal]
        if (self.state.getActiveFrame().methodName == "__init__"):
            additionalVars.append(self.state.getActiveFrame().locals["self"])

        self.state.heap.trackAll(self.state.getReachableVars() + additionalVars)
        curHeap = self.state.heap.toJson()
        self.appendBatchedOps(VirtualHeap.heapDiff(prevHeap, curHeap))

        self.state.popFrame()
        self.log.append(('return', Variable.fromReal(returnVal).toJson()))
        self.log.append(('popFrame', returnVal))

    def update(self, frame: ProgramFrame, globals):
        if self.shouldStopTracking:
            return

        if len(self.state.frames) == 0:
            return
        globals = ProgramHistory.filterGlobals(globals)

        for (varName, varVal) in globals.items():
            if not varName in self.state.globals:
                self.log.append(('newGlobal', varName, varVal))
            elif varVal != self.state.globals[varName]:
                self.log.append(('updateGlobal', varName, varVal))

        for (varName, varVal) in frame.locals.items():
            wrapped = Variable.fromReal(varVal)
            if not varName in self.state.getActiveFrame().locals:
                self.log.append(('newLocal', varName, wrapped.toJson()))
            elif varVal != self.state.getActiveFrame().locals[varName]:
                self.log.append(('updateLocal', varName, wrapped.toJson()))

        prevHeap = self.mostRecentHeapJson

        self.state.update(frame, globals)

        self.state.heap.trackAll(self.state.getReachableVars())
        curHeap = self.state.heap.toJson()
        self.appendBatchedOps(VirtualHeap.heapDiff(prevHeap, curHeap))

        self.log.append(('line', frame.lineNumber))

        self.mostRecentHeapJson = curHeap

    @staticmethod
    def filterGlobals(globals) -> dict:
        return {varName: varValue for varName, varValue in globals.items() if varName.endswith('_g')}

    def toJson(self):
        return self.toJsonInternal(self.log)

    def toJsonInternal(self, log):
        jsonLog = []
        for e in log:
            jsonE = {'op': e[0], 'info': {}}
            if e[0] == 'line':
                jsonE['info'] = e[1]
            elif e[0] in ['newLocal', 'newGlobal', 'updateLocal', 'updateGlobal']:
                jsonE['info'] = [e[1], e[2]]
            elif e[0] == 'pushFrame':
                jsonE['info'] = e[1].toJson()
            elif e[0] == 'popFrame':
                jsonE['info'] = None
            elif e[0] == 'return':
                jsonE['info'] = e[1]
            elif e[0] == 'new':
                jsonE['info'] = [e[1], e[2]]
            elif e[0] == "delete":
                jsonE['info'] = e[1]
            elif e[0] == "addKey" or e[0] == "modifyKey":
                jsonE["info"] = [e[1], e[2], e[3]]
            elif e[0] == "removeKey":
                jsonE["info"] = [e[1], e[2]]
            elif e[0] == "modifyPos":
                jsonE["info"] = [e[1], e[2], e[3]]
            elif e[0] == "reset":
                jsonE["info"] = [e[1], e[2]]
            elif e[0].startswith("batch"):
                if len(e[1]) == 0:
                    continue
                jsonE["info"] = self.toJsonInternal(e[1])
            jsonLog.append(jsonE)
        return jsonLog

    def __repr__(self):
        return json.dumps(self.toJson(), indent=2)

history: ProgramHistory = ProgramHistory()

def traceit(frame: FrameType, event, arg):
    if (time.time() - history.executionStartTimeSeconds > 2):
        raise TimeoutException()

    base: FrameType = frame
    mainFound = False
    while base:
        if base.f_code.co_name == "main":
            mainFound = True
            break
        base = base.f_back
    if not mainFound:
        return traceit

    if event == "call":
        history.pushFrame(ProgramFrame.fromTraceFrame(frame))
    elif event == "exception":
        history.shouldStopTracking = True
    elif event == "return":
        history.popFrame(arg)
    elif event == "line":
        history.update(ProgramFrame.fromTraceFrame(frame), frame.f_globals)
    return traceit

sys.settrace(traceit)
