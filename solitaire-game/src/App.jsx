import React, { useState, useEffect } from "react";
import GameViewModel from "./viewModels/GameViewModel.js";
import BoardView from "./views/BoardView.jsx";

function App() {
  const [viewModel, setViewModel] = useState(null);

  useEffect(() => {
    const vm = new GameViewModel();
    vm.startNewGame();
    setViewModel(vm);
  }, []);

  if (!viewModel) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <BoardView viewModel={viewModel} />{" "}
    </div>
  );
}

export default App;
