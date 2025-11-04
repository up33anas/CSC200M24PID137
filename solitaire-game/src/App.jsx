import React, { useState, useEffect } from "react";
import Tableau from "./models/domain/Tableau.js";
import Deck from "./models/domain/Deck.js";
import TableauUI from "./views/Tableau.jsx";

export default function App() {
  const [tableau, setTableau] = useState(null);

  useEffect(() => {
    const deck = new Deck();
    deck.shuffle();
    const newTableau = new Tableau();
    newTableau.deal(deck);
    setTableau(newTableau);
  }, []);

  if (!tableau) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-900 text-white text-xl font-semibold">
        Loading Solitaire...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-700 flex flex-col items-center py-10">
      <h1 className="text-white text-3xl font-bold mb-8 tracking-wide drop-shadow-lg">
        ♠ Solitaire
      </h1>

      <div className="w-full max-w-6xl flex justify-center gap-4">
        {/* The tableau layout */}
        <TableauUI tableau={tableau} />
      </div>
    </div>
  );
}
