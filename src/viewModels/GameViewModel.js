// import GameController from "../controllers/GameController.js";

// export default class GameViewModel {
//   // constructor(setState) {
//   //   this.controller = new GameController();
//   //   this.setState = setState;
//   //   this.selectedCard = null;
//   //   this.errorMessage = null;
//   //   this.observers = [];

//   //   // Initialize UI with first game state
//   //   this.updateState();
//   // }

//   constructor(setState) {
//     this.setState = setState;
//     this.controller = new GameController((state) => {
//       this.setState({
//         ...state,
//         time: this.controller.time,
//         moves: this.controller.moves,
//         score: this.controller.score,
//         progress: this.getProgressPercentage(),
//       });
//     });

//     this.selectedCard = null;
//     this.errorMessage = null;
//     this.observers = [];

//     this.updateState(); // initialize
//   }

//   // --- CARD SELECTION LOGIC ---
//   selectCard(card) {
//     console.log("Selected card:", card);
//     this.selectedCard = card;
//   }

//   clearSelection() {
//     this.selectedCard = null;
//   }

//   setError(message) {
//     this.errorMessage = message;
//     this.notifyObservers();
//   }

//   clearError() {
//     this.errorMessage = null;
//     this.notifyObservers();
//   }

//   /** Get latest state */
//   getState() {
//     return this.controller.getState();
//   }

//   /** Helper to sync backend state to frontend */
//   // updateState() {
//   //   const state = this.controller.getState();
//   //   this.setState({
//   //     tableau: state.tableau,
//   //     foundation: state.foundation,
//   //     stock: state.stock,
//   //     waste: state.stock.getWasteCards(),
//   //   });
//   // }

//   // updateState() {
//   //   const state = this.controller.getState();

//   //   // Clone tableau columns just like waste does
//   //   const tableau = {
//   //     ...state.tableau,
//   //     columns: state.tableau.columns.map((col) =>
//   //       col.toArray ? col.toArray() : col
//   //     ),
//   //   };

//   //   this.setState({
//   //     tableau,
//   //     foundation: state.foundation,
//   //     stock: state.stock,
//   //     waste: state.stock.getWasteCards(), // always a new array
//   //   });
//   // }

//   updateState() {
//     const state = this.controller.getState();

//     const tableau = {
//       ...state.tableau,
//       columns: state.tableau.columns.map((col) =>
//         col.toArray ? col.toArray() : col
//       ),
//     };

//     // Compute progress
//     const completedCards = state.foundation.piles.reduce(
//       (sum, pile) => sum + (pile.count || pile.size || 0),
//       0
//     );
//     const totalCards = 52;
//     const progress = Math.floor((completedCards / totalCards) * 100);

//     // Add moves, score, time from controller if they exist
//     this.setState({
//       tableau,
//       foundation: state.foundation,
//       stock: state.stock,
//       waste: state.stock.getWasteCards(),
//       moves: this.controller.moves || 0,
//       score: this.controller.score || 0,
//       time: this.controller.time || 0,
//       progress,
//     });
//   }
//   up;

//   /** Start a completely new game */
//   startNewGame() {
//     this.controller.startNewGame();
//     this.updateState();
//   }

//   /** Draw cards from stock */
//   drawFromStock() {
//     // this.controller.stock.resetFromWaste(); // handle recycle logic
//     this.controller.stock.drawThree();
//     console.log(
//       "Drew cards from stock to waste: ",
//       this.controller.getState().stock.getWasteCards()
//     );
//     this.updateState();
//   }

//   /** Recycle waste back to stock */
//   recycleFromWaste() {
//     this.controller.stock.resetFromWaste();
//     this.updateState();
//   }

//   /** Move waste card to tableau */
//   moveWasteToTableau(colIndex) {
//     if (!this.selectedCard) {
//       console.warn("No card selected!");
//       return;
//     }
//     console.log("Moving selected waste card to tableau:", this.selectedCard);

//     const result = this.controller.moveWasteToTableau(
//       colIndex,
//       this.selectedCard
//     );
//     if (!result.success) {
//       this.setError("Invalid move!");
//     } else {
//       this.clearError();
//     }

//     this.notifyObservers();

//     this.clearSelection();
//     this.updateState();
//   }

//   notifyObservers() {
//     this.observers.forEach((cb) => cb());
//   }

//   subscribe(cb) {
//     this.observers.push(cb);
//   }

//   /** Move waste card to foundation */
//   moveWasteToFoundation() {
//     if (!this.selectedCard) {
//       console.warn("No card selected!");
//       return;
//     }

//     console.log("Moving selected waste card to foundation:", this.selectedCard);
//     this.controller.moveWasteToFoundation(this.selectedCard);
//     this.clearSelection();
//     this.updateState();
//   }

//   /** Move tableau card to another tableau column */
//   moveTableauToTableau(fromCol, toCol, numCards) {
//     const result = this.controller.moveTableauToTableau(
//       fromCol,
//       toCol,
//       numCards
//     );
//     console.log(numCards, "cards moved from tableau", fromCol, "to", toCol);
//     if (!result.success) {
//       this.setError("Invalid move!");
//     } else {
//       this.clearError();
//     }

//     this.notifyObservers();

//     this.clearSelection();
//     this.updateState();
//   }

//   /** Move tableau card to foundation */
//   moveTableauToFoundation(colIndex) {
//     this.controller.moveTableauToFoundation(colIndex);
//     this.updateState();
//   }

//   /** Undo / Redo */
//   undo() {
//     const success = this.controller.undoLastMove();

//     if (!success) {
//       this.setError("Nothing to undo");
//     } else {
//       this.clearError();
//     }

//     this.updateState();
//   }

//   redo() {
//     const success = this.controller.redoLastMove();

//     if (!success) {
//       this.setError("Nothing to redo");
//     } else {
//       this.clearError();
//     }

//     this.updateState();
//   }

//   /** Victory check */
//   checkVictory() {
//     return this.controller.checkVictory();
//   }
// }
import GameController from "../controllers/GameController.js";

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

  /** --- TIMER is handled in controller --- */

  /** --- CARD SELECTION --- */
  selectCard(card) {
    this.selectedCard = card;
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
    this.controller.stock.drawThree();
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
}
