import React from "react";
import { useDrop } from "react-dnd";

export default function FoundationView({ foundation, viewModel }) {
  const symbols = ["♥", "♦", "♣", "♠"];

  return (
    <div className="flex gap-6">
      {foundation.piles.map((pile, index) => {
        const topCard = pile[pile.length - 1];

        const [{ isOver }, drop] = useDrop(() => ({
          accept: "CARD",
          drop: (item) => {
            try {
              if (item.source === "tableau") {
                console.log("Item source", item.source);

                // tableau → foundation: pass column index
                viewModel.moveTableauToFoundation(item.fromCol);
              } else if (item.source === "waste") {
                // waste → foundation: just call the method
                viewModel.moveWasteToFoundation();
                console.log("Item source: ", item.source);
              }
            } catch (err) {
              console.log("Invalid move:", err.message);
            }
          },
          collect: (monitor) => ({ isOver: monitor.isOver() }),
        }));

        return (
          <div
            key={index}
            ref={drop}
            className={`w-30 h-45 border-2 rounded-lg flex items-center justify-center transition-colors
              ${isOver ? "bg-green-200/40" : "bg-blue-900 border-gray-400"}
            `}
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
