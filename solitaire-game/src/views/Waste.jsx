import React from "react";
import Card from "./Card.jsx";

export default function WasteView({ waste }) {
  const lastCard = waste[waste.length - 1];

  return (
    <div className="w-20 h-28 border-2 border-gray-400 rounded-lg bg-green-800/60 flex items-center justify-center">
      {lastCard ? (
        <Card card={lastCard} />
      ) : (
        <span className="opacity-50">🂠</span>
      )}
    </div>
  );
}
