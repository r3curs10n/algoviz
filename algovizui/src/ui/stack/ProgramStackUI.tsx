import { VmEngine, VmStackFrame, VmObject } from '../../vm/VirtualMachine'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import React from 'react'
import { ProgramObjectUI } from './ProgramObjectUI'
import { isNullOrUndefined } from 'util'

export interface ProgramStackUIProps {
  vmEngine: VmEngine,
  onVmObjectClick?: (ptr: number) => void
}

interface ProgramStackFrameUIProps {
  vmEngine: VmEngine,
  frame: VmStackFrame,
  onVmObjectClick?: (ptr: number) => void
}

const ProgramStackFrameUI = (props: ProgramStackFrameUIProps) => {
  const locals = []
  props.frame.args.forEach((val, key, _) => {
    locals.push(<ProgramObjectUI name={key} object={val} onClick={props.onVmObjectClick} executionStepIndex={props.vmEngine.executionStepIndex} />)
  })
  props.frame.locals.forEach((val, key, _) => {
    locals.push(<ProgramObjectUI name={key} object={val} onClick={props.onVmObjectClick} executionStepIndex={props.vmEngine.executionStepIndex} />)
  })

  let maybeReturn = null
  if (!isNullOrUndefined(props.frame.returnVal)) {
    maybeReturn = <div>
      <ProgramObjectUI name="Return" object={props.frame.returnVal} onClick={props.onVmObjectClick} executionStepIndex={props.vmEngine.executionStepIndex} />)
    </div>
  }

  return <div>
    <div>
    {props.frame.methodName + '()'}
    </div>
    <div>
      {locals}
    </div>
    { maybeReturn}
  </div>
}

export const ProgramStackUI = (props: ProgramStackUIProps) => {
  return <ListGroup>
    {props.vmEngine.stack.frames.map(frame => {
      return <ListGroupItem>
        <ProgramStackFrameUI frame={frame} onVmObjectClick={props.onVmObjectClick} vmEngine={props.vmEngine} />
      </ListGroupItem>
    })}
  </ListGroup>
}
