export default class Card {
  constructor(suit, rank) {
    this.suit = suit; // "hearts"
    this.rank = rank; // "A"
    this.faceUp = false;
  }

  toJSON() {
    return {
      suit: this.suit,
      rank: this.rank,
      faceUp: this.faceUp,
    };
  }

  static fromJSON(data) {
    const card = new Card(data.suit, data.rank);
    card.faceUp = data.faceUp;
    return card;
  }
}
