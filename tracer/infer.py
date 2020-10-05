import ast
import re
import sys
import argparse
import json

dummyCode = '''
def hello():
    """
    index: v[i][j]
    """

class TreeNode:
    """
    pointers: left, right
    """
    def __init__(self):
        self.left = None
        self.right = None
        self.data = 0
'''

class ArrayIndexInference:
    def __init__(self):
        self.funcName = ""
        self.var = ""
        self.array = ""
        self.index = 0

    def toJson(self):
        dataJson = {"funcName": self.funcName, "array": self.array, "var": self.var, "index": self.index}
        return {"type": "arrayIndex", "data": dataJson}

class MemberPointerInference:
    def __init__(self):
        self.className = ""
        self.member = ""

    def toJson(self):
        dataJson = {"className": self.className, "member": self.member}
        return {"type": "memberPointer", "data": dataJson}

# Returns (error, [inference])
def infer(code):
    tree = ast.parse(code)

    class ArrayIndexInferer(ast.NodeVisitor):
        inferences = []

        def __init__(self):
            self.inferences = []

        def parseArrayIndexInference(self, funcName: str, raw: str):
            if not ":" in raw:
                return
            iType, iValue = [z.strip() for z in raw.split(":")]
            if iType != "index":
                return
            arr = re.search("(\w+)(?:\[\w+\])+", iValue).group(1)
            for i, varMatch in enumerate(re.finditer("\[(\w+)\]", iValue)):
                e = ArrayIndexInference()
                e.funcName = funcName
                e.array = arr
                e.var = varMatch.group(1)
                e.index = i
                self.inferences.append(e)

        # Override
        def visit_FunctionDef(self, node):
            metadata = ast.get_docstring(node)
            if metadata:
                metadata = metadata.split("\n")

                for line in metadata:
                    self.parseArrayIndexInference(node.name, line)

            self.generic_visit(node)

        def parseMemberPointerInference(self, className: str, raw: str):
            if not ":" in raw:
                return
            iType, iValue = [z.strip() for z in raw.split(":")]
            if iType != "pointers":
                return
            for member in [z.strip() for z in iValue.split(",")]:
                e = MemberPointerInference()
                e.className = className
                e.member = member
                self.inferences.append(e)

        # Override
        def visit_ClassDef(self, node):
            metadata = ast.get_docstring(node)
            if metadata:
                metadata = metadata.split("\n")

                for line in metadata:
                    self.parseMemberPointerInference(node.name, line)

            self.generic_visit(node)

    inferer = ArrayIndexInferer()
    inferer.visit(tree)
    return (None, [e.toJson() for e in inferer.inferences])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', help='Filename to run infer on')
    args = parser.parse_args()
    if not args.file:
        print(infer(dummyCode)[1])
    else:
        with open(args.file) as f:
            print(json.dumps(infer(f.read())[1]))
