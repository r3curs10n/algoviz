import { isNullOrUndefined } from "util"
import { VmObject } from "../../vm/VirtualMachine"
import React from 'react'
import { BsTag } from "react-icons/bs"

interface ProgramObjectUIProps {
  name?: string
  object: VmObject
  executionStepIndex: number
  highlightedPtr?: number
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
        {(() => {
          if (props.object.ptrValue === 0) {
            return 'None'
          }
          if (props.object.ptrValue === -1) {
            return 'Tuple'
          }
          if (props.highlightedPtr === props.object.ptrValue) {
            return <>{'Show'} <BsTag/></>
          }
          return 'Show'
        })()}
      </a>
    </div>
  }
}
