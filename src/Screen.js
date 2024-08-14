const logger = require("node-color-log");
const TYPE = require("./cards/Types");

function printDeck(uno) {
  printSpaces(5);
  printWall();
  const playerPlaying = uno.playerPlaying;
  printPlayerDeck(playerPlaying);

  const playingCard = uno.deckPlayed[uno.deckPlayed.length - 1];
  printWall();
  console.log(getPrintCard(playingCard));

  printNextPlayers(uno.players);

  printWall();
}

function getPrintCard(card, appendMessage = "") {
  const logColor = getColor(card.color ?? "WHITE");
  const digit = getDigit(card);

  return logColor + "[" + digit + "]" + appendMessage + getColor("WHITE");
}

function printNextPlayers(players) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    let strCard = "";
    for (let j = 0; j < player.cards.length; j++) {
      const card = player.cards[j];
      strCard += getPrintCard(card);
    }

    console.log(player.name + " " + player.cards.length + " cards. " + strCard);
  }
}

// function printCards(cards) {
//   let finalPrint = "";
//   for (let i = 0; i < cards.length; i++) {
//     const card = cards[i];
//     const loggerColor = logger.color(
//       card.color ? card.color.toLowerCase() : "white"
//     );
//     const digit = getDigit(card);

//     finalPrint += loggerColor.log(digit).reset();
//   }

//   console.log(finalPrint);
// }

function printPlayerDeck(player) {
  const cards = player.cards;

  console.log(player.name);

  console.log(getColor("WHITE") + "Take \t(-1)");
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(getPrintCard(card, "\t(" + i + ")"));
  }
}

function getDigit(card) {
  if (card.type === TYPE.NUMBER) {
    return card.number;
  } else if (card.type === TYPE.REVERSE) {
    return "@";
  } else if (card.type === TYPE.NEXT) {
    return ">";
  } else if (card.type === TYPE.SELECT_COLOR) {
    return "+";
  } else if (card.type === TYPE.T2) {
    return "+2";
  } else if (card.type === TYPE.T$) {
    return "+4";
  }
}

function printWall() {
  logger.color("cyan").log("=============================");
}

function printSpaces(spaces) {
  for (let i = 0; i < spaces; i++) {
    console.log(" ");
  }
}

function printColor(color, str) {
  logger.color(color).log(str);
}

function getColor(color) {
  const colors = {
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    BLUE: "\x1b[34m",
    YELLOW: "\x1b[33m",
    WHITE: "\x1b[0m",
  };
  //RESET "\x1b[0m"
  return colors[color];
}

module.exports = { printDeck, printColor };
