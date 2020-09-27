import { VmHeap, VmObject, VmHeapObject, VmEngine } from '../../vm/VirtualMachine'
import { ListGroup, ListGroupItem, Table, Card } from 'react-bootstrap'
import React from 'react'
import { isNullOrUndefined } from 'util'
import { ProgramObjectUI } from './ProgramObjectUI'

class OneDArray {
  static is(obj: VmHeapObject, _vmEngine: VmEngine) {
    if (obj.listObject === null) {
      return false
    }
    return obj.listObject.every(e => isNullOrUndefined(e.ptrValue))
  }

  static getUI(obj: VmHeapObject, vmEngine: VmEngine) {
    const arr = obj.listObject
    const ui = <Table bordered size="sm">
      <thead>
        <tr>
          {arr.map((_, idx) => <th>{idx}</th>)}
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
    if (obj.listObject === null) {
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

    const rowUi = (idx: number, list: VmHeapObject) => {
      return <tr>
        <th>{idx}</th>
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
            return <th>{idx}</th>
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

interface ProgramHeapUIProps {
  vmEngine: VmEngine,
  highlightedPtr: number
}

const createUIFor = (obj: VmHeapObject, vmEngine: VmEngine) => {
  if (OneDArray.is(obj, vmEngine)) {
    return OneDArray.getUI(obj, vmEngine)
  }
  if (TwoDArray.is(obj, vmEngine)) {
    return TwoDArray.getUI(obj, vmEngine)
  }
  return {
    consumed: new Set(),
    ui: <div>Not Supported</div>
  }
}

export const ProgramHeapUI = (props: ProgramHeapUIProps) => {
  const heap = props.vmEngine.heap

  const consumed = new Set()
  const elements = []

  const addUI = (ptr: number, e: VmHeapObject) => {
    const r = createUIFor(e, props.vmEngine)
    r.consumed.forEach(v => consumed.add(v))
    elements.push(
      <Card border={props.highlightedPtr === ptr ? "primary" : null}>
        <Card.Body>
          {r.ui}
        </Card.Body>
      </Card>
    )
  }

  heap.namedReferences.forEach(ptr => {
    if (!heap.storage.has(ptr)) {
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
