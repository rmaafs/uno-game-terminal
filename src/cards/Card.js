var TYPE = require("./Types");
const { isNumeric } = require("../Utils");

class Card {
  // Constructor to initialize the card with type, color, and number
  constructor(type, color, number) {
    this.type = type; // Card type (e.g., number, reverse, skip)
    this.color = color; // Card color (e.g., red, blue)
    this.number = number; // Card number (if applicable)
  }

  /**
   * Check if the current card has the same color as another card
   * @param {Card} card - Another card to compare color with
   * @returns {boolean} - True if the current card has the same color as the other card
   */
  isSameColor(card) {
    return this.color === card.color;
  }

  /**
   * Check if this card is a select color card
   * @returns {boolean} - True if this is a select color card
   */
  isColorCard() {
    return this.color !== undefined;
  }

  /**
   * Check if the current card has the same numeric value as another card
   * @param {Card} card - Another card to compare the number with
   * @returns {boolean} - True if both cards are numeric and have the same number
   */
  isSameNumeric(card) {
    return (
      isNumeric(this.number) && // Check if current card's number is numeric
      isNumeric(card.number) && // Check if other card's number is numeric
      this.number === card.number // Check if both numbers are the same
    );
  }

  /**
   * Check if the current card has the same special type (e.g., reverse, skip) as another card
   * @param {Card} card - Another card to compare the special type with
   * @returns {boolean} - True if both cards have the same special type
   */
  isSameSpecialType(card) {
    if (
      this.type === TYPE.REVERSE || // Check if current card is a reverse card
      this.type === TYPE.SKIP || // Check if current card is a skip card
      this.type === TYPE.T2 // Check if current card is a +2 card
    ) {
      return this.type === card.type; // Check if both cards are of the same special type
    }

    return false;
  }

  /**
   * Determine if the current card is playable with another card, considering special rules
   * @param {Card} card - The card currently on the deck
   * @param {number} giveCardsNextPlayer - Number of cards to give to the next player
   * @returns {boolean} - True if the current card is playable
   */
  isPlayeableWith(card, giveCardsNextPlayer) {
    // If current card is a "Select color" card and no cards need to be given to the next player
    if (this.type === TYPE.SELECT_COLOR && giveCardsNextPlayer === 0) {
      return true;
    }
    // If current card is a +4 card, it's always playable
    else if (this.type === TYPE.T4) {
      return true;
    }

    // Check if the deck card is a "Select color" or +4 card, and if they share the same color
    if ((card.isSelectColor() || card.isT4()) && this.isSameColor(card)) {
      // If the deck card has +4 and the current card isn't +4, it's not playable
      if (giveCardsNextPlayer > 0 && !this.isT4()) {
        return false;
      }
      return true;
    }

    // If cards need to be given to the next player
    if (giveCardsNextPlayer > 0) {
      // Ensure both cards are +2 cards, otherwise, it's not playable
      if ((this.isT2() && !card.isT2()) || (card.isT2() && !this.isT2())) {
        return false;
      }
    }

    // Check other playability conditions: same special type, color, or number
    if (this.isSameSpecialType(card)) {
      return true;
    }
    if (this.isSameColor(card)) {
      return true;
    }
    if (this.isSameNumeric(card)) {
      return true;
    }
  }

  /**
   * Determines if the current card is a numeric card.
   * Numeric cards have a number as their type.
   * @returns {boolean} - True if the card is a numeric card, false otherwise.
   */
  isNumeric() {
    return this.type === TYPE.NUMBER;
  }

  /**
   * Determines if the current card is a reverse card.
   * Reverse cards change the direction of play.
   * @returns {boolean} - True if the card is a reverse card, false otherwise.
   */
  isReverse() {
    return this.type === TYPE.REVERSE;
  }

  /**
   * Determines if the current card is a skip card.
   * Skip cards cause the next player to lose their turn.
   * @returns {boolean} - True if the card is a skip card, false otherwise.
   */
  isSkip() {
    return this.type === TYPE.SKIP;
  }

  /**
   * Determines if the current card is a +2 card.
   * +2 cards force the next player to draw two cards.
   * @returns {boolean} - True if the card is a +2 card, false otherwise.
   */
  isT2() {
    return this.type === TYPE.T2;
  }

  /**
   * Determines if the current card is a +4 card.
   * +4 cards force the next player to draw four cards and allow the player to change the current color.
   * @returns {boolean} - True if the card is a +4 card, false otherwise.
   */
  isT4() {
    return this.type === TYPE.T4;
  }

  /**
   * Determines if the current card is a "Select Color" card.
   * "Select Color" cards allow the player to change the current color in play.
   * @returns {boolean} - True if the card is a "Select Color" card, false otherwise.
   */
  isSelectColor() {
    return this.type === TYPE.SELECT_COLOR;
  }
}

// Export the Card class for use in other modules
module.exports = Card;
