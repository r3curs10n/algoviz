import React from 'react';
import './App.css';
import { trace as DummyTrace } from './traces/sample'
import { ProgramStackUI } from './ui/stack/ProgramStackUI';
import { BsArrowLeft, BsArrowRight, BsArrowBarRight } from 'react-icons/bs'
import { VmEngine } from './vm/VirtualMachine';
import { Button, ButtonGroup, Navbar, NavbarBrand, Nav, NavLink, Container, Row, Col, Form, Spinner, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap'
import Editor from "@monaco-editor/react";
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.main';
import { ProgramHeapUI } from './ui/stack/ProgramHeapUI';
import superagent from 'superagent'


const dummyCode: string = `

def fillMatrix(m):
    """
    index: m[i][j]
    """
    for i in range(len(m)):
        for j in range(len(m[0])):
            m[i][j] = i+j

def fibonacci(n):
    if n == 0 or n == 1:
        return 1
    ans = 0
    ans += fibonacci(n-1)
    ans += fibonacci(n-2)
    return ans

class TreeNode:
    """
    pointers: left, right
    """
    def __init__(self):
        self.data = 0
        self.left = None
        self.right = None

class ListNode:
    """
    pointers: next
    """
    def __init__(self):
        self.data = 0
        self.next = None

def constructList():
    head = ListNode()
    head.data = 1

    cur = head
    for i in range (2, 5):
        cur.next = ListNode()
        cur.next.data = i
        cur = cur.next
    return head

def constructTree():
    a = TreeNode()
    b = TreeNode()
    c = TreeNode()
    a.data = 1
    b.data = 2
    c.data = 3
    a.left = b
    a.right = c
    a.data += 1

def reverseList(head):
    if head.next is None:
        return (head, head)
    newHead, newTail = reverseList(head.next)
    newTail.next = head
    head.next = None
    return newHead, head

def main():
    # constructTree()
    # testMap = {1: 100, 2: 200}
    m = [[0,0,0], [0,0,0], [0,0,0]]
    fillMatrix(m)
    # fibonacci(4)

    l = constructList()
    newHead, newTail = reverseList(l)
    return 0



`;

interface State {
  lineNumber: number
  highlightedPtr: number
  isEditing: boolean
  isWaiting: boolean
  code: string
  trace: any
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
      highlightedPtr: 0,
      isEditing: true,
      isWaiting: false,
      code: dummyCode,
      trace: DummyTrace
    }
    this.decorations = []
  }

  render() {
    const onVmObjectClick = ptr => {
      this.setState({ highlightedPtr: ptr})
    }
    const stack = <ProgramStackUI highlightedPtr={this.state.highlightedPtr} vmEngine={this.vmEngine} onVmObjectClick={onVmObjectClick} />

    const heap = <ProgramHeapUI vmEngine={this.vmEngine} highlightedPtr={this.state.highlightedPtr} onVmObjectClick={onVmObjectClick} />

    const incrementExecutionStep = (val: number) => {
      if (val === 1) {
        this.vmEngine.nextStep()
      } else if (val === -1) {
        this.vmEngine.prevStep()
      } else if (val === 10) {
        this.vmEngine.nextAndSkipFunction()
      }
      const line = this.vmEngine.executionLineNumber
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

    const enterEditMode = () => {
      this.decorations = this.monaco.deltaDecorations(this.decorations, [])
      this.setState({ isEditing: true, isWaiting: false })
    }

    const enterRunMode = () => {
      const code: string = this.monaco.getValue()
      this.setState({ isEditing: false, isWaiting: true, code: code, trace: [] })
      superagent
        .post('/trace')
        .send({ code: code })
        .then(res => {
          if (this.state.isWaiting === false) {
            return
          }
          if (res.status !== 200) {
            alert(res.status)
          } else {
            this.vmEngine = new VmEngine(res.body)
            this.setState({ trace: res.body, isWaiting: false })
          }
        })
    }

    const getRunControls = () => {
      if (this.state.isEditing === false && this.state.isWaiting == false) {
        return <ButtonGroup>
          <Button onClick={() => { incrementExecutionStep(-1) }}><BsArrowLeft />Previous</Button>
          <Button onClick={() => { incrementExecutionStep(1) }}><BsArrowRight />Next</Button>
          <Button onClick={() => { incrementExecutionStep(10)}} disabled={!this.vmEngine.isAboutToEnterFunction()} ><BsArrowBarRight /> Step Over Function</Button>
        </ButtonGroup>
      } else if (this.state.isWaiting === true) {
        return <Spinner animation="border" />
      }
      return <></>
    }

    const editor = <>
      <Editor
        height="80vh"
        language="python"
        value={this.state.code}
        theme={this.state.isEditing ? "dark" : "light"}
        editorDidMount={handleEditorDidMount}
        options={{ readOnly: !this.state.isEditing }}
      />
      <Form className="padded-container">
        <Form.Row className="align-items-center">
          <Col xs="auto">{getRunControls()}</Col>
          <Col xs="auto">
            {
              this.state.isEditing ? <Button onClick={enterRunMode}>Run</Button> : <Button onClick={enterEditMode}>Edit</Button>
            }
          </Col>
        </Form.Row>
      </Form>
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
              <Col xs="2">
                {!this.state.isEditing && !this.state.isWaiting ? stack : <></>}
              </Col>
              <Col>
                {!this.state.isEditing && !this.state.isWaiting ? heap : <></>}
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default App;
