// Node class
class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

// List class
export default class List {
  constructor() {
    this.head = null;
  }

  // Check if the list is empty
  isEmpty() {
    return this.head === null;
  }

  // Insert at the head
  insertAtHead(data) {
    const newNode = new Node(data, this.head);
    this.head = newNode;
  }

  // Insert at the end
  insertAtEnd(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.head = newNode;
      return;
    }
    let temp = this.head;
    while (temp.next) temp = temp.next;
    temp.next = newNode;
  }

  // Insert at a specific index (1-based)
  insertAtIndex(index, data) {
    if (index <= 1 || this.isEmpty()) {
      this.insertAtHead(data);
      return;
    }

    let temp = this.head;
    for (let i = 1; i < index - 1; i++) {
      if (!temp.next) break;
      temp = temp.next;
    }

    const newNode = new Node(data, temp.next);
    temp.next = newNode;
  }

  // Delete first occurrence of data
  deleteNode(data) {
    if (this.isEmpty()) return false;

    // Delete head if matches
    if (this.head.data === data) {
      this.head = this.head.next;
      return true;
    }

    let temp = this.head;
    while (temp.next && temp.next.data !== data) temp = temp.next;

    if (temp.next) {
      temp.next = temp.next.next;
      return true;
    }

    return false;
  }

  // Delete from start
  deleteFromStart() {
    if (this.isEmpty()) return false;
    this.head = this.head.next;
    return true;
  }

  // Delete from end
  deleteFromEnd() {
    if (this.isEmpty()) return false;

    if (!this.head.next) {
      this.head = null;
      return true;
    }

    let temp = this.head;
    while (temp.next.next) temp = temp.next;
    temp.next = null;
    return true;
  }

  // Display the list (for debugging)
  display() {
    let result = [];
    let temp = this.head;
    while (temp) {
      result.push(temp.data);
      temp = temp.next;
    }
    console.log(result);
    return result;
  }

  // Get size of list
  size() {
    let count = 0;
    let temp = this.head;
    while (temp) {
      count++;
      temp = temp.next;
    }
    return count;
  }

  getTopNodes(n) {
    // Return empty array if list is empty
    if (this.isEmpty()) return [];

    let nodes = [];
    let temp = this.head;
    let stack = [];

    // Traverse entire list
    while (temp) {
      stack.push(temp);
      temp = temp.next;
    }

    // Pop from end to get top cards
    let count = 0;
    while (stack.length > 0 && count < n) {
      let node = stack.pop();
      if (!node.data.faceUp) break;
      nodes.unshift(node);
      count++;
    }

    return nodes;
  }

  deleteTopNodes(n) {
    if (this.isEmpty()) return;

    // Count total nodes
    let size = 0;
    let temp = this.head;
    while (temp) {
      size++;
      temp = temp.next;
    }

    // If deleting entire list
    if (n >= size) {
      this.head = null;
      return;
    }

    // Traverse to the (size - n - 1)th node
    let prev = this.head;
    for (let i = 1; i < size - n; i++) {
      prev = prev.next;
    }

    // Cut the link to delete top n nodes
    prev.next = null;
  }

  insertNodesAtTop(nodes) {
    if (nodes.length === 0) return;

    // Find current tail
    let tail = this.head;
    if (!tail) {
      // If empty, just rebuild the list
      this.head = nodes[0];
      let curr = this.head;
      for (let i = 1; i < nodes.length; i++) {
        curr.next = nodes[i];
        curr = curr.next;
      }
      return;
    }

    while (tail.next) tail = tail.next;

    // Attach new nodes at the end
    for (let i = 0; i < nodes.length; i++) {
      tail.next = new Node(nodes[i].data);
      tail = tail.next;
    }
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }
}
