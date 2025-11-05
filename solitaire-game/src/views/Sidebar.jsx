import React from "react";

export default function Sidebar({
  moves = 0,
  score = 0,
  progress = 70,
  time = 0,
}) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-xl flex flex-col gap-5 border border-teal-700">
      <h2 className="text-2xl font-semibold text-center mb-1">YOUR STATS</h2>

      <div className="flex justify-between text-lg">
        <span>🕒 Time:</span>
        <span>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex justify-between text-lg">
        <span>🔢 Moves:</span>
        <span>{moves}</span>
      </div>

      <div className="flex justify-between text-lg">
        <span>🏆 Score:</span>
        <span>{score}</span>
      </div>

      <div>
        <span className="block mb-1 text-lg">📈 Progress</span>
        <div className="w-full bg-teal-700 h-3 rounded-full overflow-hidden">
          <div
            className="bg-green-400 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-right text-sm mt-1 block">{progress}%</span>
      </div>
    </div>
  );
}
