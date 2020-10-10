import { VmHeap, VmObject, VmHeapObject, VmEngine } from '../../vm/VirtualMachine'
import { ListGroup, ListGroupItem, Table, Card } from 'react-bootstrap'
import React from 'react'
import { isNullOrUndefined } from 'util'
import { ProgramObjectUI } from './ProgramObjectUI'
import { ProgramHeapGraphUI } from './ProgramHeapGraphUI'
import '../../App.css'

class OneDArray {
  static is(obj: VmHeapObject, _vmEngine: VmEngine) {
    if (isNullOrUndefined(obj.listObject)) {
      return false
    }
    return obj.listObject.every(e => isNullOrUndefined(e.ptrValue))
  }

  static getUI(obj: VmHeapObject, vmEngine: VmEngine) {
    const annotations = vmEngine.getArrayIndexAnnotationsFor(obj.ptr)
    const arr = obj.listObject
    const ui = <Table bordered size="sm">
      <thead>
        <tr>
          {arr.map((_, idx) => {
            const indices = annotations.filter(e => e.indexVarValue === idx && e.indexDimension === 0).map(e => e.indexVarName)
            const annotation = indices.length > 0 ? '(' + indices.join(", ") + ')' : ""
            return <th>{`${idx} ${annotation}`}</th>
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          {arr.map((e) => {
            return <td>
              {
                <ProgramObjectUI object={e} executionStepIndex={vmEngine.executionStepIndex} />
              }
            </td>
          })}
        </tr>
      </tbody>
    </Table>

    return {
      consumed: new Set(),
      ui: ui
    }
  }
}

class TwoDArray {
  static is(obj: VmHeapObject, vmEngine: VmEngine) {
    if (isNullOrUndefined(obj.listObject)) {
      return false
    }
    return obj.listObject.every(child => {
      if (isNullOrUndefined(child.ptrValue) || !vmEngine.heap.storage.has(child.ptrValue)) {
        return false
      }
      return OneDArray.is(vmEngine.heap.storage.get(child.ptrValue), vmEngine)
    })
  }

  static getUI(obj: VmHeapObject, vmEngine: VmEngine) {
    const arr = obj.listObject
    const cols = Math.max(...arr.map(e => vmEngine.heap.storage.get(e.ptrValue).listObject.length))

    const annotations = vmEngine.getArrayIndexAnnotationsFor(obj.ptr)

    const rowUi = (idx: number, list: VmHeapObject) => {
      return <tr>
        <th>
          {
            (() => {
              const indices = annotations.filter(e => e.indexVarValue === idx && e.indexDimension === 0).map(e => e.indexVarName)
              const annotation = indices.length > 0 ? '(' + indices.join(", ") + ')' : ""
              return `${idx} ${annotation}`
            }
            )()}
        </th>
        {list.listObject.map(e => {
          return <td>
            <ProgramObjectUI object={e} executionStepIndex={vmEngine.executionStepIndex} />
          </td>
        })}
      </tr>
    }

    const ui = <Table bordered size="sm">
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: cols }).map((_, idx) => {
            const indices = annotations.filter(e => e.indexVarValue === idx && e.indexDimension === 1).map(e => e.indexVarName)
            const annotation = indices.length > 0 ? '(' + indices.join(", ") + ')' : ""
            return <th>{`${idx} ${annotation}`}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {
          arr.map((e, idx) => rowUi(idx, vmEngine.heap.storage.get(e.ptrValue)))
        }
      </tbody>
    </Table>

    const consumed = new Set()
    arr.forEach(e => consumed.add(e.ptrValue))

    return {
      consumed: consumed,
      ui: ui
    }
  }
}

class Dict {
  static is(obj: VmHeapObject, _vmEngine: VmEngine) {
    if (isNullOrUndefined(obj.mapObject) || obj.type !== "dict") {
      return false
    }
    return true
  }

  static getUI(obj: VmHeapObject, vmEngine: VmEngine, onVmObjectClick) {
    const members = obj.mapObject
    const ui = <Table bordered size="sm">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          let rows = []
          members.forEach((val, key) => {
            rows.push(<tr>
              <td>{key}</td>
              <td><ProgramObjectUI object={val} executionStepIndex={vmEngine.executionStepIndex} onClick={onVmObjectClick} /></td>
            </tr>)
          })
          return rows
        })()}
      </tbody>
    </Table>

    return {
      consumed: new Set(),
      ui: ui
    }
  }
}

interface ProgramHeapUIProps {
  vmEngine: VmEngine,
  highlightedPtr: number,
  onVmObjectClick: (ptr: number) => void
}

const createUIFor = (obj: VmHeapObject, vmEngine: VmEngine, onVmObjectClick) => {
  if (OneDArray.is(obj, vmEngine)) {
    return OneDArray.getUI(obj, vmEngine)
  }
  if (TwoDArray.is(obj, vmEngine)) {
    return TwoDArray.getUI(obj, vmEngine)
  }
  if (Dict.is(obj, vmEngine)) {
    return Dict.getUI(obj, vmEngine, onVmObjectClick)
  }
  return {
    consumed: new Set(),
    ui: <div>Object {`#${obj.ptr} (${obj.type})`}</div>
  }
}

export const ProgramHeapUI = (props: ProgramHeapUIProps) => {
  const heap = props.vmEngine.heap

  const consumed = new Set()
  const elements = []

  const addUI = (ptr: number, e: VmHeapObject) => {
    const r = createUIFor(e, props.vmEngine, props.onVmObjectClick)
    r.consumed.forEach(v => consumed.add(v))
    elements.push(
      <Card>
        <Card.Body className={props.highlightedPtr === ptr ? "highlightedBackground" : null}>
          {r.ui}
        </Card.Body>
      </Card>
    )
  }

  const graphUI = ProgramHeapGraphUI.createUI(props.vmEngine, props.highlightedPtr)
  graphUI.consumed.forEach(v => consumed.add(v))
  if (graphUI.consumed.size > 0) {
    elements.push(
      <Card>
        <Card.Body>
          {graphUI.ui}
        </Card.Body>
      </Card>
    )
  }

  heap.namedReferences.forEach(ptr => {
    if (!heap.storage.has(ptr) || consumed.has(ptr)) {
      return;
    }
    consumed.add(ptr)
    addUI(ptr, heap.storage.get(ptr))
  })

  // Add UI for unnamed refs if they haven't been consumed
  heap.storage.forEach((obj, ptr) => {
    if (!consumed.has(ptr)) {
      addUI(ptr, obj)
    }
  })

  return <div>
    {elements}
  </div>
}
