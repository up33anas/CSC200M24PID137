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
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    // Initialize game state
    this.startNewGame();
  }

  /* ----------------- CORE INITIALIZATION ----------------- */

  startNewGame() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    // History stacks
    this.undoStack = new Stack();
    this.redoStack = new Stack();

    // Save the initial state for undo safety
    this.undoStack.push(this.getSnapshot());

    this.moves = 0;
    this.score = 0;
    this.time = 0;
    this.timer = null; // for setInterval

    this.startTimer();

    console.log("New game started.");
    console.log("Tableau after new game:", this.tableau);
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.time++; // increment time

      // Trigger UI update via callback
      if (this.onUpdate) {
        this.onUpdate(this.getState()); // refresh state
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /* ----------------- STATE SNAPSHOTS ----------------- */

  // Capture a deep clone of the game state
  getSnapshot() {
    return {
      deck: this.deck.toJSON(),
      tableau: this.tableau.toJSON(),
      foundation: this.foundation.toJSON(),
      stock: this.stock.toJSON(),
    };
  }

  restoreSnapshot(snapshot) {
    this.deck = Deck.fromJSON(snapshot.deck);
    this.tableau = Tableau.fromJSON(snapshot.tableau);
    this.foundation = Foundation.fromJSON(snapshot.foundation);
    this.stock = Stock.fromJSON(snapshot.stock);
  }

  // Return current full state (for UI rendering)
  getState() {
    return {
      tableau: this.tableau,
      foundation: this.foundation,
      stock: this.stock,
      waste: this.stock.getWasteCards(),
      deck: this.deck,
    };
  }

  /* ----------------- MOVE RECORDING ----------------- */

  recordMove(move) {
    // Save *before* recording redo reset
    this.undoStack.push(this.getSnapshot());
    // console.log(this.undoStack);
    this.redoStack.clear(); // Clear redo history on new action
    console.log("Move recorded:", move.type);

    this.moves++;

    // Example scoring logic
    if (move.type === "TABLEAU_TO_TABLEAU") this.score += 5;
    else if (move.type === "TABLEAU_TO_FOUNDATION") this.score += 10;
    else if (move.type === "WASTE_TO_TABLEAU") this.score += 5;
    else if (move.type === "WASTE_TO_FOUNDATION") this.score += 10;
  }

  /* ----------------- MOVE ACTIONS ----------------- */

  moveTableauToFoundation(colIndex) {
    const from = this.tableau.columns[colIndex];
    const result = moveTableauToFoundation(from, this.foundation);

    if (result.success) {
      this.recordMove({
        type: "TABLEAU_TO_FOUNDATION",
        cards: result.cards,
        from,
        to: result.to,
      });
    }

    return result.success;
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const from = this.tableau.columns[fromCol];
    const to = this.tableau.columns[toCol];
    const result = moveTableauToTableau(from, to, numCards);

    if (result.success) {
      this.recordMove({
        type: "TABLEAU_TO_TABLEAU",
        cards: result.cards,
        from,
        to,
        numCards,
      });
    }

    return result.success;
  }

  moveWasteToTableau(colIndex, selectedCard) {
    const result = moveWasteToTableau(
      this.stock.wastePile,
      this.tableau,
      colIndex,
      selectedCard
    );

    if (result.success) {
      this.recordMove({
        type: "WASTE_TO_TABLEAU",
        cards: result.cards,
        from: this.stock.wastePile,
        to: this.tableau.columns[colIndex],
      });
    }

    return result.success;
  }

  moveWasteToFoundation(selectedCard) {
    const result = moveWasteToFoundation(
      this.stock.wastePile,
      this.foundation,
      selectedCard
    );

    if (result?.success) {
      this.recordMove({
        type: "WASTE_TO_FOUNDATION",
        cards: result.movedCards,
        from: this.stock.wastePile,
        to: result.to,
      });
      return true;
    }

    console.log("Move invalid or failed");
    return false;
  }

  drawFromStock() {
    const drawnCards = this.stock.drawThree();
    if (drawnCards.length === 0) return [];

    this.recordMove({
      type: "DRAW",
      cards: drawnCards,
      from: this.stock,
      to: this.stock.wastePile,
    });

    return drawnCards;
  }

  /* ----------------- UNDO / REDO ----------------- */

  // undoLastMove() {
  //   if (this.undoStack.size() <= 1) {
  //     console.log("No previous states to undo.");
  //     return false;
  //   }

  //   // Move current state to redo stack
  //   const currentState = this.undoStack.pop();
  //   this.redoStack.push(currentState);

  //   // Restore previous state
  //   const prevState = this.undoStack.peek();
  //   this.restoreSnapshot(prevState)
  //     ? console.log("Undo successful.")
  //     : console.log("Undo failed.");

  //   return true;
  // }

  // redoLastMove() {
  //   if (this.redoStack.isEmpty()) {
  //     console.log("No moves to redo.");
  //     return false;
  //   }

  //   // Move current state to undo stack
  //   this.undoStack.push(this.getSnapshot());

  //   // Restore the most recent redo state
  //   const nextState = this.redoStack.pop();
  //   this.undoStack.push(nextState);
  //   this.restoreSnapshot(nextState)
  //     ? console.log("Redo successful.")
  //     : console.log("Redo failed.");

  //   console.log("Redo successful.");
  //   return true;
  // }
  undoLastMove() {
    if (this.undoStack.size() <= 1) {
      console.log("No previous states to undo.");
      return false;
    }

    // Pop current state from undo stack and push it to redo stack
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    // Peek previous state on undo stack and restore it
    const prevState = this.undoStack.peek();
    if (this.restoreSnapshot(prevState)) {
      console.log("Undo successful.");
      return true;
    } else {
      console.log("Undo failed.");
      return false;
    }
  }

  redoLastMove() {
    if (this.redoStack.isEmpty()) {
      console.log("No moves to redo.");
      return false;
    }

    // Pop next state from redo stack
    const nextState = this.redoStack.pop();

    // Push current state to undo stack before applying redo
    const currentState = this.getSnapshot();
    this.undoStack.push(currentState);

    // Restore the redo state
    if (this.restoreSnapshot(nextState)) {
      // Also push the redone state to undo stack so further undo works
      this.undoStack.push(nextState);
      console.log("Redo successful.");
      return true;
    } else {
      console.log("Redo failed.");
      return false;
    }
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
