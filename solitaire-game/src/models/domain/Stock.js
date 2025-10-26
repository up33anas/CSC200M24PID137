import Queue from "../data structures/Queue.js";

export default class Stock {
  constructor(deck) {
    this.stockPile = new Queue();
    this.wastePile = new Queue();
    this.lastThreeCards = [];

    while (deck.cards.length > 0) {
      this.stockPile.enqueue(deck.dealOneCard());
    }
  }

  // Draw three cards from stock to waste
  drawThree() {
    this.lastThreeCards = [];
    for (let i = 0; i < 3; i++) {
      const card = this.stockPile.dequeue();
      if (!card) break;
      card.faceUp = true;
      this.wastePile.enqueue(card);
      this.lastThreeCards.push(card);
    }
    return this.lastThreeCards;
  }

  // Get the last three drawn cards
  getLastThreeCards() {
    return [...this.lastThreeCards]; // returns a copy to prevent accidental mutation
  }

  // Reset stock from waste pile if stock is empty
  resetFromWaste() {
    if (!this.wastePile.isEmpty() && this.stockPile.isEmpty()) {
      const tempCards = [];
      while (!this.wastePile.isEmpty()) {
        const card = this.wastePile.dequeue();
        card.faceUp = false;
        tempCards.push(card);
      }
      // Refill stock pile
      tempCards.reverse().forEach((card) => this.stockPile.enqueue(card));
    }
  }

  // Check if stock is empty
  isEmpty() {
    return this.stockPile.isEmpty();
  }
}
