export default class Card {
  constructor(suit, rank, faceUp = false) {
    this.suit = suit; // 'Hearts', 'Diamonds', 'Clubs', 'Spades'
    this.rank = rank; // 1-13 (1: Ace, 11: Jack, 12: Queen, 13: King)
    this.faceUp = faceUp; // boolean to check if card is face up
  }
}
