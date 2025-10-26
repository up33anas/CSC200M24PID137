import Card from "./Card.js";

// Deck class to manage a collection of cards
export default class Deck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
    this.shuffle();
  }

  // Create a standard 52-card deck
  initializeDeck() {
    const suits = [
      { name: "Hearts", symbol: "\u2665", color: "Red" },
      { name: "Diamonds", symbol: "\u2666", color: "Red" },
      { name: "Clubs", symbol: "\u2663", color: "Black" },
      { name: "Spades", symbol: "\u2660", color: "Black" },
    ];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    // Create 52 cards
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank));
        console.log(`Created card: ${rank} of ${suit.symbol} ${suit.color}`);
        console.log(this.cards[this.cards.length - 1]);
      }
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Deal one card from the top of the deck
  dealOneCard() {
    return this.cards.pop() || null;
  }
}
