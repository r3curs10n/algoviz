import { isNullOrUndefined } from "util"

export class VmObject {
  boolValue?: boolean
  numberValue?: number
  ptrValue?: number
  stringValue?: string

  modifiedAtStep?: number

  toString() {
    if (!isNullOrUndefined(this.boolValue)) {
      return '' + this.boolValue
    } else if (!isNullOrUndefined(this.numberValue)) {
      return '' + this.numberValue
    } else if (!isNullOrUndefined(this.ptrValue)) {
      return '#' + this.ptrValue
    } else if (!isNullOrUndefined(this.stringValue)) {
      return '"' + this.stringValue + '"'
    }
    return 'null'
  }

  static fromBool(val: boolean) {
    let e = new VmObject()
    e.boolValue = val
    return e
  }

  static fromNumber(val: number) {
    let e = new VmObject()
    e.numberValue = val
    return e
  }

  static fromPtr(val: number) {
    let e = new VmObject()
    e.ptrValue = val
    return e
  }

  static fromString(val: string) {
    let e = new VmObject()
    e.stringValue = val
    return e
  }

  static fromVal(x: Array<any>) {
    const isPtr = x[0]
    const val = x[1]

    if (isPtr) {
      return VmObject.fromPtr(val)
    }

    if (val == null || val == undefined) {
      return new VmObject()
    } else if (typeof val == "string") {
      return VmObject.fromString(val)
    } else if (typeof val == "number") {
      return VmObject.fromNumber(val)
    } else if (typeof val == "boolean") {
      return VmObject.fromBool(val)
    }

    return new VmObject()
  }
}

export class VmStackFrame {
  methodName: string
  args: Map<string, VmObject> = new Map()
  locals: Map<string, VmObject> = new Map()
  returnVal?: VmObject

  constructor(methodName: string, args: Map<string, VmObject>) {
    this.methodName = methodName
    this.args = args
  }

  getVariable(name: string): VmObject {
    if (this.locals.has(name)) {
      return this.locals.get(name)
    }
    if (this.args.has(name)) {
      return this.args.get(name)
    }
    return null
  }

  getAllVariables() {
    const vars: Map<string, VmObject> = new Map()
    this.args.forEach((v, k) => vars.set(k, v))
    this.locals.forEach((v, k) => vars.set(k, v))
    return vars
  }
}

export class VmStack {
  frames: Array<VmStackFrame> = []

  pushFrame(frame: VmStackFrame) {
    this.frames.push(frame)
  }

  markFrameReturn(val: VmObject) {
    this.getTopFrame().returnVal = val
  }

  popFrame() {
    this.frames.pop()
  }

  getTopFrame() {
    return this.frames[this.frames.length  - 1]
  }
}

interface ExecutionStep {
  op: string,
  info: any,
}

interface ArrayIndexInference {
  funcName: string,
  array: string,
  var: string,
  index: number
}

export interface MemberPointerInference {
  className: string,
  member: string
}

interface Inference {
  type: string,
  data: any
}

interface ArrayIndexAnnotation {
  indexVarName: string,
  indexVarValue: number,
  indexDimension: number
}

export class VmHeapObject {
  type: string
  ptr: number
  listObject?: Array<VmObject>
  mapObject?: Map<string, VmObject>

  constructor(ptr: number, type){
    this.type = type
    this.ptr = ptr
  }
}

export class VmHeap {
  storage: Map<number, VmHeapObject>
  namedReferences: Set<number>

  constructor() {
    this.storage = new Map()
    this.namedReferences = new Set()
  }

  updateNamedReferences(stack: VmStack) {
    this.namedReferences = new Set()
    stack.frames.forEach((frame) => {
      frame.args.forEach((arg) => {
        if (arg.ptrValue !== null) {
          this.namedReferences.add(arg.ptrValue)
        }
      })
      frame.locals.forEach((local) => {
        if (local.ptrValue !== null) {
          this.namedReferences.add(local.ptrValue)
        }
      })
    })
  }
}

export class VmEngine {
  stack: VmStack
  heap: VmHeap
  programTrace: Array<ExecutionStep>
  programInfer: Array<Inference>
  executionStepIndex: number = -1
  executionLineNumber: number = -1

  constructor(trace) {
    this.programTrace = trace.log
    this.programInfer = trace.infer
    this.stack = new VmStack()
    this.heap = new VmHeap()
  }

  getTopFrameNamedReferencesMap() {
    const map: Map<number, Array<string>> = new Map()
    if (isNullOrUndefined(this.stack.getTopFrame())) {
      return map
    }

    this.stack.getTopFrame().getAllVariables().forEach((v, k) => {
      if (isNullOrUndefined(v.ptrValue)) {
        return
      }
      if (!map.has(v.ptrValue)) {
        map.set(v.ptrValue, [])
      }
      map.get(v.ptrValue).push(k)
    })
    return map
  }

  nextStep() {
    this.nextStepInternal()
  }

  isAboutToEnterFunction() {
    if (this.executionStepIndex <= 0) {
      return false
    }
    return this.executionStepIndex + 1 < this.programTrace.length && this.programTrace[this.executionStepIndex + 1].op === "pushFrame"
  }

  nextAndSkipFunction() {
    if (this.isAboutToEnterFunction()) {
      let depth = 0
      let movedForward = false
      while (true) {
        if (this.executionStepIndex >= this.programTrace.length) {
          break
        }
        if (this.programTrace[this.executionStepIndex].op === "pushFrame") {
          depth++
        } else if (this.programTrace[this.executionStepIndex].op === "popFrame") {
          depth--
          movedForward = true
        }
        this.nextStepInternal()
        if (depth === 0 && movedForward) {
          break
        }
      }
    }
  }

  executeStep(e: any) {
    if (e.op == "line") {
      this.executionLineNumber = e.info
    } else if (e.op == "pushFrame") {
      const args: Map<string, any> = new Map(Object.entries(e.info.locals))
      const wrappedArgs: Map<string, VmObject> = new Map()
      args.forEach((val: any, key: string, _) => {
        wrappedArgs.set(key, VmObject.fromVal(val))
      })
      const frame = new VmStackFrame(e.info.function, wrappedArgs)
      this.stack.pushFrame(frame)
      this.executionLineNumber = e.info.line
    } else if (e.op == "newLocal" || e.op == "updateLocal") {
      const obj = VmObject.fromVal(e.info[1])
      obj.modifiedAtStep = this.executionStepIndex
      this.stack.getTopFrame().locals.set(e.info[0], obj)
    } else if (e.op == "return") {
      // this.executionLineNumber = -1
      this.stack.getTopFrame().returnVal = VmObject.fromVal(e.info)
      this.stack.getTopFrame().returnVal.modifiedAtStep = this.executionStepIndex
    } else if (e.op == "popFrame") {
      // this.executionLineNumber = -1
      this.stack.popFrame()
    } else if (e.op == "new") {
      const id: number = e.info[0]
      let obj = new VmHeapObject(id, "")
      if (Array.isArray(e.info[1])) {
        const val: Array<any> = e.info[1]
        obj.listObject = val.map((z => VmObject.fromVal(z)))
        obj.type = "list"
      } else {
        obj.type = e.info[1].type
        obj.mapObject = new Map()
        Object.entries(e.info[1].members).forEach(([key, val]) => {
          obj.mapObject.set(key, VmObject.fromVal(val as Array<any>))
        })
      }
      this.heap.storage.set(id, obj)
    } else if (e.op == "modifyPos") {
      const id: number = e.info[0]
      const pos: number = e.info[1]
      const val: any = e.info[2]
      const curList = this.heap.storage.get(id)
      const obj = VmObject.fromVal(val)
      obj.modifiedAtStep = this.executionStepIndex
      if (pos >= curList.listObject.length) {
        curList.listObject.push(obj)
      } else {
        curList.listObject[pos] = obj
      }
    } else if (e.op == "modifyKey" || e.op == "addKey") {
      const id: number = e.info[0]
      const key = e.info[1]
      const val = e.info[2]
      const curMap = this.heap.storage.get(id)
      const obj = VmObject.fromVal(val)
      obj.modifiedAtStep = this.executionStepIndex
      curMap.mapObject.set(key, obj)
    } else if (e.op == "delete") {
      this.heap.storage.delete(e.info)
    } else if (e.op == "batch") {
      e.info.forEach(z => this.executeStep(z))
    }
  }

  nextStepInternal() {
    this.executionStepIndex++
    if (this.executionStepIndex >= this.programTrace.length) {
      return false
    }

    const e = this.programTrace[this.executionStepIndex]
    this.executeStep(e)

    this.heap.updateNamedReferences(this.stack)
    return true
  }

  prevStep() {
    const stepToGo = this.executionStepIndex - 1
    this.reset()
    for (let i = 0; i < stepToGo; i++) {
      this.nextStep()
    }
  }

  reset() {
    this.executionLineNumber = -1
    this.executionStepIndex = -1
    this.stack = new VmStack()
  }

  getMemberPointerAnnotationsFor(ptr: number) {
    const obj = this.heap.storage.get(ptr)
    return this.programInfer.filter(
      e => e.type === "memberPointer" && e.data.className === obj.type
    ).map(
      e => e.data as MemberPointerInference
    )
  }

  getArrayIndexAnnotationsFor(ptr: number) {
    const frame = this.stack.getTopFrame()
    const inferences: Array<ArrayIndexAnnotation> = []
    frame.locals.forEach((localVarValue, localVarName) => {
      this.programInfer.forEach(genericInference => {
        if (genericInference.type !== "arrayIndex") {
          return
        }
        const inference: ArrayIndexInference = genericInference.data
        if (inference.funcName !== frame.methodName) {
          return
        }
        if (inference.var !== localVarName) {
          return
        }
        if (frame.getVariable(inference.array).ptrValue !== ptr) {
          return
        }
        inferences.push({
          indexVarName: localVarName,
          indexVarValue: localVarValue.numberValue,
          indexDimension: inference.index
        })
      })
    })
    return inferences
  }
}
