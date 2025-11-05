// import React from "react";
// import CardUI from "./CardUI";
// import { useDrag } from "react-dnd";

// export default function WasteView({ waste, viewModel }) {
//   // Show top 3 cards
//   const visibleCards = waste.slice(-3);

//   return (
//     <div className="relative w-30 h-45">
//       {waste.length === 0 && (
//         <div className="w-full h-full border-2 border-gray-400 rounded-lg bg-blue-900/60 flex items-center justify-center">
//           <span className="text-gray-300 text-3xl">🂠</span>
//         </div>
//       )}

//       {visibleCards.map((card, index) => {
//         // Make waste card draggable
//         const [{ isDragging }, drag] = useDrag(() => ({
//           type: "CARD",
//           item: { card, fromCol: null, source: "waste" },
//           canDrag: () => card.faceUp, // only face-up cards
//           collect: (monitor) => ({
//             isDragging: monitor.isDragging(),
//           }),
//         }));

//         return (
//           <div
//             key={card.id || index}
//             ref={drag}
//             className="absolute transition-transform duration-300 cursor-grab"
//             style={{
//               left: `${index * 27}px`, // slight horizontal offset
//               zIndex: 100 + index, // correct stacking
//               opacity: isDragging ? 0.4 : 1,
//             }}
//           >
//             <CardUI card={card} viewModel={viewModel} source="waste" />
//           </div>
//         );
//       })}
//     </div>
//   );
// }import React from "react";import React from "react";
import CardUI from "./CardUI";
import { useDrag } from "react-dnd";

export default function WasteView({ waste, viewModel }) {
  // Show top 3 cards
  const visibleCards = waste.slice(-3);

  return (
    <div className="relative w-30 h-45">
      {waste.length === 0 && (
        <div className="w-full h-full border-2 border-gray-400 rounded-lg bg-blue-900/60 flex items-center justify-center">
          <span className="text-gray-300 text-3xl">🂠</span>
        </div>
      )}

      {visibleCards.map((card, index) => (
        <CardWrapper
          key={card.id || index}
          card={card}
          viewModel={viewModel}
          index={index}
        />
      ))}
    </div>
  );
}

// Separate wrapper to use useDrag at top level
function CardWrapper({ card, viewModel, index }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "CARD",
    item: { card, fromCol: null, source: "waste", stack: [card] },
    canDrag: () => card.faceUp,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={dragRef}
      className="absolute transition-transform duration-300 cursor-grab"
      style={{
        left: `${index * 27}px`,
        zIndex: 100 + index,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <CardUI card={card} viewModel={viewModel} source="waste" />
    </div>
  );
}
