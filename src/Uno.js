var getCardsArray = require("./cards/Cards");
const Player = require("./Player");
const RULE = require("./Rules");
var { randomizeArray, sleep } = require("./Utils");
var { printDeck, printColor, getColor } = require("./Screen");
const readlineSync = require("readline-sync");
const COLOR = require("./cards/Colors");

const CARDS_PER_PLAYER = 7;

class Uno {
  constructor(playerSize, rules) {
    this.playerSize = playerSize;
    this.rules = rules;

    this.goRight = true;
    this.skipNextPlayer = false;
    this.giveCardsNextPlayer = 0;

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
    this.deckPlayed.push(this.takeCard(true));

    this.nextStep();
  }

  takeCard(isFirstCard = false) {
    if (isFirstCard) {
      while (true) {
        const card = this.cards.pop();
        if (card.isNumeric()) return card;
      }
    }
    return this.cards.pop();
  }

  nextStep() {
    this.nextCard();
  }

  nextCard() {
    if (this.playerPlaying && this.playerPlaying.cards.length === 0) {
      printDeck(this);
      console.log(this.playerPlaying.name + " wins!");
      process.exit(0);
    }

    // Get next turn player
    while (true) {
      if (this.goRight) {
        if (++this.turnPlayer >= this.players.length) {
          this.turnPlayer = 0;
        }
      } else {
        if (--this.turnPlayer < 0) {
          this.turnPlayer = this.players.length - 1;
        }
      }

      // We need to skip the next player?
      if (this.skipNextPlayer === true) {
        this.skipNextPlayer = false;
        continue;
      }
      break;
    }

    this.playerPlaying = this.players[this.turnPlayer];

    printDeck(this);

    if (this.giveCardsNextPlayer > 0) {
      if (
        this.hasRule(RULE.ACUMULATE_TAKE_CARDS) &&
        this.playerPlaying.hasT2orT4()
      ) {
        // Continue
      } else {
        while (--this.giveCardsNextPlayer >= 0) {
          this.playerPlaying.addCard(this.takeCard());
        }
        this.giveCardsNextPlayer = 0;

        return this.nextStep();
      }
    }

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

    if (!this.playerPlaying.isHuman) {
      sleep(2000);
    }

    // Invalid card? Take a new acrd
    if (playerCard === undefined) {
      this.playerPlaying.addCard(this.takeCard());
      return true;
    }

    // If is a color card
    if (!playerCard.isPlayeableWith(deckCard, this.giveCardsNextPlayer)) {
      return printColor("red", "Please choose a valid color card.");
    }

    if (playerCard.isReverse()) {
      this.goRight = !this.goRight;
    } else if (playerCard.isSkip()) {
      this.skipNextPlayer = true;
    } else if (playerCard.isT2()) {
      this.giveCardsNextPlayer += 2;
    } else if (playerCard.isSelectColor() || playerCard.isT4()) {
      if (playerCard.isT4()) {
        this.giveCardsNextPlayer += 4;
      }
      if (this.playerPlaying.isHuman) {
        while (true) {
          // Ask
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
            playerCard.color = colorSelected;
            break;
          }
        }
      } else {
        playerCard.color = this.playerPlaying.selectRandomColor(deckCard.color);
      }
    }

    // Valid card
    this.deckPlayed.push(playerCard);
    this.playerPlaying.removeCard(playerCard);

    return true;
  }

  getActualDeckCard() {
    return this.deckPlayed[this.deckPlayed.length - 1];
  }

  hasRule(rule) {
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i] === rule) {
        return true;
      }
    }

    return false;
  }
}

module.exports = Uno;
