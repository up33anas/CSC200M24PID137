import React from "react";

export default function StockView({ stock, viewModel }) {
  const handleClick = () => {
    viewModel.drawCard();
  };

  return (
    <div
      className="w-20 h-28 border-2 border-gray-400 rounded-lg bg-green-800/60 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {stock.length > 0 ? "🂠" : "↩️"}
    </div>
  );
}
