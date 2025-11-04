import React from "react";
import Tableau from "./Tableau.jsx";
import FoundationView from "./Foundation.jsx";
import StockView from "./Stock.jsx";
import WasteView from "./Waste.jsx";

export default function BoardView({ viewModel }) {
  const state = viewModel.getState();

  return (
    <div className="min-h-screen bg-teal-900 text-white flex flex-col items-center py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-amber-100 bg-amber-700 px-6 py-2 rounded-2xl shadow-lg tracking-wide mb-10">
        ♠ Solitaire
      </h1>

      {/* Top area: Stock/Waste (left) and Foundation (right) */}
      <div className="flex justify-between items-start w-11/12 mb-16">
        {/* Left side: Stock + Waste */}
        <div className="flex gap-6">
          <StockView stock={state.stock} viewModel={viewModel} />
          <WasteView waste={state.waste} />
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
