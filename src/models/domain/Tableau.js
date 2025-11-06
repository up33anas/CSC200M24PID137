import List from "../data structures/List.js";
import Card from "./Card.js";

export default class Tableau {
  constructor() {
    this.columns = Array.from({ length: 7 }, () => new List());
  }

  toJSON() {
    return {
      columns: this.columns.map((col) =>
        col.toArray().map((card) => card.toJSON())
      ),
    };
  }

  static fromJSON(data) {
    const tableau = new Tableau();
    tableau.columns = data.columns.map((colData) => {
      const list = new List();
      colData.forEach((cardData) => list.insertAtEnd(Card.fromJSON(cardData)));
      return list;
    });
    return tableau;
  }

  deal(deck) {
    for (let col = 0; col < 7; col++) {
      for (let i = 0; i <= col; i++) {
        const card = deck.dealOneCard();
        if (i == col) card.faceUp = true;
        this.columns[col].insertAtEnd(card);
      }
    }
  }
}
