import Queue from "../data structures/Queue";

export default class Stock {
  constructor(deck) {
    this.stockPile = new Queue();
    this.wastePile = new Queue();

    while (deck.cards.length > 0) {
      this.stockPile.enqueue(deck.dealCard());
    }
  }

  draw() {
    const card = this.stockPile.dequeue();
    if (card) this.wastePile.enqueue(card);
    return card;
  }
}
