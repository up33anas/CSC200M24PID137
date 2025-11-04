import React from "react";

export default function FoundationView({ foundation }) {
  return (
    <div className="flex gap-6">
      {foundation.piles.map((pile, index) => {
        const topCard = pile[pile.length - 1];
        return (
          <div
            key={index}
            className="w-20 h-28 bg-green-800/60 border-2 border-gray-400 rounded-lg flex items-center justify-center"
          >
            {topCard ? (
              <span className="text-xl">{`${topCard.rank}${topCard.suit.symbol}`}</span>
            ) : (
              <span className="opacity-50">A</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
