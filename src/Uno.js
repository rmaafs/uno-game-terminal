var getCardsArray = require("./cards/Cards");
const Player = require("./Player");
var { randomizeArray } = require("./Utils");
var { printDeck, printColor } = require("./Screen");
const readlineSync = require("readline-sync");

const CARDS_PER_PLAYER = 3;

class Uno {
  constructor(playerSize, rules) {
    this.playerSize = playerSize;
    this.rules = rules;

    this.deckPlayed = [];
    this.players = [];
    this.turnPlayer = -1;
    this.playerPlaying = null;
    this.cards = getCardsArray();
    this.cards = randomizeArray(this.cards);

    for (let i = 0; i < playerSize; i++) {
      const player = new Player(i, null, i === 0);
      for (let j = 0; j < CARDS_PER_PLAYER; j++) {
        player.addCard(this.takeCard());
      }

      this.players.push(player);
    }

    // Put the first card
    this.deckPlayed.push(this.takeCard());

    this.nextStep();
  }

  takeCard() {
    return this.cards.pop();
  }

  nextStep() {
    this.nextCard();
  }

  nextCard() {
    // Get next turn player
    if (++this.turnPlayer >= this.players.length) {
      this.turnPlayer = 0;
    }
    this.playerPlaying = this.players[this.turnPlayer];

    printDeck(this);

    if (this.playerPlaying.isHuman) {
      while (true) {
        // Ask
        const index = readlineSync.question("Choose your next number: ");
        if (this.humanMovement(index) === true) {
          break;
        }
      }
    } else {
      const cardToPlay = this.playerPlaying.simulateMovement(this);
      this.playerMovement(cardToPlay);
    }

    this.nextStep();
  }

  humanMovement(cardIndex) {
    const playerCard = this.playerPlaying.cards[cardIndex];
    return this.playerMovement(playerCard);
  }

  playerMovement(playerCard) {
    const deckCard = this.getActualDeckCard();

    // Invalid card? Take a new acrd
    if (playerCard === undefined) {
      this.playerPlaying.addCard(this.takeCard());
      return true;
    }

    // If is a color card
    if (!playerCard.isPlayeableWith(deckCard)) {
      return printColor("red", "Please choose a valid color card.");
    }

    // Valid card
    this.deckPlayed.push(playerCard);
    this.playerPlaying.removeCard(playerCard);

    if (this.playerPlaying.cards.length === 0) {
      console.log(this.playerPlaying.name + " wins!");
      process.exit(0);
    }

    return true;
  }

  getActualDeckCard() {
    return this.deckPlayed[this.deckPlayed.length - 1];
  }
}

module.exports = Uno;
