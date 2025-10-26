import Deck from "../models/domain/Deck.js";
import Tableau from "../models/domain/Tableau.js";
import Foundation from "../models/domain/Foundation.js";
import Stock from "../models/domain/Stock.js";
import {
  moveTableauToTableau,
  moveTableauToFoundation,
  moveWasteToTableau,
  moveWasteToFoundation,
} from "../utils/moveHelpers.js";

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
    const from = this.tableau.columns[colIndex];
    const result = moveTableauToFoundation(from, this.foundation);
    if (result.success) this.moveHistory.push(result);
    return result.success;
  }

  // Move cards between tableau columns
  moveTableauToTableau(fromCol, toCol, numCards) {
    const from = this.tableau.columns[fromCol];
    const to = this.tableau.columns[toCol];

    const result = moveTableauToTableau(from, to, numCards);
    if (result.success) this.moveHistory.push(result);
    return result.success;
  }

  // Move card from waste to tableau
  moveWasteToTableau(colIndex) {
    const result = moveWasteToTableau(
      this.stock.wastePile,
      this.tableau,
      colIndex
    );
    if (result.success) this.moveHistory.push(result);
    return result.success;
  }

  // Move card from waste to foundation
  moveWasteToFoundation() {
    const result = moveWasteToFoundation(this.stock.wastePile, this.foundation);
    if (result.success) this.moveHistory.push(result);
    return result.success;
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
