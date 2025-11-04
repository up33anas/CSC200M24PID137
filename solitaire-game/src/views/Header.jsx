import React from "react";
import { Undo2, Redo2, RefreshCcw } from "lucide-react"; // lightweight icon set

export default function Header({ onUndo, onRedo, onNewGame }) {
  return (
    <header className="border flex items-center justify-between bg-amber-700 text-amber-50 px-6 py-3 shadow-lg w-full">
      {/* Left: Game Title */}
      <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">
        ♠ Solitaire
      </h1>

      {/* Right: Control Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onUndo}
          className="flex items-center gap-2 bg-orange-800 hover:bg-orange-900 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
        >
          <Undo2 size={18} /> Undo
        </button>
        <button
          onClick={onRedo}
          className="flex items-center gap-2 bg-orange-800 hover:bg-orange-900 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
        >
          <Redo2 size={18} /> Redo
        </button>
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
        >
          <RefreshCcw size={18} /> New Game
        </button>
      </div>
    </header>
  );
}
