// Converts rank (A, J, Q, K) into numeric value
export function rankValue(rank) {
  const map = { A: 1, J: 11, Q: 12, K: 13 };
  return map[rank] || parseInt(rank);
}

// Finds the correct foundation pile index for a moving card
export function findFoundationIndex(movingCard, foundation) {
  for (let i = 0; i < foundation.piles.length; i++) {
    const pile = foundation.piles[i];
    const topCard = pile.isEmpty() ? null : pile.peek();

    if (topCard) {
      if (
        topCard.suit === movingCard.suit &&
        rankValue(topCard.rank) + 1 === rankValue(movingCard.rank)
      ) {
        return i;
      }
    } else if (movingCard.rank === "A") {
      return i;
    }
  }
  return -1; // No valid pile found
}

// Checks if two suits are of the same color
export function isSameColor(suit1, suit2) {
  const redSuits = ["Hearts", "Diamonds"];
  const blackSuits = ["Clubs", "Spades"];
  return (
    (redSuits.includes(suit1) && redSuits.includes(suit2)) ||
    (blackSuits.includes(suit1) && blackSuits.includes(suit2))
  );
}

// Checks if a sequence of cards is valid for tableau movement
export function isValidSequence(cards) {
  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];

    if (rankValue(current.rank) !== rankValue(next.rank) + 1) return false;
    if (isSameColor(current.suit, next.suit)) return false;
  }
  return true;
}

// Checks if a card can be placed on a destination card in tableau
export function canPlaceOnDestination(movingCard, destCard) {
  if (!destCard) {
    console.log("inside canPlaceOnDestination:", movingCard, destCard);
    return movingCard.rank === "K"; // Only King can be placed on empty spot
  }
  console.log("inside canPlaceOnDestination:", movingCard, destCard);

  console.log("rankValue(movingCard.rank):", rankValue(movingCard.rank));
  console.log("rankValue(destCard.rank):", rankValue(destCard.rank));
  console.log(
    "color and rank comparison:",
    rankValue(movingCard.rank) === rankValue(destCard.rank) - 1 &&
      !isSameColor(movingCard.suit, destCard.suit)
  );
  return (
    rankValue(movingCard.rank) === rankValue(destCard.rank) - 1 &&
    !isSameColor(movingCard.suit, destCard.suit)
  );
}
