import Deck from "../models/domain/Deck";
import Tableau from "../models/domain/Tableau";
import Foundation from "../models/domain/Foundation";
import Stock from "../models/domain/Stock";
import {
  findFoundationIndex,
  isValidSequence,
  canPlaceOnDestination,
} from "../utils/gameRules.js";

export default class Game {
  constructor() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    this.moveHistory = [];
  }

  moveTableauToFoundation(colIndex) {
    const movingCard = this.tableau.columns[colIndex].peek();

    const destFoundationIndex = findFoundationIndex(
      movingCard,
      this.foundation
    );
    if (destFoundationIndex === -1) {
      console.log("Invalid move to foundation");
      return false;
    }

    const card = this.tableau.columns[colIndex].pop();
    this.foundation.piles[destFoundationIndex].push(card);

    this.moveHistory.push({
      fromCol: colIndex,
      toFoundation: destFoundationIndex,
      card,
    });
    return true;
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const movingNodes = this.tableau.columns[fromCol].getTopNodes(numCards);
    const movingCards = movingNodes.map((n) => n.data);

    const destTopNodes = this.tableau.columns[toCol].getTopNodes(1);
    const destTopCard = destTopNodes.length ? destTopNodes[0].data : null;

    if (
      !isValidSequence(movingCards) ||
      !canPlaceOnDestination(movingCards[0], destTopCard)
    )
      return false;

    this.tableau.columns[fromCol].deleteTopNodes(numCards);
    this.tableau.columns[toCol].insertNodesAtTop(movingNodes);

    this.moveHistory.push({ fromCol, toCol, cards: movingCards });
    return true;
  }

  // Draw from stock
  drawFromStock() {
    // move card(s) to waste
  }

  // Undo last move
  undo() {
    // pop from moveHistory & revert
  }

  // Check for win
  checkVictory() {
    // check all foundation piles
  }
}
