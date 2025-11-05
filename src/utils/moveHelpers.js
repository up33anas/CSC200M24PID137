import {
  isValidSequence,
  canPlaceOnDestination,
  findFoundationIndex,
} from "./gameRules.js";
import { getTopCard, insertCards } from "./structureUtils.js";

// Generic move executor
export function moveCards(source, dest, validateFn, numCards = 1) {
  if (source.isEmpty()) {
    console.log("Source empty, cannot move");
    return false;
  }

  const movingNodes = source.getTopNodes
    ? source.getTopNodes(numCards)
    : [source.peek()];

  const movingCards = movingNodes.map((n) => n.data || n);
  const destTop = getTopCard(dest);

  // Validation callback (game-specific)
  if (!validateFn(movingCards, destTop)) {
    console.log("Invalid move");
    return false;
  }

  // Remove from source
  if (typeof source.deleteTopNodes === "function") {
    source.deleteTopNodes(numCards);
  } else if (typeof source.pop === "function") {
    for (let i = 0; i < numCards; i++) source.pop();
  }

  // Perform move
  insertCards(dest, movingNodes);

  console.log(`Moved ${movingCards.length} card(s) successfully`);
  return {
    success: true,
    movedCards: movingCards,
    from: source,
    to: dest,
  };
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

//
export function moveTableauToFoundation(fromCol, foundation) {
  const movingCard = fromCol.peek();
  const destIndex = findFoundationIndex(movingCard, foundation);

  if (destIndex === -1) {
    console.log("Invalid move to foundation");
    return false;
  }

  const destPile = foundation.piles[destIndex];
  return moveCards(fromCol, destPile, () => true);
}

//
export function moveWasteToFoundation(waste, foundation) {
  const movingCard = waste.peek();
  const destIndex = findFoundationIndex(movingCard, foundation);
  if (destIndex === -1) return false;

  const destPile = foundation.piles[destIndex];
  return moveCards(waste, destPile, () => true);
}

//
export function moveWasteToTableau(waste, tableau, colIndex) {
  const dest = tableau.columns[colIndex];
  return moveCards(waste, dest, (movingCards, destTop) =>
    canPlaceOnDestination(movingCards[0], destTop)
  );
}
