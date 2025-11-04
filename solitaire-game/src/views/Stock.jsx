import React from "react";
import CardUI from "./Card";

export default function StockView({ stock, viewModel }) {
  const handleClick = () => {
    console.log("hmm...");
    viewModel.drawFromStock(); // moves top 3 to waste
  };

  const stockCards = stock.getStockCards(); // array of remaining stock cards
  const hasCards = stockCards.length > 0;

  return (
    <div
      className="relative w-30 h-45 cursor-pointer"
      onClick={handleClick}
      title={hasCards ? "Draw 3 cards" : "Recycle waste pile"}
    >
      {hasCards ? (
        stockCards.map((card, i) => (
          <div
            key={i}
            className="absolute w-full h-full border-2 border-gray-400 rounded-lg bg-green-800/60"
            style={{ top: i * 0.5 }}
          >
            {/* Show face-down card while in stock */}
            <CardUI card={{ ...card, faceUp: false }} />
          </div>
        ))
      ) : (
        <div className="w-full h-full border-2 border-gray-400 rounded-lg bg-green-800/60 flex items-center justify-center">
          ↩️
        </div>
      )}
    </div>
  );
}
