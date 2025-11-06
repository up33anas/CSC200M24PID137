import React from "react";
import { useNavigate } from "react-router-dom";

export default function LeavePage() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white font-poppins">
      <h1 className="text-4xl font-bold mb-4">Thank You for Playing!</h1>
      <p className="text-lg mb-8">We hope you enjoyed the game.</p>
      <button
        onClick={handleBackHome}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
      >
        Back to Home
      </button>
    </div>
  );
}
