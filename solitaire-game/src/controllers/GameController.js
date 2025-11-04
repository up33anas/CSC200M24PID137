import Deck from "../models/domain/Deck.js";
import Tableau from "../models/domain/Tableau.js";
import Foundation from "../models/domain/Foundation.js";
import Stock from "../models/domain/Stock.js";
import Stack from "../models/data structures/Stack.js";
import {
  moveTableauToTableau,
  moveTableauToFoundation,
  moveWasteToTableau,
  moveWasteToFoundation,
} from "../utils/moveHelpers.js";

export default class GameController {
  constructor() {
    // Core game state (models)
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    // History stacks
    this.moveHistory = new Stack(); // Undo stack
    this.redoStack = new Stack(); // Redo stack
  }

  startNewGame() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    this.moveHistory = new Stack();
    this.redoStack = new Stack();

    console.log("New game started.");
  }

  // Get the current waste cards (top 3 or fewer)
  getWasteCards() {
    return this.stock.drawThree(); // returns an array of 1–3 cards
  }

  selectCard(card) {
    this.selectCard = card;
  }

  // Return a snapshot of the current game state
  getState() {
    return {
      tableau: this.tableau,
      foundation: this.foundation,
      stock: this.stock,
      waste: this.stock.getWasteCards(),
      deck: this.deck,
    };
  }

  /* ----------------- MOVE ACTIONS ----------------- */

  moveTableauToFoundation(colIndex) {
    const from = this.tableau.columns[colIndex];
    const result = moveTableauToFoundation(from, this.foundation);

    if (result.success) {
      const move = {
        type: "TABLEAU_TO_FOUNDATION",
        cards: result.cards,
        from,
        to: result.to,
        numCards: result.cards.length,
      };
      this.recordMove(move);
    }

    return result.success;
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const from = this.tableau.columns[fromCol];
    const to = this.tableau.columns[toCol];

    const result = moveTableauToTableau(from, to, numCards);

    if (result.success) {
      const move = {
        type: "TABLEAU_TO_TABLEAU",
        cards: result.cards,
        from,
        to,
        numCards,
      };
      this.recordMove(move);
    }

    return result.success;
  }

  moveWasteToTableau(colIndex) {
    const result = moveWasteToTableau(
      this.stock.wastePile,
      this.tableau,
      colIndex
    );

    if (result.success) {
      const move = {
        type: "WASTE_TO_TABLEAU",
        cards: result.cards,
        from: this.stock.wastePile,
        to: this.tableau.columns[colIndex],
        numCards: result.cards.length,
      };
      this.recordMove(move);
    }

    return result.success;
  }

  moveWasteToFoundation() {
    const result = moveWasteToFoundation(this.stock.wastePile, this.foundation);

    if (result.success) {
      const move = {
        type: "WASTE_TO_FOUNDATION",
        cards: result.cards,
        from: this.stock.wastePile,
        to: result.to,
        numCards: result.cards.length,
      };
      this.recordMove(move);
    }

    return result.success;
  }

  drawFromStock() {
    const drawnCards = this.stock.drawThree();
    if (drawnCards.length === 0) return [];

    const move = {
      type: "DRAW",
      cards: drawnCards,
      from: this.stock,
      to: this.stock.wastePile,
      numCards: drawnCards.length,
    };
    this.recordMove(move);

    return drawnCards;
  }

  /* ----------------- HISTORY CONTROL ----------------- */

  recordMove(move) {
    this.moveHistory.push(move);
    this.redoStack = new Stack(); // Clear redo when a new move is made
  }

  undoLastMove() {
    if (this.moveHistory.isEmpty()) {
      console.log("No moves to undo.");
      return false;
    }

    const move = this.moveHistory.pop();
    this.reverseMove(move);
    this.redoStack.push(move);
    return true;
  }

  redoLastMove() {
    if (this.redoStack.isEmpty()) {
      console.log("No moves to redo.");
      return false;
    }

    const move = this.redoStack.pop();
    this.applyMove(move);
    this.moveHistory.push(move);
    return true;
  }

  /* ----------------- MOVE APPLICATION ----------------- */

  reverseMove(move) {
    const { type, from, to, cards } = move;

    switch (type) {
      case "TABLEAU_TO_FOUNDATION":
      case "WASTE_TO_FOUNDATION":
        to.removeCards(cards.length);
        from.pushMultiple(cards);
        break;

      case "TABLEAU_TO_TABLEAU":
      case "WASTE_TO_TABLEAU":
        to.removeCards(cards.length);
        from.pushMultiple(cards);
        break;

      case "DRAW":
        this.stock.returnToStock(cards);
        break;

      default:
        console.warn(`Unknown move type (undo): ${type}`);
    }

    console.log(`Undid move: ${type}`);
  }

  applyMove(move) {
    const { type, from, to, cards } = move;

    switch (type) {
      case "TABLEAU_TO_FOUNDATION":
      case "WASTE_TO_FOUNDATION":
      case "TABLEAU_TO_TABLEAU":
      case "WASTE_TO_TABLEAU":
        from.removeCards(cards.length);
        to.pushMultiple(cards);
        break;

      case "DRAW":
        this.stock.drawThree();
        break;

      default:
        console.warn(`Unknown move type (redo): ${type}`);
    }

    console.log(`Redid move: ${type}`);
  }

  /* ----------------- GAME STATUS ----------------- */

  checkVictory() {
    return (
      this.foundation.piles.every((pile) => pile.size === 13) &&
      this.tableau.columns.every((col) => col.isEmpty()) &&
      this.stock.isEmpty()
    );
  }
}
