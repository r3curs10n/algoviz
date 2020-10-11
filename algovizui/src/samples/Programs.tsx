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
    'pointers' instructs the visualizer to draw specified members
    as arrows to other objects

    pointers: next
    """
    def __init__(self):
        self.data = 0
        self.next = None

def constructList():
    """
    'fast-forward' instructs the runner to skip
    step by step visualization in autoplay mode

    fast-forward
    """
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
    'pointers' instructs the visualizer to draw specified members
    as arrows to other objects

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
    """
    'fast-forward' instructs the runner to skip
    step by step visualization in autoplay mode

    fast-forward
    """
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
    'index' instructs the visualizer to draw the specified
    local variables as indexes for the specified array

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
  },
  {
      route: "/programs/longest-increasing-subsequence",
      name: "DP: Longest Increasing Subsequence",
      code: `
def longestCommonSubsequence(x, y):
    """
    'index' instructs the visualizer to draw the specified
    local variables as indexes for the specified array

    index: dp[i][j]
    index: x[i]
    index: y[j]
    """
    m = len(x)
    n = len(y)

    dp = [[0]*(n+1) for i in range(m+1)]

    for i in range(m+1):
        for j in range(n+1):
            if i==0 or j==0:
                dp[i][j] = 0
            elif x[i-1] == y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

def main():
    x = ["A", "G", "G", "T"]
    y = ["G", "X", "T", "X"]
    lcs = longestCommonSubsequence(x, y)
    return 0
`
  }
]
