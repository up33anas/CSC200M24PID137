import Deck from "../models/domain/Deck.js";
import Tableau from "../models/domain/Tableau.js";
import Foundation from "../models/domain/Foundation.js";
import Stock from "../models/domain/Stock.js";
import {
  findFoundationIndex,
  isValidSequence,
  canPlaceOnDestination,
} from "../utils/gameRules.js";

export default class Game {
  constructor() {
    // Initialize deck and shuffle
    this.deck = new Deck();
    this.deck.shuffle();

    // Initialize tableau, foundation, and stock
    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    // Initialize foundation and stock
    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    // Move history for undo functionality
    this.moveHistory = [];
  }

  // Move card from tableau to foundation
  moveTableauToFoundation(colIndex) {
    const movingCard = this.tableau.columns[colIndex].peek();

    // Find appropriate foundation pile
    const destFoundationIndex = findFoundationIndex(
      movingCard,
      this.foundation
    );
    if (destFoundationIndex === -1) {
      console.log("Invalid move to foundation");
      return false;
    }

    // Execute move
    const card = this.tableau.columns[colIndex].pop();
    this.foundation.piles[destFoundationIndex].push(card);

    this.moveHistory.push({
      fromCol: colIndex,
      toFoundation: destFoundationIndex,
      card,
    });
    return true;
  }

  // Move cards between tableau columns
  moveTableauToTableau(fromCol, toCol, numCards) {
    const movingNodes = this.tableau.columns[fromCol].getTopNodes(numCards);
    const movingCards = movingNodes.map((n) => n.data);

    // Get destination top card
    const destTopNodes = this.tableau.columns[toCol].getTopNodes(1);
    const destTopCard = destTopNodes.length ? destTopNodes[0].data : null;

    // Check if the move is valid
    if (
      !isValidSequence(movingCards) ||
      !canPlaceOnDestination(movingCards[0], destTopCard)
    )
      return false;

    // Execute move
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
