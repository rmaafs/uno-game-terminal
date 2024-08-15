const TYPE = require("./cards/Types");

// Keeps track of the previous count of cards held by each player to determine changes in their hand size
const previousCardsCount = {};

/**
 * Prints the entire game board, including the state of each player's hand, the deck, and the cards on the table.
 *
 * @param {Object} uno - The game instance, which contains the current state of the game, including players and cards.
 */
function printBoard(uno) {
  printSpaces(20); // Print some empty lines to create spacing for the board display

  let strLog = ""; // Initialize a string to build the log for the board

  // Loop through all players except the human player, starting from the last player
  for (let i = uno.players.length - 1; i >= 1; i--) {
    const player = uno.players[i];
    const playerPlaying = uno.playerPlaying;
    const isPlaying = playerPlaying.id === player.id; // Determine if this player is the one currently playing

    // Calculate the change in the player's card count since the last turn
    previousCardCount = previousCardsCount[player.id] - player.cards.length;

    // Determine the background color based on whether the player has one card left or is currently playing
    const hasOne = player.cards.length === 1;
    const bgColor = hasOne ? "YELLOW" : isPlaying ? "RED" : "WHITE";

    // Build the log string for the player, showing their name, card count, and any card changes
    strLog +=
      getColor(bgColor) +
      player.name +
      " (" +
      player.cards.length +
      " cards)" +
      (previousCardCount < 0
        ? getColor("GREEN") + " +" + -previousCardCount // Display a green positive number if the player drew cards
        : "") +
      "\t";

    // Update the stored card count for this player
    previousCardsCount[player.id] = player.cards.length;
  }

  // Get the last card played on the deck
  const playingCard = uno.deckPlayed[uno.deckPlayed.length - 1];
  strLog +=
    "\n\n\n\t\t\t" +
    getColor("WHITE") +
    "[" +
    uno.cards.length +
    "]\t\t" +
    getPrintCard(playingCard) + // Print the last played card
    (uno.giveCardsNextPlayer > 0 ? " +" + uno.giveCardsNextPlayer : "") + // Show if cards need to be drawn by the next player
    "\n\n\n";

  // Log the human player's hand
  strLog += "[Take]\t";
  const human = uno.players[0];
  for (let i = 0; i < human.cards.length; i++) {
    const card = human.cards[i];

    strLog += getPrintCard(card) + "\t"; // Print each card in the human player's hand
  }

  // Log the index of each card in the human player's hand
  strLog += "\n(-1)\t";
  for (let i = 0; i < human.cards.length; i++) {
    strLog += "(" + i + ")\t";
  }
  strLog += "\n\n";

  console.log(strLog); // Output the final board state log to the console
}

/**
 * Returns a string representation of a card, formatted with color and symbol.
 *
 * @param {Card} card - The card to be printed.
 * @param {string} [appendMessage=""] - Optional message to append after the card representation.
 * @returns {string} - The formatted string representing the card.
 */
function getPrintCard(card, appendMessage = "") {
  const logColor = getColor(card.color ?? "WHITE"); // Get the color code for the card's color
  const digit = getDigit(card); // Get the symbol or number to display for the card

  return logColor + "[" + digit + "]" + appendMessage + getColor("WHITE"); // Return the formatted card string
}

/**
 * Returns a symbol or number representing the card based on its type.
 *
 * @param {Card} card - The card whose symbol is to be determined.
 * @returns {string|number} - The symbol or number representing the card.
 */
function getDigit(card) {
  if (card.type === TYPE.NUMBER) {
    return card.number; // Return the number for numeric cards
  } else if (card.type === TYPE.REVERSE) {
    return "@"; // "@" symbol for reverse cards
  } else if (card.type === TYPE.SKIP) {
    return ">"; // ">" symbol for skip cards
  } else if (card.type === TYPE.SELECT_COLOR) {
    return "+"; // "+" symbol for select color cards
  } else if (card.type === TYPE.T2) {
    return "+2"; // "+2" for draw two cards
  } else if (card.type === TYPE.T4) {
    return "+4"; // "+4" for draw four cards
  }
}

/**
 * Prints a specified number of empty lines for spacing.
 *
 * @param {number} spaces - The number of empty lines to print.
 */
function printSpaces(spaces) {
  for (let i = 0; i < spaces; i++) {
    console.log(" "); // Print an empty line
  }
}

/**
 * Prints a message with the specified color.
 *
 * @param {string} color - The color to use for the message.
 * @param {string} str - The message to print.
 */
function printColor(color, str) {
  console.log(getColor(color) + str); // Print the message with the corresponding color code
}

/**
 * Returns the color code for a given color name.
 *
 * @param {string} color - The name of the color.
 * @returns {string} - The ANSI escape code for the color.
 */
function getColor(color) {
  const colors = {
    RED: "\x1b[31m", // Red color code
    GREEN: "\x1b[32m", // Green color code
    BLUE: "\x1b[34m", // Blue color code
    YELLOW: "\x1b[33m", // Yellow color code
    WHITE: "\x1b[0m", // Default color code (white)
  };

  return colors[color]; // Return the color code for the specified color
}

module.exports = { printBoard, printColor, getColor };
