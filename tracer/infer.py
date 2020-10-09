import ast
import re
import sys
import argparse
import json

dummyCode = '''


class TreeNode:
    """
    pointers: left, right
    """
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

def traverseInOrder(outList, root):
    if root.left is not None:
        traverseInOrder(outList, root.left)
    outList.append(root.data)
    if root.right is not None:
        traverseInOrder(outList, root.right)

def constructTree():
    root = TreeNode(0)
    root.left = TreeNode(11)
    root.right = TreeNode(12)
    root.left.left = TreeNode(21)
    root.left.right = TreeNode(22)
    return root

def main():
    root = constructTree()
    outList = []
    traverseInOrder(outList, root)
    exec(0)
    return 0

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

    class Inferer(ast.NodeVisitor):

        def __init__(self):
            self.inferences = []
            self.securityIssue = None

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

        # Override
        def visit_Import(self, node):
            self.securityIssue = "Imports not allowed"

        # Override
        def visit_ImportFrom(self, node):
            self.securityIssue = "Imports not allowed"

        # Override
        def visit_Call(self, node):
            if not isinstance(node.func, ast.Name):
                return
            funcName = node.func.id
            if funcName in ["exec", "eval", "globals", "locals", "dir", "setattr", "getattr", "open", "compile"]:
                self.securityIssue = "Use of {}() not allowed".format(funcName)

        # Override
        def visit_Try(self, node):
            self.securityIssue = "Exceptions not allowed"

        # Override
        def visit_TryExcept(self, node):
            self.securityIssue = "Exceptions not allowed"

        # Override
        def visit_TryFinally(self, node):
            self.securityIssue = "Exceptions not allowed"

    inferer = Inferer()
    inferer.visit(tree)
    error = None
    if not inferer.securityIssue is None:
        error = {"msg": inferer.securityIssue}
    return (error, [e.toJson() for e in inferer.inferences])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', help='Filename to run infer on')
    args = parser.parse_args()
    if not args.file:
        print(infer(dummyCode))
    else:
        with open(args.file) as f:
            print(infer(f.read()))
