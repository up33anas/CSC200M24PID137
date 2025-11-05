import React from "react";
import CardUI from "./Card";

export default function WasteView({ waste, viewModel }) {
  // Reactively show the top 3 cards
  const visibleCards = waste.slice(-3); // always re-computed from current state

  const handleCardClick = (card) => {
    viewModel.selectCard(card);
  };

  return (
    <div className="relative w-30 h-45">
      {waste.length === 0 && (
        <div className="w-full h-full border-2 border-gray-400 rounded-lg bg-green-800/60 flex items-center justify-center">
          <span className="text-gray-300 text-3xl">🂠</span>
        </div>
      )}

      {visibleCards.map((card, index) => (
        <div
          key={card.id || index}
          className="absolute transition-transform duration-300 cursor-pointer"
          style={{
            left: `${index * 27}px`, // slight horizontal offset
            zIndex: 100 + index, // ensure correct stacking
          }}
          onMouseDown={() => handleCardClick(card)}
        >
          <CardUI card={card} />
        </div>
      ))}
    </div>
  );
}
