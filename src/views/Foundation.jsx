import React from "react";
import CardUI from "./CardUI.jsx";
import { useDrop } from "react-dnd";

export default function FoundationView({ foundation, viewModel }) {
  const hintedCard = viewModel?.hint?.card;

  const symbols = ["♥", "♦", "♣", "♠"];

  return (
    <div className="flex gap-6">
      {foundation.piles.map((pile, index) => {
        const topCard = pile.peek && !pile.isEmpty() ? pile.peek() : null;

        const [{ isOver }, drop] = useDrop(() => ({
          accept: "CARD",
          drop: (item) => {
            try {
              if (item.source === "tableau") {
                viewModel.moveTableauToFoundation(item.fromCol);
              } else if (item.source === "waste") {
                console.log("card to drop", item.card);
                viewModel.moveWasteToFoundation(item.card);
                console.log("wasteToFoundation above me!");
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
              <CardUI
                card={topCard}
                viewModel={viewModel}
                source="foundation"
                isHint={
                  hintedCard &&
                  hintedCard.suit === topCard.suit &&
                  hintedCard.rank === topCard.rank
                }
              />
            ) : (
              <span className="opacity-50 text-5xl">{symbols[index]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
