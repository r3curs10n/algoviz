import { VmHeap, VmObject, VmHeapObject, VmEngine, MemberPointerInference } from '../../vm/VirtualMachine'
import { ListGroup, ListGroupItem, Table, Card } from 'react-bootstrap'
import React from 'react'
import 'visjs-network/dist/vis.css'
import './heap-graph.css'
import { isNullOrUndefined } from 'util'
const visjs = require('visjs-network/dist/vis')

interface ProgramHeapGraphUIProps {
  vmEngine: VmEngine
  data: any
  highlightedPtr: number
}

export class ProgramHeapGraphUI extends React.Component<ProgramHeapGraphUIProps> {
  visjsDomRef: React.RefObject<any>
  graph: any
  options: any

  constructor(props: ProgramHeapGraphUIProps) {
    super(props)
    this.visjsDomRef = React.createRef()
    this.options = {
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed"
        },
      },
    }
  }

  static getLabelFor(obj: VmHeapObject, annotations: Array<MemberPointerInference>) {
    let dataMemebrs = []
    obj.mapObject.forEach((val, key) => {
      if (!annotations.find(e => e.member === key)) {
        dataMemebrs.push(`${key}: ${val.toString()}`)
      }
    })
    return dataMemebrs.length > 0 ? dataMemebrs.join("\n") : "..."
  }

  static createUI(vmEngine: VmEngine, highlightedPtr: number) {
    const heap = vmEngine.heap
    const nodes = []
    const edges = []
    const consumed = new Set()
    heap.storage.forEach((obj, ptr) => {
      const annotations = vmEngine.getMemberPointerAnnotationsFor(ptr)
      console.log('annotations')
      console.log(annotations)
      if (annotations.length > 0) {
        consumed.add(ptr)
        nodes.push({id: ptr, label: ProgramHeapGraphUI.getLabelFor(obj, annotations)})
        annotations.forEach(annotation => {
          if (obj.mapObject.has(annotation.member) && obj.mapObject.get(annotation.member).ptrValue !== 0)
          edges.push({from: ptr, to: obj.mapObject.get(annotation.member).ptrValue, arrows: "to"})
        })
      }
    })
    const data = {
      nodes: new visjs.DataSet(nodes),
      edges: new visjs.DataSet(edges),
    }
    console.log('fdata')
    console.log(data)
    return {
      consumed: consumed,
      ui: <ProgramHeapGraphUI data={data} vmEngine={vmEngine} highlightedPtr={highlightedPtr} />
    }
  }

  componentDidMount() {
    this.graph = new visjs.Network(this.visjsDomRef.current, this.props.data, this.options);
  }

  render() {
    if (!isNullOrUndefined(this.visjsDomRef.current)) {
      console.log('render')
      console.log(this.props.data)
      this.graph = new visjs.Network(this.visjsDomRef.current, this.props.data, this.options);
      if (!isNullOrUndefined(this.props.data.nodes.get(this.props.highlightedPtr))) {
        this.props.data.nodes.update([{id: this.props.highlightedPtr, color: {background: "#AAFFAA"}}])
      }
    }
    return <div className="heap-graph" ref={this.visjsDomRef}></div>
  }
}
