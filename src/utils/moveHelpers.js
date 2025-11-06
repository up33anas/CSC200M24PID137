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
  console.log("cards:", typeof cards, cards);
  console.log("dest type:", typeof dest, dest);

  if (dest.insertAtEnd) {
    // for stack or linked list-based tableau
    cards.forEach((c) => dest.insertAtEnd(c));
  } else if (dest.enqueue) {
    // for queue (shouldn't happen for tableau)
    cards.forEach((c) => dest.enqueue(c));
  } else if (Array.isArray(dest)) {
    cards.forEach((c) => dest.push(c));
  } else {
    console.error("Unsupported destination structure:", dest);
  }
}

// Rule-specific wrappers for readability
export function moveTableauToTableau(fromCol, toCol, numCards) {
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
  const movingCard = fromCol.peek();
  const destIndex = findFoundationIndex(movingCard, foundation);

  if (destIndex === -1) {
    console.log("Invalid move to foundation");
    return { success: false };
  }

  const destPile = foundation.piles[destIndex];
  return moveCards(fromCol, destPile, () => true);
}

export function moveWasteToFoundation(waste, foundation) {
  if (!waste || waste.isEmpty()) {
    return { success: false };
  }

  const movingCard = waste.peek();
  const destIndex = findFoundationIndex(movingCard, foundation);
  if (destIndex === -1) return { success: false };

  const destPile = foundation.piles[destIndex];
  return moveCards(waste, destPile, () => true, 1);
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
export function moveCards(
  source,
  dest,
  validateFn,
  numCards = 1,
  selectedCard = null
) {
  if (source.isEmpty()) return { success: false };

  let movingCards;

  if (selectedCard) {
    // Custom: find the clicked card and move only that one
    const allCards = source.toArray();
    const index = allCards.findIndex(
      (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
    );
    if (index === -1) return { success: false };

    movingCards = [allCards[index]];
  } else if (source.getTopNodes) {
    movingCards = source
      .getTopNodes(numCards)
      .reverse()
      .map((n) => n.data || n);
  } else {
    movingCards = [source.peek()];
  }

  const destTop = getTopCard(dest);
  if (!validateFn(movingCards, destTop)) return { success: false };

  // Remove that specific card from source
  if (selectedCard) {
    source.removeCard(selectedCard); // You’ll need to implement this helper
  } else if (source.deleteTopNodes) {
    source.deleteTopNodes(numCards);
  } else if (source.pop) {
    for (let i = 0; i < numCards; i++) source.pop();
  }

  insertCards(dest, movingCards);

  if (!source.isEmpty() && source.peek && !source.peek().faceUp) {
    source.peek().faceUp = true;
  }

  return { success: true, cards: movingCards, from: source, to: dest };
}
