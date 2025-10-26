import Game from "./Game.js";

// Initialize game
const game = new Game();

// Print initial tableau
console.log("Initial Tableau:");
game.tableau.columns.forEach((col, i) => {
  console.log(
    `Column ${i}:`,
    col.getTopNodes(10).map((n) => n.data)
  );
});

// Try moving cards
const success = game.moveTableauToTableau(0, 1, 1);
console.log("Move from column 0 to 1:", success);

// Print tableau after move
console.log("Tableau after move:");
game.tableau.columns.forEach((col, i) => {
  console.log(
    `Column ${i}:`,
    col.getTopNodes(10).map((n) => n.data)
  );
});
