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
  // Skip drag if card is face-down
  const canDrag = !!card?.faceUp;

  // Stable drag payload
  const dragPayload = useMemo(
    () => ({
      type: "CARD",
      cards: stack,
      fromCol: columnIndex,
      source,
    }),
    [stack, columnIndex, source]
  );

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",

      // `item` is now a *function* (runs when drag starts)
      item: () => {
        if (canDrag && viewModel) {
          console.log("👉 Drag started:", card);
          viewModel.selectCard(card);
        }
        return dragPayload;
      },

      canDrag,

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [canDrag, dragPayload, card, viewModel]
  );

  // `end` is now handled by useEffect using monitor subscription (v14 change)
  React.useEffect(() => {
    if (!viewModel) return;

    // React DnD monitor event
    return () => {
      console.log("Drag ended — clearing selection");
      viewModel.clearSelection();
    };
  }, [viewModel]);

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
        ${
          card.faceUp
            ? "cursor-grab hover:scale-105 active:cursor-grabbing"
            : "cursor-default"
        }
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
