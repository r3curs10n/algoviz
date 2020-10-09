from __future__ import annotations
import typing

import argparse
import tracer
import infer
import sys
import json
import importlib

import tracer

class RunnerOutput:
    def __init__(self, error = None, log = [], inferences = []):
        self.error = error
        self.log = log
        self.inferences = inferences

    def toJson(self):
        return {"error": self.error, "log": self.log, "infer": self.inferences}

    def toJsonStr(self):
        return json.dumps(self.toJson())

def __run(moduleName):
    code = open(moduleName.replace(".", "/") + ".py").read()
    error = None
    try:
        error, inferences = infer.infer(code)
    except SyntaxError as e:
        print(RunnerOutput(error={"type": "syntax_error", "line": e.lineno, "msg": "Line {}: {}".format(e.lineno, e.msg)}).toJsonStr())
        return
    if not error is None:
        print(RunnerOutput(error=error).toJsonStr())
        return

    try:
        module = importlib.import_module(moduleName)
        module.main()
    except tracer.TimeoutException:
        print(RunnerOutput(error={"type": "timeout", "msg": "Code timed out"}, log=tracer.history.toJson(), inferences=inferences).toJsonStr())
        return
    except:
        print(RunnerOutput(error={"type": "runtime", "msg": str(sys.exc_info()[0])}, log=tracer.history.toJson(), inferences=inferences).toJsonStr())
        return

    print(RunnerOutput(error=error, log=tracer.history.toJson(), inferences=inferences).toJsonStr())

parser = argparse.ArgumentParser()
parser.add_argument('--module', help='Module name to trace')
args = parser.parse_args()

if not args.module:
    __run("inputs.test")
else:
    __run(args.module)
