import React from "react";
import CardUI from "./Card";

export default function WasteView({ waste, viewModel }) {
  // Prepare 3 slots for the top 3 waste cards
  const slots = [0, 1, 2]; // always 3 slots

  return (
    <div className="flex gap-6">
      {slots.map((slotIndex) => {
        const card = waste[slotIndex]; // may be undefined if less than 3 cards
        return (
          <div
            key={slotIndex}
            className="w-30 h-45 bg-green-800/60 border-2 border-gray-400 rounded-lg flex items-center justify-center"
            // className="w-30 h-40 border-2 border-gray-400 rounded-lg bg-green-800/60 flex items-center justify-center cursor-pointer"
            onMouseDown={() => card && viewModel.selectCard(card)}
          >
            {card ? (
              <CardUI card={card} />
            ) : (
              <div className="w-full h-full" /> // empty placeholder
            )}
          </div>
        );
      })}
    </div>
  );
}
