// Node class
class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

// Stack class (linked list implementation)
export default class Stack {
  constructor() {
    this.top = null;
    this.count = 0; // number of elements
  }

  isEmpty() {
    return this.top === null;
  }

  push(x) {
    const newNode = new Node(x, this.top);
    this.top = newNode;
    this.count++;
  }

  pop() {
    if (this.isEmpty()) {
      console.log("Stack Underflow!");
      return null;
    }
    const poppedValue = this.top.data;
    this.top = this.top.next;
    this.count--;
    return poppedValue;
  }

  peek() {
    if (this.isEmpty()) {
      console.log("Stack is empty!");
      return null;
    }
    return this.top.data;
  }

  size() {
    return this.count;
  }

  display() {
    if (this.isEmpty()) {
      console.log("Stack is empty!");
      return;
    }
    let result = "Stack (top → bottom): ";
    let temp = this.top;
    while (temp) {
      result += temp.data + " ";
      temp = temp.next;
    }
    console.log(result);
  }

  clear() {
    this.top = null;
    this.count = 0;
  }

  toArray() {
    const result = [];
    let current = this.top;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result.reverse(); // bottom-to-top order
  }

  removeCard(card) {
    const cards = this.toArray().filter((c) => c !== card);
    this.clear();
    cards.forEach((c) => (this.enqueue ? this.enqueue(c) : this.push(c)));
  }
}
