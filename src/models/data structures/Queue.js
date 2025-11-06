// Node class
class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

// Queue class
export default class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
  }

  // Check if the queue is empty
  isEmpty() {
    return this.front === null;
  }

  // Add element to the rear
  enqueue(x) {
    const newNode = new Node(x);

    if (this.isEmpty()) {
      this.front = this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    return true;
  }

  // Remove element from the front
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue Underflow!");
      return null;
    }

    const removedData = this.front.data;
    if (this.front === this.rear) {
      this.front = this.rear = null;
    } else {
      this.front = this.front.next;
    }
    return removedData;
  }

  // Peek at the front element
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty!");
    }
    return this.front.data;
  }

  // Convert the queue to a plain array (for frontend rendering)
  toArray() {
    const arr = [];
    let current = this.front;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  // Display all elements (optional)
  display() {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return;
    }

    let result = "Queue elements: ";
    let current = this.front;
    while (current) {
      result += current.data + " ";
      current = current.next;
    }
    console.log(result);
  }

  removeCard(card) {
    const cards = this.toArray().filter((c) => c !== card);
    this.clear();
    cards.forEach((c) => (this.enqueue ? this.enqueue(c) : this.push(c)));
  }

  clear() {
    this.front = null;
    this.rear = null;
    this._size = 0; // optional if you’re tracking size
  }
}
