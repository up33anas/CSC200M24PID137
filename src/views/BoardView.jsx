import React from "react";
import Tableau from "./Tableau.jsx";
import FoundationView from "./Foundation.jsx";
import StockView from "./Stock.jsx";
import WasteView from "./Waste.jsx";
import Sidebar from "./Sidebar.jsx";

export default function BoardView({ viewModel }) {
  const [state, setState] = React.useState(viewModel.getState());

  React.useEffect(() => {
    viewModel.setState = setState;
  }, [viewModel]);

  return (
    <div
      className="
        h-[600px] w-full text-white font-poppins
        flex flex-row justify-center items-center
        py-8 px-10 gap-10
      "
    >
      {/* === Sidebar === */}
      <div className="px-5 w-65 shrink-0">
        <Sidebar
          moves={state.moves}
          score={state.score}
          progress={state.progress}
          time={state.time}
        />
      </div>

      {/* === Main Game Area === */}
      <div className="flex flex-col items-center grow w-full mx-auto p-8">
        {/* Top Section: Stock + Waste + Foundations */}
        <div className="flex justify-between items-start w-11/12 mb-16">
          <div className="flex gap-6">
            <StockView
              stock={state.stock.getStockCards()}
              viewModel={viewModel}
            />
            <WasteView waste={state.waste} viewModel={viewModel} />
          </div>
          <FoundationView foundation={state.foundation} />
        </div>

        {/* Tableau Section */}
        <div className="w-full flex justify-center">
          <Tableau tableau={state.tableau} viewModel={viewModel} />
        </div>
      </div>
    </div>
  );
}
