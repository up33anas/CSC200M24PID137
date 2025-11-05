import React, { useEffect } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

export default function CardUI({ card, columnIndex, onDragStart }) {
  // Call useDrag
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: card ? { card, fromCol: columnIndex } : null,
      canDrag: !!card && card.faceUp,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [card, columnIndex, onDragStart] // deps
  );

  // Call onDragStart when drag starts
  useEffect(() => {
    if (isDragging && card && typeof onDragStart === "function") {
      onDragStart(card);
    }
  }, [isDragging, card, onDragStart]);

  // Early return: no card --> render nothing
  if (!card) return null;

  // Build card key
  const suitLetter = card.suit[0].toUpperCase();
  const rankLetter = card.rank.toLowerCase();
  const key = suitLetter + rankLetter;

  const CardComponent = deck[key];
  const Back = deck["B1"];

  // Render the card
  return (
    <div
      ref={dragRef}
      className={`w-30 h-45 cursor-grab transition-opacity ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
      style={{ touchAction: "none" }}
    >
      {card.faceUp ? (
        <CardComponent style={{ width: "100%", height: "100%" }} />
      ) : (
        <Back style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
