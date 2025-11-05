// import React, { useEffect, useMemo } from "react";
// import * as deck from "@letele/playing-cards";
// import { useDrag } from "react-dnd";

// export default function CardUI({
//   card,
//   columnIndex,
//   viewModel,
//   stack = [card], // whole face-up stack
//   source = "tableau", // "tableau" | "waste"
// }) {
//   const dragItem = useMemo(() => {
//     if (!card?.faceUp) return null;
//     return { type: "CARD", cards: stack, fromCol: columnIndex, source };
//   }, [card, stack, columnIndex, source]);

//   const [{ isDragging }, dragRef] = useDrag(
//     () => ({
//       type: "CARD",
//       item: dragItem,
//       canDrag: !!dragItem,
//       collect: (m) => ({ isDragging: m.isDragging() }),
//     }),
//     [dragItem]
//   );

//   useEffect(() => {
//     if (isDragging && viewModel?.onCardDragStart) {
//       viewModel.onCardDragStart?.(card);
//     }
//   }, [isDragging, card, viewModel]);

//   if (!card) return null;

//   const key = card.suit[0].toUpperCase() + card.rank.toLowerCase();
//   const Comp = deck[key] ?? deck["2C"];
//   const Back = deck["B1"];

//   return (
//     <div
//       ref={dragRef}
//       className={`
//         w-30 h-45 select-none transition-all duration-200
//         ${isDragging ? "opacity-50 scale-105" : "opacity-100"}
//         ${card.faceUp ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
//       `}
//       style={{ touchAction: "none" }}
//     >
//       {card.faceUp ? (
//         <Comp style={{ width: "100%", height: "100%" }} />
//       ) : (
//         <Back style={{ width: "100%", height: "100%" }} />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useMemo } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

export default function CardUI({
  card,
  columnIndex,
  viewModel,
  stack = [card], // whole face-up stack
  source = "tableau", // "tableau" | "waste"
}) {
  // Prepare the drag item
  const dragItem = useMemo(() => {
    if (!card?.faceUp) return null;
    return { type: "CARD", cards: stack, fromCol: columnIndex, source };
  }, [card, stack, columnIndex, source]);

  // Drag hook
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: dragItem,
      canDrag: !!dragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [dragItem]
  );

  // Optional callbacks for drag start/end
  useEffect(() => {
    if (isDragging && viewModel?.onCardDragStart) {
      viewModel.onCardDragStart?.(card);
    }
    if (!isDragging && viewModel?.onCardDragEnd) {
      viewModel.onCardDragEnd?.(card);
    }
  }, [isDragging, card, viewModel]);

  if (!card) return null;

  const key = card.suit[0].toUpperCase() + card.rank.toLowerCase();
  const Comp = card.faceUp ? deck[key] ?? deck["2C"] : deck["B1"];

  return (
    <div
      ref={dragRef}
      className={`
        w-30 h-45 select-none transition-all duration-200
        ${isDragging ? "opacity-50 scale-105" : "opacity-100"}
        ${card.faceUp ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
      `}
      style={{ touchAction: "none" }}
    >
      <Comp style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
