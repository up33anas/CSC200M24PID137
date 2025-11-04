import React from "react";
import CardUI from "./Card.jsx";

export default function TableauUI({ tableau }) {
  return (
    <div className="flex gap-5 px-7 py-2 justify-center">
      {tableau.columns.map((list, colIndex) => {
        const pile = list.toArray(); // convert linked list into an array
        return (
          <div key={colIndex} className="relative min-h-[300px] w-[120px] ">
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
