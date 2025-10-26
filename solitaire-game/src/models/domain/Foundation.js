import Stack from "../data structures/Stack.js";

// Foundation class to manage the four foundation piles
export default class Foundation {
  constructor() {
    this.piles = Array.from({ length: 4 }, () => new Stack());
  }
}
