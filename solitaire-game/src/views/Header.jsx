import React, { useEffect, useState } from "react";
import { Undo2, Redo2, RefreshCcw } from "lucide-react";

export default function Header({
  onUndo,
  onRedo,
  onNewGame,
  moves = 0,
  score = 0,
  startTime,
}) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // seconds
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <header className="border-b-gray-900 flex items-center justify-between bg-gray-900 text-amber-50 px-6 py-3 shadow-lg w-full">
      {/* Left: Game Title */}
      <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">
        ♠ The Pseudo Solitaire
      </h1>

      {/* Middle: Stats */}
      <div className="flex gap-6 items-center font-semibold">
        <div>Moves: {moves}</div>
        <div>Score: {score}</div>
        <div>Time: {formatTime(elapsedTime)}</div>
      </div>

      {/* Right: Control Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onUndo}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
        >
          <Undo2 size={18} /> Undo
        </button>
        <button
          onClick={onRedo}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
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
