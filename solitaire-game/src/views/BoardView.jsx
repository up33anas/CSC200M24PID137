import React from "react";
import Tableau from "./Tableau.jsx";
import FoundationView from "./Foundation.jsx";
import StockView from "./Stock.jsx";
import WasteView from "./Waste.jsx";
import Sidebar from "./Sidebar.jsx"; // ⬅️ Import Sidebar

export default function BoardView({ viewModel }) {
  const [state, setState] = React.useState(viewModel.getState());

  // Sync backend updates with React re-render
  React.useEffect(() => {
    viewModel.setState = setState;
  }, [viewModel]);

  console.log("STOCK", state.stock, "WASTE", state.waste);

  return (
    <div className="min-h-screen bg-teal-800 text-white flex flex-row justify-center items-start py-6 gap-10 px-10">
      {/* === Left Sidebar === */}
      <div className="w-64 shrink-0">
        <Sidebar
          moves={state.moves}
          score={state.score}
          progress={state.progress}
          time={state.time}
        />
      </div>

      {/* === Main Game Area === */}
      <div className="flex flex-col items-center grow">
        {/* Top area: Stock/Waste + Foundations */}
        <div className="flex justify-between items-start w-11/12 mb-16">
          {/* Left side: Stock + Waste */}
          <div className="flex gap-6">
            <StockView
              stock={state.stock.getStockCards()}
              viewModel={viewModel}
            />
            <WasteView waste={state.waste} viewModel={viewModel} />
          </div>

          {/* Right side: Foundations */}
          <FoundationView foundation={state.foundation} />
        </div>

        {/* Bottom area: Tableau */}
        <div className="w-full flex justify-center">
          <Tableau tableau={state.tableau} />
        </div>
      </div>
    </div>
  );
}
