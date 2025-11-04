import GameController from "../controllers/GameController.js";

export default class GameViewModel {
  constructor(setState) {
    this.controller = new GameController();
    this.setState = setState;

    // Initialize UI with first game state
    this.updateState();
  }

  /** Helper to sync backend state to frontend */
  updateState() {
    const snapshot = this.controller.getState();
    this.setState(snapshot);
  }

  /** Start a completely new game */
  startNewGame() {
    this.controller.startNewGame();
    this.updateState();
  }

  /** Draw cards from stock */
  drawFromStock() {
    this.controller.stock.resetFromWaste(); // handle recycle logic
    this.controller.drawFromStock();
    this.updateState();
  }

  /** Move waste card to tableau */
  moveWasteToTableau(colIndex) {
    this.controller.moveWasteToTableau(colIndex);
    this.updateState();
  }

  /** Move waste card to foundation */
  moveWasteToFoundation() {
    this.controller.moveWasteToFoundation();
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

  /** Get latest state (if needed manually) */
  getState() {
    return this.controller.getState();
  }
}
