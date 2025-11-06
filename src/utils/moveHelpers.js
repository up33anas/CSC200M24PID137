import {
  isValidSequence,
  canPlaceOnDestination,
  findFoundationIndex,
} from "./gameRules.js";

// Helper to get top card from various pile types
// function getTopCard(pile) {
//   if (pile.peek) return pile.peek();
//   if (Array.isArray(pile) && pile.length > 0) return pile[pile.length - 1];
//   return null;
// }
function getTopCard(pile) {
  // Case 1: Has a custom 'peekTop' or 'getTopCard' method
  if (typeof pile.getTopCard === "function") return pile.getTopCard();

  // Case 2: Has toArray()
  if (typeof pile.toArray === "function") {
    const arr = pile.toArray();
    return arr.length > 0 ? arr[arr.length - 1] : null;
  }

  // Case 3: Has peek()
  if (typeof pile.peek === "function") {
    const card = pile.peek();
    return card || null;
  }

  // Case 4: Is array
  if (Array.isArray(pile) && pile.length > 0) {
    return pile[pile.length - 1];
  }

  return null;
}

// Helper to insert cards into destination
export function insertCards(dest, cards) {
  if (!cards || cards.length === 0) return;

  console.log("Inserting cards into destination:", dest, cards);
  // console.log("cards:", typeof cards, cards);
  // console.log("dest type:", typeof dest, dest);

  if (dest.insertAtEnd) {
    cards.forEach((c) => dest.insertAtEnd(c));
  } else if (dest.push) {
    cards.forEach((c) => dest.push(c));
  } else if (dest.enqueue) {
    cards.forEach((c) => dest.enqueue(c));
  } else if (Array.isArray(dest)) {
    cards.forEach((c) => dest.push(c));
  } else {
    console.error("Unsupported destination structure:", dest);
  }
}

// Rule-specific wrappers for readability
export function moveTableauToTableau(fromCol, toCol, numCards) {
  console.log(
    "moveHelpers line 60 moving",
    numCards,
    "cards from",
    fromCol,
    "to",
    toCol
  );
  return moveCards(
    fromCol,
    toCol,
    (movingCards, destTop) => {
      // Validate sequence + destination placement
      return (
        isValidSequence(movingCards) &&
        canPlaceOnDestination(movingCards[0], destTop)
      );
    },
    numCards
  );
}

export function moveTableauToFoundation(fromCol, foundation) {
  const movingCard = fromCol.getTopNodes(1)[0]?.data || fromCol.peek();
  console.log(
    "Moving card:",
    movingCard,
    "typeof movingCard:",
    typeof movingCard
  );

  const destIndex = findFoundationIndex(movingCard, foundation);

  console.log("Moving card:", movingCard);
  console.log("Determined foundation index:", destIndex);

  if (destIndex === -1) {
    console.log("Invalid move to foundation");
    return { success: false };
  }

  const destPile = foundation.piles[destIndex];
  return moveCards(fromCol, destPile, () => true);
}

// export function moveWasteToFoundation(waste, foundation) {
//   if (!waste || waste.isEmpty()) {
//     console.log("Waste pile is empty");
//     return { success: false };
//   }

//   console.log("Waste pile top card:", waste.peek());
//   const movingCard = waste.peek();
//   const destIndex = findFoundationIndex(movingCard, foundation);
//   if (destIndex === -1) return { success: false };

//   const destPile = foundation.piles[destIndex];
//   return moveCards(waste, destPile, () => true, 1);
// }
export function moveWasteToFoundation(waste, foundation, selectedCard = null) {
  if (!waste || waste.isEmpty()) {
    console.log("Waste pile is empty");
    return { success: false };
  }

  // Use the selected card if provided, otherwise default to top
  const movingCard = selectedCard || waste.peek();
  console.log("Waste pile moving card:", movingCard);
  // Find the correct foundation pile for this card
  const destIndex = findFoundationIndex(movingCard, foundation);
  if (destIndex === -1) return { success: false };

  const destPile = foundation.piles[destIndex];

  // Call moveCards with the selected card
  return moveCards(waste, destPile, () => true, 1, movingCard);
}

export function moveWasteToTableau(waste, tableau, colIndex, selectedCard) {
  const dest = tableau.columns[colIndex];
  return moveCards(
    waste,
    dest,
    (movingCards, destTop) => canPlaceOnDestination(movingCards[0], destTop),
    1, // numCards
    selectedCard
  );
}

// Generic move executor - FIXED to return consistent result objects
// export function moveCards(
//   source,
//   dest,
//   validateFn,
//   numCards = 1,
//   selectedCard = null
// ) {
//   if (source.isEmpty()) return { success: false };

//   let movingCards;

//   if (selectedCard) {
//     // Custom: find the clicked card and move only that one
//     const allCards = source.toArray();
//     const index = allCards.findIndex(
//       (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
//     );
//     if (index === -1) return { success: false };

//     numCards == 1
//       ? (movingCards = [allCards[index]])
//       : (movingCards = allCards.slice(index));
//   } else if (source.getTopNodes) {
//     movingCards = source
//       .getTopNodes(numCards)
//       .reverse()
//       .map((n) => n.data || n);
//   } else {
//     movingCards = [source.peek()];
//   }

//   const destTop = getTopCard(dest);
//   if (!validateFn(movingCards, destTop)) return { success: false };

//   // Remove that specific card from source
//   if (selectedCard) {
//     source.removeCard(selectedCard); // You’ll need to implement this helper
//   } else if (source.deleteTopNodes) {
//     source.deleteTopNodes(numCards);
//   } else if (source.pop) {
//     for (let i = 0; i < numCards; i++) source.pop();
//   }

//   insertCards(dest, movingCards);

//   if (!source.isEmpty() && source.peek && !source.peek().faceUp) {
//     source.peek().faceUp = true;
//   }

//   // Flip last card of source column if needed
//   flipLastCardIfFaceDown(source);

//   return { success: true, cards: movingCards, from: source, to: dest };
// }
export function moveCards(
  source,
  dest,
  validateFn,
  numCards = 1,
  selectedCard = null
) {
  if (source.isEmpty()) return { success: false };

  let movingCards;

  // if (selectedCard) {
  //   // Find the clicked card in source
  //   const allCards = source.toArray();
  //   const index = allCards.findIndex(
  //     (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
  //   );
  //   if (index === -1) return { success: false };

  //   // If source is tableau, move all cards from selected card to top
  //   // If source is waste, only move selected card (waste only ever moves 1)
  //   movingCards =
  //     Array.isArray(source) || source.isTableau
  //       ? allCards.slice(index)
  //       : [allCards[index]];
  // } else if (source.getTopNodes) {
  //   movingCards = source
  //     .getTopNodes(numCards)
  //     .reverse()
  //     .map((n) => n.data || n);
  // } else {
  //   movingCards = [source.peek()];
  // }
  if (selectedCard) {
    // Find index of selected card
    const allCards = source.toArray();
    const index = allCards.findIndex(
      (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
    );
    if (index === -1) return { success: false };

    // Move all cards from selected card to top
    movingCards = allCards.slice(index);
  } else if (source.getTopNodes) {
    // getTopNodes should return top-to-bottom slice of `numCards`
    movingCards = source.getTopNodes(numCards).map((n) => n.data || n); // Remove reverse() if your top is already last in array
  } else {
    movingCards = [source.peek()];
  }

  const destTop = getTopCard(dest);
  if (!validateFn(movingCards, destTop)) return { success: false };

  // Remove the moving cards from source
  if (selectedCard) {
    if (Array.isArray(source) || source.isTableau) {
      // Remove all cards from selected card onwards
      const allCards = source.toArray();
      const index = allCards.findIndex(
        (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
      );
      if (index !== -1) source.removeCardsFromIndex(index);
    } else {
      // Waste or other single-card piles
      source.removeCard(selectedCard);
    }
  } else if (source.deleteTopNodes) {
    source.deleteTopNodes(numCards);
  } else if (source.pop) {
    for (let i = 0; i < numCards; i++) source.pop();
  }

  insertCards(dest, movingCards);

  // Flip top card of source if face down
  flipLastCardIfFaceDown(source);

  return { success: true, cards: movingCards, from: source, to: dest };
}

function flipLastCardIfFaceDown(column) {
  if (!column || column.isEmpty()) return;

  let lastNode;
  if (typeof column.getLastNode === "function") {
    lastNode = column.getLastNode();
  } else if (typeof column.toArray === "function") {
    const arr = column.toArray();
    lastNode = arr.length ? arr[arr.length - 1] : null;
  } else if (Array.isArray(column)) {
    lastNode = column[column.length - 1];
  }

  if (lastNode) {
    const card = lastNode.data || lastNode;
    if (!card.faceUp) card.faceUp = true;
  }
}
