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

export class VmHeapObject {
  listObject?: Array<VmObject>
  mapObject?: Map<string, VmObject>

  constructor(){}
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
  executionStepIndex: number = -1
  executionLineNumber: number = -1

  constructor(programTrace: Array<ExecutionStep>) {
    this.programTrace = programTrace
    this.stack = new VmStack()
    this.heap = new VmHeap()
  }

  nextStep() {
    this.nextStepInternal()
    // let curLine = this.executionLineNumber
    // while (this.executionLineNumber == curLine) {
    //   if (!this.nextStepInternal()) {
    //     break
    //   }
    // }
  }

  nextStepInternal() {
    this.executionStepIndex++
    if (this.executionStepIndex >= this.programTrace.length) {
      return false
    }

    const e = this.programTrace[this.executionStepIndex]

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
      this.executionLineNumber = -1
      this.stack.getTopFrame().returnVal = VmObject.fromVal(e.info)
    } else if (e.op == "popFrame") {
      this.executionLineNumber = -1
      this.stack.popFrame()
    } else if (e.op == "new") {
      const id: number = e.info[0]
      let obj = new VmHeapObject()
      if (Array.isArray(e.info[1])) {
        const val: Array<any> = e.info[1]
        obj.listObject = val.map((z => VmObject.fromVal(z)))
      } else {
        // handle map case
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
    } else if (e.op == "delete") {
      this.heap.storage.delete(e.info)
    }

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
}
