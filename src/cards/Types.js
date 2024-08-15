/**
 * Defines the possible types of cards in the game.
 * This object standardizes the different card types, ensuring consistent use across the application.
 */
const TYPE = {
  NUMBER: "NUMBER", // Represents a numeric card (0-9)
  REVERSE: "REVERSE", // Represents a reverse card, which changes the direction of play
  SKIP: "SKIP", // Represents a skip card, which causes the next player to lose their turn
  SELECT_COLOR: "SELECT_COLOR", // Represents a "Select Color" card, allowing the player to choose the next color
  T2: "T2", // Represents a +2 card, which forces the next player to draw two cards
  T4: "T4", // Represents a +4 card, which forces the next player to draw four cards and allows the player to choose the next color
};

module.exports = TYPE;
