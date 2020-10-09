export interface ProgramEntry {
  code: string,
  name: string,
  route: string,
}

export const ProgramList: Array<ProgramEntry> = [
  {
    route: "/programs/reverse-linked-list",
    name: "Reverse Linked List",
    code: `
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

def reverseList(head):
    if head.next is None:
        return (head, head)
    newHead, newTail = reverseList(head.next)
    head.next = None
    newTail.next = head
    return newHead, head

def main():
    myList = constructList()
    newHead, newTail = reverseList(myList)
    return 0
`
  },
  {
    route: "/programs/inorder-traversal",
    name: "Inorder Traversal",
    code: `

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
    return 0
`
  },
  {
    route: "/programs/insertion-sort",
    name: "Insertion Sort",
    code: `
def insertionSort(v):
    """
    index: v[i]
    index: v[j]
    """
    i = 0
    while i < len(v) - 1:
        j = i + 1
        while j >= 1:
            if v[j] < v[j-1]:
                v[j-1], v[j] = v[j], v[j-1]
                j -= 1
            else:
                break
        i += 1

def main():
    v = [4, 3, 2, 1]
    insertionSort(v)
    return 0
`
  }
]
