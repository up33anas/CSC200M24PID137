import React from "react";
import Tableau from "./Tableau.jsx";
import FoundationView from "./Foundation.jsx";
import StockView from "./Stock.jsx";
import WasteView from "./Waste.jsx";

export default function BoardView({ viewModel }) {
  const state = viewModel.getState();

  return (
    <div className="min-h-screen bg-teal-800 text-white flex flex-col items-center py-4">
      {/* Top area: Stock/Waste (left) and Foundation (right) */}
      <div className="flex justify-between items-start w-11/12 mb-16">
        {/* Left side: Stock + Waste */}
        <div className="flex gap-6">
          <StockView stock={state.stock} viewModel={viewModel} />
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
  );
}
