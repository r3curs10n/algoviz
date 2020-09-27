from __future__ import annotations

import sys
from types import FrameType
import json
import typing

primitives = (int, str, bool, float)

class Variable:
    def __init__(self):
        self.val = 0
        self.isPtr = False

    @staticmethod
    def fromReal(x):
        z = Variable()
        if isinstance(x, primitives):
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

class VariableCollection:
    def __init__(self, collection: dict):
        self.vars = {}
        for varName, varVal in collection.items():
            var = Variable()
            if isinstance(varVal, primitives):
                var.isPtr = False
                var.val = varVal
            else:
                var.isPtr = True
                var.val = id(varVal)
            self.vars[varName] = var

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
        if isinstance(e, primitives):
            return
        elif isinstance(e, list):
            if id(e) not in self.objects:
                self.objects[id(e)] = [0] * len(e)
            for i, child in enumerate(e):
                self.objects[id(e)][i] = Variable.fromReal(child)
                self.trackTransitive(child)
        elif isinstance(e, tuple):
            for i, child in e:
                self.trackTransitive(child)
        elif isinstance(e, dict):
            if id(e) not in self.objects:
                self.objects[id(e)] = {}
            for k, v in e.items():
                self.objects[id(e)][k] = Variable.fromReal(v)
                self.trackTransitive(v)
        else:
            raise Exception('Object type not supported ' + str(eType))

    def toJson(self):
        jsonHeap = {}
        for ptr, e in self.objects.items():
            if type(e) == list:
                jsonHeap[ptr] = [z.toJson() for z in e]
            elif type(e) == dict:
                jsonHeap[ptr] = {k: v.toJson() for k, v in e.items()}
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
                    diffLog += VirtualHeap.dictDiff(ptr, prevE, e)
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

    def getActiveFrame(self):
        return self.frames[-1]

class ProgramHistory:
    def __init__(self):
        self.state = ProgramState()
        self.log = []

    def pushFrame(self, frame: ProgramFrame):
        prevHeap = self.state.heap.toJson()
        self.state.pushFrame(frame)
        self.log.append(('pushFrame', frame))
        self.state.heap.trackAll(self.state.getReachableVars())
        curHeap = self.state.heap.toJson()
        self.log += VirtualHeap.heapDiff(prevHeap, curHeap)

    def popFrame(self, returnVal):
        prevHeap = self.state.heap.toJson()
        self.state.popFrame()
        self.log.append(('return', returnVal))
        self.log.append(('popFrame', returnVal))
        self.state.heap.trackAll(self.state.getReachableVars())
        curHeap = self.state.heap.toJson()
        self.log += VirtualHeap.heapDiff(prevHeap, curHeap)

    def update(self, frame: ProgramFrame, globals):
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

        prevHeap = self.state.heap.toJson()

        self.state.update(frame, globals)

        self.state.heap.trackAll(self.state.getReachableVars())
        curHeap = self.state.heap.toJson()
        self.log += VirtualHeap.heapDiff(prevHeap, curHeap)

        self.log.append(('line', frame.lineNumber))

    @staticmethod
    def filterGlobals(globals) -> dict:
        return {varName: varValue for varName, varValue in globals.items() if varName.endswith('_g')}

    def toJson(self):
        jsonLog = []
        for e in self.log:
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
            jsonLog.append(jsonE)
        return jsonLog

    def __repr__(self):
        return json.dumps(self.toJson(), indent=2)

history: ProgramHistory = ProgramHistory()

def traceit(frame: FrameType, event, arg):
    if event == "call":
        base: FrameType = frame
        mainFound = False
        while base:
            if base.f_code.co_name == "main":
                mainFound = True
                break
            base = base.f_back
        if not mainFound:
            return None

    if event == "call":
        history.pushFrame(ProgramFrame.fromTraceFrame(frame))
    elif event == "return":
        history.popFrame(arg)
    elif event == "line":
        history.update(ProgramFrame.fromTraceFrame(frame), frame.f_globals)
    return traceit

sys.settrace(traceit)

def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    ans = 0
    ans += fibonacci(n-1)
    ans += fibonacci(n-2)
    return ans

def fillList(v):
    for i in range(5):
        v[i] = i+100

def mergesort(v, start, end):
    if end - start <= 1:
        return
    mid = start + int((end - start) / 2)
    mergesort(v, start, mid)
    mergesort(v, mid, end)
    v1 = v[start:mid]
    v2 = v[mid:end]
    i1 = 0
    i2 = 0
    i = start
    while True:
        if i1 < len(v1) and i2 < len(v2):
            if v1[i1] < v2[i2]:
                v[i] = v1[i1]
                i+=1
                i1+=1
            else:
                v[i] = v2[i2]
                i+=1
                i2+=1
        elif i1 >= len(v1) and i2 >=len(v2):
            break
        elif i1 < len(v1):
            v[i] = v1[i1]
            i+=1
            i1+=1
        else:
            v[i] = v2[i2]
            i+=1
            i2+=1

def main():
    v = [9,8,7,6,5,4,3,2,1]
    mergesort(v, 0, len(v))

main()
print(history)
