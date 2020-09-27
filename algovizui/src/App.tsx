import React from 'react';
import './App.css';
import { trace as DummyTrace } from './traces/sample'
import { ProgramStackUI } from './ui/stack/ProgramStackUI';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { VmEngine } from './vm/VirtualMachine';
import { Button, ButtonGroup, Navbar, NavbarBrand, Nav, NavLink, Container, Row, Col } from 'react-bootstrap'
import Editor from "@monaco-editor/react";
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.main';
import { ProgramHeapUI } from './ui/stack/ProgramHeapUI';


const dummyCode: string = `def fibonacci(n):
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
    arr2d = [[0,0],[0,0]]
    arr2d[0][1] = 5
    v = [9,8,7,6,5,4,3,2,1]
    mergesort(v, 0, len(v))

main()
`;

interface State {
  lineNumber: number
  highlightedPtr: number
}

class App extends React.Component {
  vmEngine: VmEngine
  state: State
  monaco: any
  decorations: any

  constructor(props) {
    super(props)
    this.vmEngine = new VmEngine(DummyTrace)
    this.state = {
      lineNumber: -1,
      highlightedPtr: 0
    }
    this.decorations = []
  }

  render() {
    const stack = <ProgramStackUI vmEngine={this.vmEngine} onVmObjectClick={ptr => {
      this.setState({ highlightedPtr: ptr })
    }} />

    const heap = <ProgramHeapUI vmEngine={this.vmEngine} highlightedPtr={this.state.highlightedPtr} />

    const incrementExecutionStep = (val: number) => {
      if (val > 0) {
        this.vmEngine.nextStep()
      } else {
        this.vmEngine.prevStep()
      }
      const line = this.vmEngine.executionLineNumber - 296 + 1
      let newDecorations = []
      if (line > 0) {
        this.monaco.revealLineInCenter(line);
        newDecorations = [
          {
            range: new Monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: 'highlightedLine',
            }
          }
        ]
      }
      this.decorations = this.monaco.deltaDecorations(this.decorations, newDecorations)
      this.setState({ lineNumber: this.vmEngine.executionLineNumber })
    }

    const handleEditorDidMount = (_, editor) => {
      this.monaco = editor
    }

    const editor = <>
      <Editor
        height="80vh"
        language="python"
        value={dummyCode}
        editorDidMount={handleEditorDidMount}
      />
      <ButtonGroup>
        <Button><BsArrowLeft onClick={() => { incrementExecutionStep(-1) }} /></Button>
        <Button><BsArrowRight onClick={() => { incrementExecutionStep(1) }} /></Button>
      </ButtonGroup>
    </>

    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Aphrodite</Navbar.Brand>
          <Nav className="mr-auto" navbar></Nav>
          <NavLink href="#">About</NavLink>
        </Navbar>
        <div className="padded-container">
          <Container fluid={true}>
            <Row>
              <Col xs="5">
                {editor}
              </Col>
              <Col xs="3">
                {stack}
              </Col>
              <Col>
                {heap}
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default App;
