import React from 'react';
import './App.css';
import { trace as DummyTrace } from './traces/sample'
import { ProgramStackUI } from './ui/stack/ProgramStackUI';
import { BsArrowLeft, BsArrowRight, BsArrowBarRight } from 'react-icons/bs'
import { VmEngine } from './vm/VirtualMachine';
import { Button, ButtonGroup, Navbar, NavbarBrand, Nav, NavLink, Container, Row, Col, Form, Spinner, Tooltip, OverlayTrigger, Popover, Alert, NavDropdown, FormControl } from 'react-bootstrap'
import Editor from "@monaco-editor/react";
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.main';
import { ProgramHeapUI } from './ui/stack/ProgramHeapUI';
import superagent from 'superagent'
import { isNullOrUndefined } from 'util';
import { ProgramList } from './samples/Programs'
import { LinkContainer } from "react-router-bootstrap"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

interface State {
  lineNumber: number
  highlightedPtr: number
  isEditing: boolean
  isWaiting: boolean
  code: string
  trace: any
}

const AppContainer = () => {
  return (
    <Router forceRefresh>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Gnutella</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Sample Programs" id="basic-nav-dropdown">
              {
                ProgramList.map(p => {
                  return <LinkContainer to={p.route}><NavDropdown.Item>{p.name}</NavDropdown.Item></LinkContainer>
                })
              }
            </NavDropdown>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="padded-container">
        <Container fluid >
          <Switch>
            {
              ProgramList.map(p => {
                return <Route path={p.route}>
                  <App code={p.code} />
                </Route>
              })
            }
            <Route path="/">
              <App code={ProgramList[0].code} />
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  )
}

interface AppProps {
  code: string
}

class App extends React.Component<AppProps> {
  vmEngine: VmEngine
  state: State
  monaco: any
  decorations: any

  constructor(props: AppProps) {
    super(props)
    this.vmEngine = new VmEngine(DummyTrace)
    this.state = {
      lineNumber: -1,
      highlightedPtr: 0,
      isEditing: true,
      isWaiting: false,
      code: props.code,
      trace: DummyTrace
    }
    this.decorations = []
  }

  render() {
    const onVmObjectClick = ptr => {
      this.setState({ highlightedPtr: ptr })
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
          <Button onClick={() => { incrementExecutionStep(10) }} disabled={!this.vmEngine.isAboutToEnterFunction()} ><BsArrowBarRight /> Step Over Function</Button>
        </ButtonGroup>
      } else if (this.state.isWaiting === true) {
        return <Spinner animation="border" />
      }
      return <></>
    }

    const maybeError = !this.state.isEditing && !this.state.isWaiting && !isNullOrUndefined(this.state.trace.error) && (this.state.trace.error.type !== "runtime" || this.vmEngine.executionStepIndex >= this.vmEngine.programTrace.length) ? <Alert style={{ marginTop: "15px" }} key="error" variant="danger">
      {this.state.trace.error.msg}
    </Alert> : null

    const editor = <>
      <Editor
        height="70vh"
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
      {maybeError}
    </>

    return (
      <>
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
      </>
    );
  }
}

export default AppContainer;
