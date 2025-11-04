import Queue from "../data structures/Queue.js";

// Waste class to manage the stock and waste piles
export default class Waste {
  constructor(deck) {
    this.wastePile = new Queue();

    while (deck.cards.length > 0) {
      this.stockPile.enqueue(deck.dealOneCard());
    }
  }

  /** Returns the stock pile as an array for the UI */
  getStockCards() {
    return this.stockPile.toArray(); // <-- implement `toArray` in Queue
  }

  /** Returns the waste pile as an array for UI */
  getWasteCards() {
    return this.wastePile.toArray();
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
