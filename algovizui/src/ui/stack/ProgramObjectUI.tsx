import { isNullOrUndefined } from "util"
import { VmObject } from "../../vm/VirtualMachine"
import React from 'react'

interface ProgramObjectUIProps {
  name?: string
  object: VmObject
  executionStepIndex: number
  onClick?: (ptr: number) => void
}

export const ProgramObjectUI = (props: ProgramObjectUIProps) => {
  if (isNullOrUndefined(props.object.ptrValue)) {
    return <div className={props.object.modifiedAtStep === props.executionStepIndex ? "highlightedLine" : ""}>
      {(isNullOrUndefined(props.name) ? '' : (props.name + ': ')) + props.object.toString()}
    </div>
  } else {
    return <div className={props.object.modifiedAtStep === props.executionStepIndex ? "highlightedLine" : ""}>
      {isNullOrUndefined(props.name) ? '' : (props.name + ': ')}
      <a href="#" onClick={() => {
        if (props.onClick !== null) {
          props.onClick(props.object.ptrValue)
        }
      }}>
        show
        </a>
    </div>
  }
}
