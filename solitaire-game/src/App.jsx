import React, { useState, useEffect } from "react";
import GameViewModel from "./viewModels/GameViewModel.js";
import BoardView from "./views/BoardView.jsx";
import Header from "./views/Header.jsx";

function App() {
  const [viewModel, setViewModel] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const vm = new GameViewModel(setGameState); // Game view model
    vm.startNewGame();
    setViewModel(vm);
  }, []);

  if (!viewModel || !gameState)
    return <div className="text-white">Loading...</div>;

  return (
    <div>
      <Header />
      <BoardView viewModel={viewModel} />{" "}
    </div>
  );
}

export default App;
