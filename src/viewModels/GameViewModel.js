import GameController from "../controllers/GameController.js";

export default class GameViewModel {
  constructor(setState) {
    this.controller = new GameController();
    this.setState = setState;
    this.selectedCard = null;
    this.errorMessage = null;
    this.observers = [];

    // Initialize UI with first game state
    this.updateState();
  }

  // --- CARD SELECTION LOGIC ---
  selectCard(card) {
    console.log("Selected card:", card);
    this.selectedCard = card;
  }

  clearSelection() {
    this.selectedCard = null;
  }

  setError(message) {
    this.errorMessage = message;
    this.notifyObservers();
  }

  clearError() {
    this.errorMessage = null;
    this.notifyObservers();
  }

  /** Get latest state */
  getState() {
    return this.controller.getState();
  }

  /** Helper to sync backend state to frontend */
  updateState() {
    const state = this.controller.getState();
    this.setState({
      tableau: state.tableau,
      foundation: state.foundation,
      stock: state.stock,
      waste: state.stock.getWasteCards(),
    });
  }

  /** Start a completely new game */
  startNewGame() {
    this.controller.startNewGame();
    this.updateState();
  }

  /** Draw cards from stock */
  drawFromStock() {
    // this.controller.stock.resetFromWaste(); // handle recycle logic
    this.controller.stock.drawThree();
    console.log(
      "Drew cards from stock to waste: ",
      this.controller.getState().stock.getWasteCards()
    );
    this.updateState();
  }

  /** Recycle waste back to stock */
  recycleFromWaste() {
    this.controller.stock.resetFromWaste();
    this.updateState();
  }

  /** Move waste card to tableau */
  moveWasteToTableau(colIndex) {
    if (!this.selectedCard) {
      console.warn("No card selected!");
      return;
    }
    console.log("Moving selected waste card to tableau:", this.selectedCard);

    const result = this.controller.moveWasteToTableau(
      colIndex,
      this.selectedCard
    );
    if (!result.success) {
      this.setError("Invalid move!");
    } else {
      this.clearError();
    }

    this.notifyObservers();

    this.clearSelection();
    this.updateState();
  }

  notifyObservers() {
    this.observers.forEach((cb) => cb());
  }

  subscribe(cb) {
    this.observers.push(cb);
  }

  /** Move waste card to foundation */
  moveWasteToFoundation() {
    if (!this.selectedCard) {
      console.warn("No card selected!");
      return;
    }

    console.log("Moving selected waste card to foundation:", this.selectedCard);
    this.controller.moveWasteToFoundation(this.selectedCard);
    this.clearSelection();
    this.updateState();
  }

  /** Move tableau card to another tableau column */
  moveTableauToTableau(fromCol, toCol, numCards) {
    this.controller.moveTableauToTableau(fromCol, toCol, numCards);
    this.updateState();
  }

  /** Move tableau card to foundation */
  moveTableauToFoundation(colIndex) {
    this.controller.moveTableauToFoundation(colIndex);
    this.updateState();
  }

  /** Undo / Redo */
  undo() {
    this.controller.undoLastMove();
    this.updateState();
  }

  redo() {
    this.controller.redoLastMove();
    this.updateState();
  }

  /** Victory check */
  checkVictory() {
    return this.controller.checkVictory();
  }
}
