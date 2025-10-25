import Deck from "./Deck";
import Tableau from "./Tableau";
import Foundation from "./Foundation";
import Stock from "./Stock";

// Game class to manage overall game state
export default class Game {
  constructor() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    this.moveHistory = []; // to track moves for undo functionality
  }

  moveTableauToFoundation(colIndex) {
    const column = this.tableau.columns[colIndex];
    if (!column.head) return false;

    const card = column.deleteFromEnd();
    this.foundation.piles[card.suit].push(card); // push to foundation
    this.moveHistory.push({ from: "tableau", to: "foundation", card });

    return true;
  }
}
