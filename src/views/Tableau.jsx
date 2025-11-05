// import React from "react";
// import CardUI from "./CardUI.jsx";
// import { useDrop } from "react-dnd";

// export default function TableauUI({ tableau, viewModel }) {
//   // Handle drop on tableau column
//   const handleDropCard = (item, toColIndex) => {
//     const fromColIndex = item.fromCol;
//     const fromCol = tableau.columns[fromColIndex]; // get the actual column object
//     const toCol = tableau.columns[toColIndex];

//     try {
//       if (item.source === "tableau") {
//         viewModel.moveTableauToTableau(fromCol, toCol, item.stack.length || 1);
//       } else if (item.source === "waste") {
//         viewModel.moveWasteToTableau(toCol);
//       }
//     } catch (err) {
//       console.log("Invalid move:", err.message);
//     }
//   };

//   return (
//     <div className="flex gap-5 px-7 py-2 justify-center">
//       {tableau.columns.map((list, colIndex) => {
//         const pile = list.toArray();

//         // Tableau column drop target
//         const [{ isOver }, drop] = useDrop(() => ({
//           accept: "CARD",
//           drop: (item) => handleDropCard(item, colIndex),
//           collect: (monitor) => ({ isOver: monitor.isOver() }),
//         }));

//         return (
//           <div
//             key={colIndex}
//             ref={drop}
//             className={`relative min-h-[280px] w-[120px] p-1 transition-colors ${
//               isOver ? "bg-blue-200/30" : "bg-blue-100/10"
//             }`}
//           >
//             {pile.map((card, i) => {
//               const stack = pile.slice(i).filter((c) => c.faceUp); // only face-up cards
//               return (
//                 <div
//                   key={i}
//                   className="absolute transition-transform duration-200 hover:-translate-y-1"
//                   style={{ top: `${i * 17}px` }}
//                 >
//                   <CardUI
//                     card={card}
//                     columnIndex={colIndex}
//                     viewModel={viewModel}
//                     stack={stack}
//                     source="tableau"
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
import React from "react";
import CardUI from "./CardUI.jsx";
import { useDrop } from "react-dnd";

// Single Tableau Column Component
function TableauColumn({ column, colIndex, viewModel }) {
  const pile = column.toArray();

  const handleDropCard = (item) => {
    const fromColIndex = item.fromCol;
    const fromCol = viewModel.getState().tableau.columns[fromColIndex];
    const toCol = viewModel.getState().tableau.columns[colIndex];

    try {
      if (item.source === "tableau") {
        viewModel.moveTableauToTableau(fromCol, toCol, item.stack.length || 1);
      } else if (item.source === "waste") {
        viewModel.moveWasteToTableau(colIndex);
      }
    } catch (err) {
      console.log("Invalid move:", err.message);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: handleDropCard,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`relative min-h-[280px] w-[120px] p-1 transition-colors ${
        isOver ? "bg-blue-200/30" : "bg-blue-100/10"
      }`}
    >
      {pile.map((card, i) => {
        const stack = pile.slice(i).filter((c) => c.faceUp); // only face-up cards
        return (
          <div
            key={i}
            className="absolute transition-transform duration-200 hover:-translate-y-1"
            style={{ top: `${i * 17}px` }}
          >
            <CardUI
              card={card}
              columnIndex={colIndex}
              viewModel={viewModel}
              stack={stack}
              source="tableau"
            />
          </div>
        );
      })}
    </div>
  );
}

// Main Tableau View
export default function TableauUI({ tableau, viewModel }) {
  return (
    <div className="flex gap-5 px-7 py-2 justify-center">
      {tableau.columns.map((column, index) => (
        <TableauColumn
          key={index}
          column={column}
          colIndex={index}
          viewModel={viewModel}
        />
      ))}
    </div>
  );
}
