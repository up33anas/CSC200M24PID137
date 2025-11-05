import GameController from "../controllers/GameController.js";

export default class GameViewModel {
  constructor(setState) {
    this.controller = new GameController();
    this.setState = setState;

    // Initialize UI with first game state
    this.updateState();
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
    this.controller.moveWasteToTableau(colIndex);
    this.updateState();
  }

  /** Move waste card to foundation */
  moveWasteToFoundation() {
    console.log("ViewModel: Moving waste to foundation");
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
}
