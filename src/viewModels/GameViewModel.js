import GameController from "../controllers/GameController.js";
import Queue from "../models/data structures/Queue.js";
import Stack from "../models/data structures/Stack.js";

export default class GameViewModel {
  constructor(setState) {
    this.setState = setState;

    // Pass an onUpdate callback to GameController
    this.controller = new GameController(() => this.updateState());

    this.selectedCard = null;
    this.errorMessage = null;
    this.observers = [];

    this.updateState(); // initial render
  }

  /** --- CARD SELECTION --- */
  selectCard(card) {
    this.selectedCard = card;
    console.log("viewModel 264 selectCard:", card);
  }

  clearSelection() {
    this.selectedCard = null;
  }

  /** --- ERROR HANDLING --- */
  setError(message) {
    this.errorMessage = message;
    this.notifyObservers();
  }

  clearError() {
    this.errorMessage = null;
    this.notifyObservers();
  }

  /** --- STATE SYNC --- */
  getState() {
    return this.controller.getState();
  }

  updateState() {
    const state = this.controller.getState();

    // Ensure new array references for React
    const tableau = {
      ...state.tableau,
      columns: state.tableau.columns.map((col) =>
        col.toArray ? col.toArray() : [...col]
      ),
    };
    const waste = state.stock.getWasteCards().slice();

    // Compute progress
    const completedCards = state.foundation.piles.reduce((sum, pile) => {
      const pileCount = pile?.count ?? pile?.length ?? 0;
      return sum + pileCount;
    }, 0);

    const progress = Math.floor((completedCards / 52) * 100);

    this.setState({
      tableau,
      foundation: state.foundation,
      stock: state.stock,
      waste,
      moves: this.controller.moves || 0,
      score: this.controller.score || 0,
      time: this.controller.time || 0,
      progress,
    });
  }

  /** --- GAME ACTIONS --- */
  startNewGame() {
    this.controller.startNewGame();
    this.updateState();
  }

  drawFromStock() {
    this.controller.drawFromStock();
    this.updateState();
  }

  recycleFromWaste() {
    this.controller.stock.resetFromWaste();
    this.updateState();
  }

  moveWasteToTableau(colIndex) {
    if (!this.selectedCard) return;
    const result = this.controller.moveWasteToTableau(
      colIndex,
      this.selectedCard
    );
    if (!result.success) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveWasteToFoundation() {
    if (!this.selectedCard) return;
    const result = this.controller.moveWasteToFoundation(this.selectedCard);
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const result = this.controller.moveTableauToTableau(
      fromCol,
      toCol,
      numCards
    );
    if (!result.success) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveTableauToFoundation(colIndex) {
    const result = this.controller.moveTableauToFoundation(colIndex);
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.updateState();
  }

  /** --- UNDO / REDO --- */
  undo() {
    const success = this.controller.undoLastMove();
    if (!success) this.setError("Nothing to undo");
    else this.clearError();
    this.updateState();
  }

  redo() {
    const success = this.controller.redoLastMove();
    if (!success) this.setError("Nothing to redo");
    else this.clearError();
    this.updateState();
  }

  /** --- VICTORY CHECK --- */
  checkVictory() {
    return this.controller.checkVictory();
  }

  notifyObservers() {
    this.observers.forEach((cb) => cb());
  }

  subscribe(cb) {
    this.observers.push(cb);
  }

  provideHint() {
    const { tableau, foundation, waste } = this.controller.getState();
    console.log(
      "tableau:",
      tableau,
      "foundation:",
      foundation,
      "waste:",
      waste instanceof Array
    );

    // Try moving from Waste → Foundation or Tableau
    const visibleWaste = waste.slice(-3); // top 3 visible cards
    console.log("Visible waste cards for hint:", visibleWaste);

    for (let i = visibleWaste.length - 1; i >= 0; i--) {
      const card = visibleWaste[i];

      // Check Foundation first
      if (foundation.piles) {
        for (let f of foundation.piles) {
          const topFoundationCard = f.peek ? f.peek() : null;
          if (
            this.controller.isValidMoveToFoundation(card, topFoundationCard)
          ) {
            console.log("Hint found: Waste → Foundation", card);
            return { from: "waste", to: "foundation", card };
          }
        }
      }

      // Then check Tableau
      for (let t of tableau.columns) {
        const topTableauCard = t.getTopNodes ? t.getTopNodes(1) : null;
        if (this.controller.isValidMoveToTableau(card, topTableauCard)) {
          console.log("Hint found: Waste → Tableau", card);
          return { from: "waste", to: "tableau", card };
        }
      }
    }

    // Try Tableau → Foundation
    for (let col of tableau.columns) {
      const top = col.peek?.();
      if (top) {
        for (let f of foundation.piles) {
          if (this.controller.isValidMoveToFoundation(top, f.peek?.())) {
            return { from: "tableau", to: "foundation", card: top };
          }
        }
      }
    }

    // Try Tableau → Tableau
    for (let srcCol of tableau.columns) {
      const srcTop = srcCol.peek?.();
      if (!srcTop) continue;
      for (let destCol of tableau.columns) {
        if (srcCol === destCol) continue;
        const destTop = destCol.peek?.();
        if (this.controller.isValidMoveToTableau(srcTop, destTop)) {
          return { from: "tableau", to: "tableau", card: srcTop };
        }
      }
    }

    // No valid moves found
    return null;
  }

  highlightHint(hint) {
    if (!hint) return;

    this.hint = hint;

    const currentState = this.controller.getState();

    this.setState({
      tableau: {
        ...currentState.tableau,
        columns: currentState.tableau.columns.map((col) =>
          col.toArray ? col.toArray() : [...col]
        ),
      },
      foundation: currentState.foundation,
      stock: currentState.stock,
      waste: currentState.stock.getWasteCards().slice(),
      hint,
    });
  }

  getHintedCard() {
    return this.hint?.card || null;
  }
}
