import React from "react";
import CardUI from "./CardUI";

export default function StockView({ stock, viewModel }) {
  const hintedCard = viewModel?.hint?.card;

  const handleClick = () => {
    viewModel.drawFromStock(); // moves top 3 to waste
  };

  const handleRecycle = () => {
    viewModel.recycleFromWaste();
  };

  const hasCards = stock.length > 0;

  return (
    <div
      className="relative w-30 h-45 cursor-pointer"
      onClick={hasCards ? handleClick : handleRecycle}
      title={hasCards ? "Draw 3 cards" : "Recycle waste pile"}
    >
      {hasCards ? (
        stock.map((card, i) => (
          <div
            key={i}
            className="absolute w-full h-full border-2 border-gray-400 rounded-lg bg-blue-900/60"
            style={{ top: i * 0.5 }}
          >
            <CardUI
              card={{ ...card, faceUp: false }}
              isHint={
                hintedCard &&
                hintedCard.suit === card.suit &&
                hintedCard.rank === card.rank
              }
            />
          </div>
        ))
      ) : (
        <div className="text-3xl w-full h-full border-2 border-gray-400 rounded-lg bg-blue-900/60 flex items-center justify-center">
          ↩
        </div>
      )}
    </div>
  );
}
