var TYPE = require("./Types");
var COLOR = require("./Colors");
var NUMBER = require("./Numbers");
var Card = require("./Card");

/**
 * Generates an array of card objects representing a full deck of cards.
 * The deck includes numbered cards, action cards (reverse, skip, +2), and special cards (+4, select color).
 *
 * @returns {Card[]} - An array containing all the cards in the deck.
 */
function getCardsArray() {
  let cards = []; // Initialize an empty array to hold the cards
  let colors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW]; // Array of available card colors

  // Loop through each color
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];

    // Loop through each number to create numbered cards
    for (let j = 0; j < NUMBER.length; j++) {
      const number = NUMBER[j];

      // Create two cards for each number (except for 0)
      for (let k = 0; k < 2; k++) {
        cards.push(new Card(TYPE.NUMBER, color, number)); // Add a numbered card to the deck

        if (number === 0) {
          // Only one "0" card per color, break after adding the first one
          break;
        }
      }
    }

    // Add action cards for each color: 2 Reverse, 2 Skip, 2 +2
    cards.push(new Card(TYPE.REVERSE, color, null)); // Add a reverse card to the deck
    cards.push(new Card(TYPE.REVERSE, color, null)); // Add a second reverse card to the deck
    cards.push(new Card(TYPE.SKIP, color, null)); // Add a skip card to the deck
    cards.push(new Card(TYPE.SKIP, color, null)); // Add a second skip card to the deck
    cards.push(new Card(TYPE.T2, color, null)); // Add a +2 card to the deck
    cards.push(new Card(TYPE.T2, color, null)); // Add a second +2 card to the deck

    // Add special cards (not tied to a color): +4 and Select Color
    cards.push(new Card(TYPE.T4, null, null)); // Add a +4 card to the deck
    cards.push(new Card(TYPE.SELECT_COLOR, null, null)); // Add a Select Color card to the deck
  }

  return cards; // Return the complete deck of cards
}

module.exports = getCardsArray;
