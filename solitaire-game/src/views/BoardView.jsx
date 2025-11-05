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
      relative min-h-screen w-full text-white font-poppins flex flex-row justify-center items-start
      py-8 px-10 gap-10
      bg-[url('https://img.freepik.com/free-vector/black-casino-playing-card-background_1017-32733.jpg?ga=GA1.1.942879066.1762339683&semt=ais_hybrid&w=740&q=80')]
      bg-no-repeat bg-cover bg-center bg-fixed
      overflow-hidden
    "
    >
      {/* === Overlay for soft blending === */}
      <div className="absolute inset-0 bg-linear-to-b from-emerald-950/90 via-teal-950/75 to-slate-950/90 backdrop-blur-[3px]" />

      {/* === Content Layer === */}
      <div className="relative z-10 flex flex-row justify-center items-start gap-10 w-full max-w-7xl mx-auto">
        {/* === Sidebar === */}
        <div className="w-64 shrink-0">
          <Sidebar
            moves={state.moves}
            score={state.score}
            progress={state.progress}
            time={state.time}
          />
        </div>

        {/* === Main Game Area === */}
        <div
          className="
            flex flex-col items-center grow w-full mx-auto p-8
            rounded-3xl border border-teal-500/40
            bg-linear-to-b from-slate-900/70 via-teal-900/60 to-emerald-800/70
            shadow-[0_8px_40px_rgba(0,0,0,0.6)] 
            backdrop-blur-md
            transition-all duration-500
            hover:shadow-[0_8px_60px_rgba(0,0,0,0.7)]
          "
        >
          {/* Top Section: Stock + Waste + Foundation */}
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

          {/* Tableau */}
          <div className="w-full flex justify-center">
            <Tableau tableau={state.tableau} />
          </div>
        </div>
      </div>

      {/* Optional vignette for soft lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_70%)]" />
    </div>
  );
}
