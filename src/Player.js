var {
  removeElementAtIndex, // Removes an element from an array at a specific index
  removeElement, // Removes a specific element from an array
  randomizeArray, // Randomizes the order of elements in an array
} = require("./Utils");

const COLOR = require("./cards/Colors");

/**
 * Represents a player in the game.
 * Each player has an ID, a name, a flag indicating if they are human or not, and a hand of cards.
 */
class Player {
  /**
   * Constructs a new Player instance.
   *
   * @param {number} id - The unique identifier for the player.
   * @param {string} [name] - The name of the player. If not provided, defaults to "Player" followed by the player's ID.
   * @param {boolean} isHuman - Indicates whether the player is human or an AI.
   */
  constructor(id, name, isHuman) {
    this.id = id; // Unique identifier for the player
    this.name = name ?? "Player " + this.id; // Player's name, defaulting to "Player [id]" if not provided
    this.isHuman = isHuman; // Boolean indicating if the player is human or AI
    this.cards = []; // Array holding the player's current hand of cards
  }

  /**
   * Adds a card to the player's hand.
   *
   * @param {Card} card - The card to be added to the player's hand.
   */
  addCard(card) {
    this.cards.push(card);
  }

  /**
   * Removes a specific card from the player's hand.
   *
   * @param {Card} card - The card to be removed from the player's hand.
   */
  removeCard(card) {
    this.cards = removeElement(this.cards, card);
  }

  /**
   * Removes a card from the player's hand based on its index.
   *
   * @param {number} cardIndex - The index of the card to be removed.
   */
  removeCardIndex(cardIndex) {
    this.cards = removeElementAtIndex(this.cards, cardIndex);
  }

  /**
   * Simulates the player's move by finding a card that can be played on the current deck card.
   *
   * @param {Object} uno - The game instance, used to access the current deck card and other game states.
   * @returns {Card|undefined} - Returns the first playable card from the player's hand, or undefined if no card is playable.
   */
  simulateMovement(uno) {
    const deckCard = uno.getActualDeckCard();

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.isPlayeableWith(deckCard, uno.giveCardsNextPlayer)) {
        return card;
      }
    }

    return undefined;
  }

  /**
   * Checks if the player has a +2 or +4 card in their hand.
   *
   * @returns {boolean} - True if the player has a +2 or +4 card, false otherwise.
   */
  hasT2orT4() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.isT2() || card.isT4()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Randomly selects a color that is different from the current color in play.
   *
   * @param {string} currentColor - The current color in play.
   * @returns {string} - A randomly selected color that is different from the current color.
   */
  selectRandomColor(currentColor) {
    let colors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW];
    colors = removeElement(colors, currentColor); // Remove the current color from the selection
    return randomizeArray(colors)[0]; // Randomly select a different color
  }
}

module.exports = Player;
