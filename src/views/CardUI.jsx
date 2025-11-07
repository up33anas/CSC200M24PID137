import React, { useMemo } from "react";
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
  const dragItem = useMemo(() => {
    if (!card?.faceUp) return null;
    return { type: "CARD", cards: stack, fromCol: columnIndex, source };
  }, [card, stack, columnIndex, source]);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: dragItem,
      canDrag: !!dragItem,
      collect: (m) => ({ isDragging: m.isDragging() }),
    }),
    [dragItem]
  );

  const handleClick = () => {
    if (!card.faceUp) return;
    console.log("Card clicked:", card);
    viewModel?.selectCard(card);
  };

  const key = card.suit[0].toUpperCase() + card.rank.toLowerCase();
  const Comp = deck[key] ?? deck["2C"];
  const Back = deck["B1"];

  return (
    <div
      ref={dragRef}
      onClick={handleClick}
      className={`
    w-30 h-45 rounded-lg select-none transition-all duration-200
    ${isHint ? "ring-4 ring-yellow-400 animate-pulse" : ""}
    ${isDragging ? "opacity-50 scale-105" : ""}
    ${card.faceUp ? "cursor-pointer hover:scale-105" : "cursor-default"}
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
