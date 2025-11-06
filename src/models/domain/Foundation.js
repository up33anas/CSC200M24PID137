import Stack from "../data structures/Stack.js";
import Card from "./Card.js";

export default class Foundation {
  constructor() {
    this.piles = Array.from({ length: 4 }, () => new Stack());
  }

  toJSON() {
    return {
      piles: this.piles.map((pile) =>
        pile.toArray().map((card) => card.toJSON())
      ),
    };
  }

  static fromJSON(data) {
    const foundation = new Foundation();
    foundation.piles = data.piles.map((pileData) => {
      const stack = new Stack();
      pileData.forEach((cardData) => stack.push(Card.fromJSON(cardData)));
      return stack;
    });
    return foundation;
  }
}
