import React from "react";
import CardUI from "./Card.jsx";

export default function TableauUI({ tableau }) {
  return (
    <div className="flex gap-5 px-5 py-6 justify-center">
      {tableau.columns.map((list, colIndex) => {
        const pile = list.toArray(); // convert linked list into an array
        return (
          <div
            key={colIndex}
            className="relative min-h-[400px] w-[90px] bg-emerald-900/40 border border-emerald-700 rounded-xl shadow-inner"
          >
            {pile.map((card, i) => (
              <div
                key={i}
                className="absolute transition-transform duration-200 hover:-translate-y-1"
                style={{ top: `${i * 30}px` }}
              >
                <CardUI card={card} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
