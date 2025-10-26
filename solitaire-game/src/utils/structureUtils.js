// Helper to get the top card of a structure (Stack or List)
export function getTopCard(structure) {
  if (structure.isEmpty()) return null;

  // If it's a Stack (has peek)
  if (typeof structure.peek === "function") {
    return structure.peek();
  }

  // If it's a List (like tableau column)
  if (typeof structure.getTopNodes === "function") {
    const topNodes = structure.getTopNodes(1);
    return topNodes.length ? topNodes[0].data : null;
  }

  return null; // fallback
}

// Helper to insert cards into destination structure
export function insertCards(dest, cardsOrNodes) {
  // Handle List-type dest (Tableau)
  if (typeof dest.insertNodesAtTop === "function") {
    return dest.insertNodesAtTop(cardsOrNodes);
  }

  // Handle Stack-type dest (Foundation, Waste)
  if (typeof dest.push === "function") {
    cardsOrNodes.forEach((card) => dest.push(card.data || card));
    return;
  }

  throw new Error("Destination type not supported for insertion");
}
