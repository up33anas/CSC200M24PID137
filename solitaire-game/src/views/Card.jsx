import React from "react";
import * as deck from "@letele/playing-cards";

export default function CardUI({ card, style }) {
  if (!card) return null;

  const suitLetter = card.suit[0].toUpperCase(); // hearts → H, spades → S
  const rankLetter = card.rank.toLowerCase(); // K → k, 10 → 10
  const key = suitLetter + rankLetter;

  const CardComponent = deck[key];
  const Back = deck["B1"]; // or "B2" for different back

  return (
    <div style={{ width: "80px", height: "112px", ...style }}>
      {card.faceUp ? (
        <CardComponent style={{ width: "100%", height: "100%" }} />
      ) : (
        <Back style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
