// components/CardUI.jsx
import React, { useEffect } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

export default function CardUI({
  card,
  columnIndex,
  viewModel,
  stack, // array of cards starting with this one (all face-up)
}) {
  // ---------- BUILD DRAG ITEM ----------
  const dragItem = React.useMemo(() => {
    if (!card?.faceUp) return null;
    const cards = stack ?? [card];
    return { type: "CARD", cards, fromCol: columnIndex };
  }, [card, stack, columnIndex]);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: dragItem,
      canDrag: !!dragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [dragItem]
  );

  // optional: tell viewModel a drag started (e.g. for UI feedback)
  useEffect(() => {
    if (isDragging && viewModel?.onCardDragStart) {
      viewModel.onCardDragStart?.(card);
    }
  }, [isDragging, card, viewModel]);

  if (!card) return null;

  const key = card.suit[0].toUpperCase() + card.rank.toLowerCase();
  const Comp = deck[key] ?? deck["2C"];
  const Back = deck["B2"];

  return (
    <div
      ref={dragRef}
      className={`
        w-30 h-45 select-none transition-all
        ${isDragging ? "opacity-50 scale-105" : "opacity-100"}
        ${card.faceUp ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
      `}
      style={{ touchAction: "none" }}
    >
      {card.faceUp ? (
        <Comp style={{ width: "100%", height: "100%" }} />
      ) : (
        <Back style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
