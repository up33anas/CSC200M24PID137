import React, { useMemo, useEffect } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

export default function CardUI({
  card,
  columnIndex,
  viewModel,
  stack = [card],
  source = "tableau",
  isHint = false,
}) {
  if (!card) {
    return null;
  }

  // Create a drag item for React DnD
  const dragItem = useMemo(() => {
    if (!card.faceUp) return null;
    return { type: "CARD", cards: stack, fromCol: columnIndex, source };
  }, [card, stack, columnIndex, source]);

  // Enable dragging
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: dragItem,
      canDrag: !!dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dragItem]
  );

  // Automatically select the dragged card
  useEffect(() => {
    if (isDragging && card?.faceUp) {
      viewModel?.selectCard(card);
      console.log("Drag started — selected card:", card.toString?.() || card);
    }
  }, [isDragging, card, viewModel]);

  const handleClick = () => {
    if (!card.faceUp) return;
    viewModel?.selectCard(card);
  };

  // Card graphics
  const key = card?.suit?.[0]?.toUpperCase() + card?.rank?.toLowerCase();
  const Comp = (deck && deck[key]) || deck["2C"];
  const Back = deck["B1"];

  if (!Comp || !Back) {
    console.warn("Missing card asset for:", key);
    return null;
  }

  // Render
  return (
    <div
      key={isHint ? `hint-${Date.now()}` : card.id} // 🔥 Remount = animation restarts
      ref={dragRef}
      onClick={handleClick}
      className={`
      w-30 h-45 rounded-lg select-none transition-all duration-200
      ${
        isHint
          ? "ring-4 ring-yellow-400 ring-offset-2 ring-offset-black card-hint-jump"
          : ""
      }
      ${isDragging ? "opacity-50 scale-105" : ""}
      ${card.faceUp ? "cursor-pointer hover:scale-105" : "cursor-default"}
      bg-white
    `}
      style={{
        touchAction: "none",
        boxShadow:
          viewModel?.selectedCard === card
            ? "0 0 12px 3px rgba(255,255,0,0.6)"
            : "none",
      }}
    >
      {card.faceUp ? (
        <Comp style={{ width: "100%", height: "100%" }} />
      ) : (
        <Back style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
