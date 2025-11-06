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
    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  // Return a deep clone snapshot of the current game state
  getSnapshot() {
    // Deep clone the game state (Deck, Tableau, Foundation, Stock)
    return structuredClone({
      deck: this.deck,
      tableau: this.tableau,
      foundation: this.foundation,
      stock: this.stock,
    });
  }

  // Restore game state from a snapshot
  restoreSnapshot(snapshot) {
    // Restore all models safely
    this.deck = structuredClone(snapshot.deck);
    this.tableau = structuredClone(snapshot.tableau);
    this.foundation = structuredClone(snapshot.foundation);
    this.stock = structuredClone(snapshot.stock);
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

  moveWasteToTableau(colIndex, selectedCard) {
    console.log(
      "In GameController: Moving waste to tableau:",
      colIndex,
      "waste: ",
      this.stock.wastePile,
      "tableau:",
      this.tableau
    );
    const result = moveWasteToTableau(
      this.stock.wastePile,
      this.tableau,
      colIndex,
      selectedCard
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

  // Move waste card to foundation
  moveWasteToFoundation() {
    console.log("In GameController: Moving waste to foundation");
    console.log(
      this.stock.wastePile,
      "waste------------------------foundation"
    );

    const result = moveWasteToFoundation(this.stock.wastePile, this.foundation);

    if (result?.success) {
      const move = {
        type: "WASTE_TO_FOUNDATION",
        cards: result.movedCards,
        from: this.stock.wastePile,
        to: result.to,
        numCards: result.movedCards.length,
      };
      this.recordMove(move);
      console.log("Move successful:", move);
    } else {
      console.log("Move invalid or failed");
    }
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

  /* ----------------- UNDO REDO CONTROL ----------------- */

  undoLastMove() {
    if (this.undoStack.isEmpty()) {
      console.log("No previous states to undo.");
      return false;
    }

    // Save current state into redoStack
    this.redoStack.push(this.getSnapshot());

    // Restore previous
    const prevState = this.undoStack.pop();
    this.restoreSnapshot(prevState);

    console.log("Undo successful.");
    return true;
  }

  redoLastMove() {
    if (this.redoStack.isEmpty()) {
      console.log("No moves to redo.");
      return false;
    }

    // Save current into undoStack
    this.undoStack.push(this.getSnapshot());

    // Restore future state
    const nextState = this.redoStack.pop();
    this.restoreSnapshot(nextState);

    console.log("Redo successful.");
    return true;
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
