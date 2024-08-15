var getCardsArray = require("./cards/Cards");
const Player = require("./Player");
const RULE = require("./Rules");
var { randomizeArray, sleep } = require("./Utils");
var { printBoard, printColor, getColor } = require("./Screen");
const readlineSync = require("readline-sync");
const COLOR = require("./cards/Colors");

// Number of cards each player receives at the start of the game
const CARDS_PER_PLAYER = 7;

class Uno {
  /**
   * Constructs a new Uno game instance.
   *
   * @param {number} playerSize - The number of players in the game.
   * @param {Array} rules - Array of rules that apply to the game.
   */
  constructor(playerSize, rules) {
    this.playerSize = playerSize;
    this.rules = rules;

    this.goRight = true; // Determines the direction of play (true = clockwise, false = counter-clockwise)
    this.skipNextPlayer = false; // Determines if the next player should be skipped
    this.giveCardsNextPlayer = 0; // Number of cards the next player must draw

    this.deckPlayed = []; // Array of cards that have been played
    this.players = []; // Array of players in the game
    this.turnPlayer = -1; // Index of the current player
    this.playerPlaying = null; // The player currently taking their turn
    this.cards = getCardsArray(); // Get the deck of cards
    this.cards = randomizeArray(this.cards); // Shuffle the deck of cards

    // Initialize players and deal cards
    for (let i = 0; i < playerSize; i++) {
      const player = new Player(i, null, i === 0); // Create a new player, marking the first one as human
      for (let j = 0; j < CARDS_PER_PLAYER; j++) {
        player.addCard(this.takeCard());
      }
      this.players.push(player);
    }

    // Place the first card on the play pile
    this.deckPlayed.push(this.takeCard(true));

    // Start the game loop
    this.nextStep();
  }

  /**
   * Draws a card from the deck.
   *
   * @param {boolean} isFirstCard - Whether this is the first card being drawn to start the game.
   * @returns {Object} - The card drawn from the deck.
   */
  takeCard(isFirstCard = false) {
    if (isFirstCard) {
      while (true) {
        const card = this.cards.pop();
        if (card.isNumeric()) return card; // Ensure the first card is numeric
      }
    }
    return this.cards.pop(); // Return the last card from the deck
  }

  /**
   * Advances the game to the next step (turn).
   */
  nextStep() {
    this.nextCard(); // Move to the next card action
  }

  /**
   * Determines the next player's turn and handles their move.
   */
  nextCard() {
    // Check if the current player has won
    if (this.playerPlaying && this.playerPlaying.cards.length === 0) {
      printBoard(this); // Display the board
      console.log(this.playerPlaying.name + " wins!"); // Announce the winner
      process.exit(0); // Exit the game
    }

    // Find the next player to take a turn
    while (true) {
      if (this.goRight) {
        if (++this.turnPlayer >= this.players.length) {
          this.turnPlayer = 0; // Loop back to the first player if we exceed the player count
        }
      } else {
        if (--this.turnPlayer < 0) {
          this.turnPlayer = this.players.length - 1; // Loop back to the last player if we go below zero
        }
      }

      // Skip the next player if needed
      if (this.skipNextPlayer === true) {
        this.skipNextPlayer = false;
        continue;
      }
      break;
    }

    this.playerPlaying = this.players[this.turnPlayer]; // Set the current player taking the turn

    printBoard(this); // Display the board

    // If the current player needs to draw cards due to a +2 or +4
    if (this.giveCardsNextPlayer > 0) {
      if (
        this.hasRule(RULE.ACUMULATE_TAKE_CARDS) &&
        this.playerPlaying.hasT2orT4()
      ) {
        // If accumulation rule is on and the player has +2 or +4, they can pass it on
      } else {
        // Otherwise, they must draw the required number of cards
        while (--this.giveCardsNextPlayer >= 0) {
          this.playerPlaying.addCard(this.takeCard());
        }
        this.giveCardsNextPlayer = 0;

        return this.nextStep(); // Move to the next step after drawing cards
      }
    }

    // Human player's turn
    if (this.playerPlaying.isHuman) {
      while (true) {
        // Ask the human player to choose a card
        const index = readlineSync.question("Choose your next number: ");
        if (this.humanMovement(index) === true) {
          break;
        }
      }
    } else {
      // AI player's turn
      const cardToPlay = this.playerPlaying.simulateMovement(this); // AI decides which card to play
      this.playerMovement(cardToPlay);
    }

    this.nextStep(); // Continue to the next step
  }

  /**
   * Handles the movement for a human player based on their card choice.
   *
   * @param {number} cardIndex - The index of the card chosen by the human player.
   * @returns {boolean} - Whether the move was successful.
   */
  humanMovement(cardIndex) {
    const playerCard = this.playerPlaying.cards[cardIndex];
    return this.playerMovement(playerCard);
  }

  /**
   * Executes the movement of a card for a player.
   *
   * @param {Object} playerCard - The card the player has chosen to play.
   * @returns {boolean} - Whether the movement was successful.
   */
  playerMovement(playerCard) {
    const deckCard = this.getActualDeckCard(); // Get the current card on the deck

    if (!this.playerPlaying.isHuman) {
      sleep(2000); // Simulate thinking time for AI players
    }

    // If the player didn't select a card, they must draw a new one
    if (playerCard === undefined) {
      this.playerPlaying.addCard(this.takeCard());
      return true;
    }

    // Validate the card against the current deck card
    if (!playerCard.isPlayeableWith(deckCard, this.giveCardsNextPlayer)) {
      return printColor("RED", "Please choose a valid color card.");
    }

    // Handle special card actions
    if (playerCard.isReverse()) {
      this.goRight = !this.goRight; // Reverse the direction of play
    } else if (playerCard.isSkip()) {
      this.skipNextPlayer = true; // Skip the next player's turn
    } else if (playerCard.isT2()) {
      this.giveCardsNextPlayer += 2; // Force the next player to draw 2 cards
    } else if (playerCard.isSelectColor() || playerCard.isT4()) {
      if (playerCard.isT4()) {
        this.giveCardsNextPlayer += 4; // Force the next player to draw 4 cards
      }
      if (this.playerPlaying.isHuman) {
        // Ask the human player to choose a color
        while (true) {
          const index = readlineSync.question(
            "Choose your next color " +
              getColor("RED") +
              "(1) " +
              getColor("GREEN") +
              "(2) " +
              getColor("BLUE") +
              "(3) " +
              getColor("YELLOW") +
              "(4)" +
              getColor("WHITE") +
              ": "
          );
          if (
            index === "1" ||
            index === "2" ||
            index === "3" ||
            index === "4"
          ) {
            const colors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW];
            const colorSelected = colors[Number(index) - 1];
            playerCard.color = colorSelected; // Set the chosen color
            break;
          }
        }
      } else {
        // AI selects a random color
        playerCard.color = this.playerPlaying.selectRandomColor(deckCard.color);
      }
    }

    // Valid card played
    this.deckPlayed.push(playerCard); // Add the card to the play pile
    this.playerPlaying.removeCard(playerCard); // Remove the card from the player's hand

    return true;
  }

  /**
   * Gets the last card played on the deck.
   *
   * @returns {Object} - The card on the top of the play pile.
   */
  getActualDeckCard() {
    return this.deckPlayed[this.deckPlayed.length - 1];
  }

  /**
   * Checks if a specific rule is active in the game.
   *
   * @param {number} rule - The rule to check.
   * @returns {boolean} - Whether the rule is active.
   */
  hasRule(rule) {
    return this.rules.includes(rule); // Return true if the rule is present in the rules array
  }
}

module.exports = Uno;
