import React from 'react';
import './App.css';
import { trace as DummyTrace } from './traces/sample'
import { ProgramStackUI } from './ui/stack/ProgramStackUI';
import { BsArrowLeft, BsArrowRight, BsArrowBarRight, BsPlay, BsPause, BsArrowCounterclockwise } from 'react-icons/bs'
import { VmEngine } from './vm/VirtualMachine';
import { Button, ButtonGroup, Navbar, NavbarBrand, Nav, NavLink, Container, Row, Col, Form, Spinner, Tooltip, OverlayTrigger, Popover, Alert, NavDropdown, FormControl, ProgressBar } from 'react-bootstrap'
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

interface State {
  lineNumber: number
  highlightedPtr: number
  isEditing: boolean
  isWaiting: boolean
  isPaused: boolean
  code: string
  trace: any
}

class App extends React.Component<AppProps> {
  vmEngine: VmEngine
  state: State
  monaco: any
  decorations: any
  timer: any

  constructor(props: AppProps) {
    super(props)
    this.vmEngine = new VmEngine(DummyTrace)
    this.state = {
      lineNumber: -1,
      highlightedPtr: 0,
      isEditing: true,
      isWaiting: false,
      isPaused: true,
      code: props.code,
      trace: DummyTrace
    }
    this.decorations = []
  }

  pause() {
    this.setState({isPaused: true})
    this.vmEngine.enableFastForward = false
    if (!isNullOrUndefined(this.timer)) {
      clearInterval(this.timer)
    }
  }

  play() {
    this.setState({isPaused: false})
    this.vmEngine.enableFastForward = true
    this.timer = setInterval(() => {
      if (!this.vmEngine.hasExecutionFinished()) {
        this.incrementExecutionStep(1)
      }
    }, 1000 /* ms */)
  }

  incrementExecutionStep = (val: number) => {
    if (val === 0) {
      this.vmEngine.reset()
    } else if (val === 1) {
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

  render() {
    const onVmObjectClick = ptr => {
      this.setState({ highlightedPtr: ptr })
    }
    const stack = <ProgramStackUI highlightedPtr={this.state.highlightedPtr} vmEngine={this.vmEngine} onVmObjectClick={onVmObjectClick} />

    const heap = <ProgramHeapUI vmEngine={this.vmEngine} highlightedPtr={this.state.highlightedPtr} onVmObjectClick={onVmObjectClick} />

    const handleEditorDidMount = (_, editor) => {
      this.monaco = editor
    }

    const enterEditMode = () => {
      this.decorations = this.monaco.deltaDecorations(this.decorations, [])
      this.setState({ isEditing: true, isWaiting: false })
      this.pause()
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
            this.play()
          }
        })
    }

    const getRunControls = () => {
      if (this.state.isEditing === false && this.state.isWaiting == false) {
        return <ButtonGroup>
          <Button onClick={() => { this.incrementExecutionStep(0) }} disabled={!this.state.isPaused} ><BsArrowCounterclockwise />Restart</Button>
          <Button onClick={() => { this.incrementExecutionStep(-1) }} disabled={!this.state.isPaused} ><BsArrowLeft />Previous</Button>
          <Button onClick={() => { this.state.isPaused ? this.play() : this.pause() }}>
            { this.state.isPaused ? <><BsPlay />{'Play'}</> : <><BsPause />{'Pause'}</> }
          </Button>
          <Button onClick={() => { this.incrementExecutionStep(1) }} disabled={!this.state.isPaused} ><BsArrowRight />Next</Button>
          <Button onClick={() => { this.incrementExecutionStep(10) }} disabled={!this.state.isPaused || !this.vmEngine.isAboutToEnterFunction()} ><BsArrowBarRight /> Step Over Function</Button>
        </ButtonGroup>
      } else if (this.state.isWaiting === true) {
        return <Spinner animation="border" />
      }
      return <></>
    }

    const maybeError = !this.state.isEditing && !this.state.isWaiting && !isNullOrUndefined(this.state.trace.error) && (this.state.trace.error.type !== "runtime" || this.vmEngine.executionStepIndex >= this.vmEngine.programTrace.length) ? <Alert style={{ marginTop: "15px" }} key="error" variant="danger">
      {this.state.trace.error.msg}
    </Alert> : null

    const maybeProgressBar = !this.state.isEditing && !this.state.isWaiting ? <ProgressBar style={{ marginTop: "15px" }} now={100.0 * Math.max(this.vmEngine.executionStepIndex, 0) / this.vmEngine.programTrace.length} /> : null

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
              this.state.isEditing ? <Button onClick={enterRunMode}>Run</Button> : <Button onClick={enterEditMode} disabled={!this.state.isPaused} >Edit</Button>
            }
          </Col>
        </Form.Row>
      </Form>
      {maybeProgressBar}
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
