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
}
