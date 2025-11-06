import React from "react";
import { useNavigate } from "react-router-dom";

export default function RulesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Go back to game board
  };

  return (
    <div
      className="
        h-screen w-full overflow-y-auto         
        bg-[url('https://img.freepik.com/premium-photo/dark-blue-abstract-background-with-geometric-pattern_1105541-1623.jpg')]
      text-white font-poppins p-8"
    >
      <h1 className=" text-amber-50 text-4xl font-cinzel mb-8 text-center">
        HOW TO PLAY & GAME RULES
      </h1>

      {/* Game Setup */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">
          What's the game
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>There is a standard deck of 52 cards.</li>
          <li>Shuffle the deck thoroughly before starting.</li>
          <li>
            Deal 7 tableau piles with increasing cards (1–7), top card face-up.
          </li>
          <li>The remaining cards form the stockpile (draw pile).</li>
        </ul>
      </div>

      {/* Drawing Cards */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-green-400">
          Drawing Cards
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>
            Draw <strong>three cards at a time</strong> from the stockpile to
            the waste pile.
          </li>
          <li>
            Any of the three visible cards can be played onto tableau or
            foundation piles.
          </li>
          <li>
            When the stockpile is empty, recycle the waste pile back to the
            stockpile.
          </li>
        </ul>
      </div>

      {/* Moves */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">Valid Moves</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>
            Tableau piles are built in descending order, alternating colors.
          </li>
          <li>Only a King can be placed on an empty tableau pile.</li>
          <li>Foundation piles are built by suit from Ace → King.</li>
          <li>Cards can be moved from tableau/waste to foundation if valid.</li>
        </ul>
      </div>

      {/* Victory Condition */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-red-400">When you win?</h2>
        <p className="text-lg">
          The game is won when all cards are moved to the foundation piles in
          the correct order.
        </p>
      </div>

      {/* Features */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-orange-400">
          Help for you
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Undo/Redo system: Track moves and undo mistakes.</li>
          <li>Timer & Score: Monitor your performance and move efficiency.</li>
          <li>
            Move any of the three waste cards strategically for optimal play.
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-teal-400">Success Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Uncover face-down tableau cards as soon as possible.</li>
          <li>Use the three-card draw wisely to maximize moves.</li>
          <li>Plan ahead to free up Kings for empty tableau spaces.</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="text-center cursor-pointer">
        <button
          onClick={handleBack}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-2xl text-lg shadow-md transition duration-300"
        >
          Back to Game
        </button>
      </div>
    </div>
  );
}
