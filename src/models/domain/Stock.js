import Queue from "../data structures/Queue.js";

// Stock class to manage the stock and waste piles
export default class Stock {
  constructor(deck) {
    this.stockPile = new Queue();
    this.wastePile = new Queue();

    console.log("Initializing stock pile with deck cards...");
    console.log(deck.cards.length);
    while (deck.cards.length > 0) {
      this.stockPile.enqueue(deck.dealOneCard());
    }
  }

  /** Returns the stock pile as an array for the UI */
  getStockCards() {
    console.log("Getting stock cards for UI...");
    console.log("cards in stock", this.stockPile.toArray().length);
    return this.stockPile.toArray();
  }

  /** Returns the waste pile as an array for UI */
  getWasteCards() {
    return this.wastePile.toArray();
  }

  peekTopThree() {
    const cards = [];
    let current = this.stockPile.front;
    let count = 0;
    while (current && count < 3) {
      cards.push(current.data);
      current = current.next;
      count++;
    }
    return cards;
  }

  drawThree() {
    const drawn = [];
    for (let i = 0; i < 3; i++) {
      const card = this.stockPile.dequeue();
      if (!card) break;
      card.faceUp = true;
      this.wastePile.enqueue(card);
      drawn.push(card);
    }
    return drawn;
  }

  resetFromWaste() {
    if (!this.wastePile.isEmpty() && this.stockPile.isEmpty()) {
      const cards = [];
      while (!this.wastePile.isEmpty()) {
        const c = this.wastePile.dequeue();
        c.faceUp = false;
        cards.push(c);
      }
      cards.reverse().forEach((c) => this.stockPile.enqueue(c));
    }
  }

  isEmpty() {
    return this.stockPile.isEmpty();
  }
}
