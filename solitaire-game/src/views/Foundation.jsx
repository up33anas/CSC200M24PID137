import React from "react";

export default function FoundationView({ foundation }) {
  const symbols = ["♥", "♦", "♣", "♠"];

  return (
    <div className="flex gap-6">
      {foundation.piles.map((pile, index) => {
        const topCard = pile[pile.length - 1];
        return (
          <div
            key={index}
            className="w-30 h-45 bg-green-800/60 border-2 border-gray-400 rounded-lg flex items-center justify-center"
          >
            {topCard ? (
              <span className="text-xl">{`${topCard.rank}${topCard.suit.symbol}`}</span>
            ) : (
              <span className="opacity-50 text-5xl">{symbols[index]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
