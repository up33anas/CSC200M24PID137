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
    // this.startNewGame();
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

    this.stopTimer();
    this.startTimer();

    console.log("New game started.");
    console.log("Tableau after new game:", this.tableau);
  }

  startTimer() {
    // Clear previous interval if it exists
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.time++;

      // Trigger UI update
      if (this.onUpdate) this.onUpdate(this.getState());
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
    console.log("Total moves:", this.moves);

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
    console.log("Drawn cards:XXXXXXXXXXX");
    if (drawnCards.length === 0) return [];

    this.recordMove({
      type: "DRAW",
      cards: drawnCards,
      from: this.stock,
      to: this.stock.wastePile,
    });

    return drawnCards;
  }

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

  // HINTING FUNCTION
  // ----------------------------------------------------//
  getHint() {
    // 1. Check waste → foundation
    const wasteCards = this.stock.getWasteCards();
    if (wasteCards.length > 0) {
      const topWaste = wasteCards[wasteCards.length - 1];
      const canMoveToFoundation = this.foundation.piles.some((pile) =>
        this.isValidMoveToFoundation(topWaste, pile)
      );

      if (canMoveToFoundation) {
        return {
          type: "WASTE_TO_FOUNDATION",
          from: "waste",
          card: topWaste,
        };
      }
    }

    // 2. Check waste → tableau
    if (wasteCards.length > 0) {
      const topWaste = wasteCards[wasteCards.length - 1];
      const colIndex = this.tableau.columns.findIndex((col) =>
        this.isValidMoveToTableau(topWaste, col)
      );
      if (colIndex !== -1) {
        return {
          type: "WASTE_TO_TABLEAU",
          from: "waste",
          to: `tableau-${colIndex}`,
          card: topWaste,
        };
      }
    }

    // 3. Check tableau → foundation
    for (let i = 0; i < this.tableau.columns.length; i++) {
      const col = this.tableau.columns[i];
      const topCard = col.getLastNode()?.data;
      if (topCard) {
        const canMove = this.foundation.piles.some((pile) =>
          this.isValidMoveToFoundation(topCard, pile)
        );
        if (canMove) {
          return {
            type: "TABLEAU_TO_FOUNDATION",
            from: `tableau-${i}`,
            card: topCard,
          };
        }
      }
    }

    // 4. Check tableau → tableau
    for (let i = 0; i < this.tableau.columns.length; i++) {
      const fromCol = this.tableau.columns[i];
      const cards = fromCol.toArray().filter((c) => c.faceUp);
      for (const card of cards) {
        for (let j = 0; j < this.tableau.columns.length; j++) {
          if (i === j) continue;
          const destCol = this.tableau.columns[j];
          if (this.isValidMoveToTableau(card, destCol)) {
            return {
              type: "TABLEAU_TO_TABLEAU",
              from: `tableau-${i}`,
              to: `tableau-${j}`,
              card,
            };
          }
        }
      }
    }

    // 5. No hint found
    return null;
  }

  isValidMoveToFoundation(card, pile) {
    const top = pile instanceof Stack ? pile.peek() : pile[0]?.data;
    if (!top) return card.rank === "A"; // Only Ace starts a pile
    return (
      card.suit === top.suit &&
      this.rankValue(card.rank) === this.rankValue(top.rank) + 1
    );
  }

  isValidMoveToTableau(card, column) {
    const top = column.getLastNode()?.data;
    if (!top) return card.rank === "K"; // King starts an empty tableau
    return (
      this.isOppositeColor(card.suit, top.suit) &&
      this.rankValue(card.rank) === this.rankValue(top.rank) - 1
    );
  }

  isOppositeColor(s1, s2) {
    const red = ["hearts", "diamonds"];
    const black = ["clubs", "spades"];
    return (
      (red.includes(s1) && black.includes(s2)) ||
      (black.includes(s1) && red.includes(s2))
    );
  }

  rankValue(rank) {
    const order = [
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
    return order.indexOf(rank.toUpperCase());
  }
}
