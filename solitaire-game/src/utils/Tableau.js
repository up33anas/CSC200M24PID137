import List from "./data structures/List.js";

// Tableau class to manage the seven tableau piles
export default class Tableau {
  constructor() {
    this.columns = Array.from({ length: 7 }, () => new List());
  }

  deal(deck) {
    for (let col = 0; col < 7; col++) {
      for (let i = 0; i <= col; i++) {
        const card = deck.draw();
        if (i == col) card.faceUp = true;
        this.columns[col].insertAtEnd(card);
      }
    }
  }
}
