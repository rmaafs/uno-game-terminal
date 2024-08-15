const logger = require("node-color-log");
const TYPE = require("./cards/Types");

const previousCardsCount = {};

function printDeck(uno) {
  //   printSpaces(5);
  //   printWall();
  //   const playerPlaying = uno.playerPlaying;
  //   printPlayerDeck(playerPlaying);

  //   const playingCard = uno.deckPlayed[uno.deckPlayed.length - 1];
  //   printWall();
  //   console.log(getPrintCard(playingCard));

  //   printNextPlayers(uno.players);

  //   printWall();

  printBoard(uno);
}

function printBoard(uno) {
  printSpaces(20);

  let strLog = "";
  // Print other players
  for (let i = uno.players.length - 1; i >= 1; i--) {
    const player = uno.players[i];
    const playerPlaying = uno.playerPlaying;
    const isPlaying = playerPlaying.id === player.id;

    previousCardCount = previousCardsCount[player.id] - player.cards.length;

    const hasOne = player.cards.length === 1;
    const bgColor = hasOne ? "YELLOW" : isPlaying ? "RED" : "WHITE";

    strLog +=
      getColor(bgColor) +
      player.name +
      " (" +
      player.cards.length +
      " cards)" +
      (previousCardCount < 0
        ? getColor("GREEN") + " +" + -previousCardCount
        : "") +
      "\t";

    previousCardsCount[player.id] = player.cards.length;
  }

  // Print deck cards
  const playingCard = uno.deckPlayed[uno.deckPlayed.length - 1];
  strLog +=
    "\n\n\n\t\t\t" +
    getColor("WHITE") +
    "[" +
    uno.cards.length +
    "]\t\t" +
    getPrintCard(playingCard) +
    (uno.giveCardsNextPlayer > 0 ? " +" + uno.giveCardsNextPlayer : "") +
    "\n\n\n";

  // Print human cards
  strLog += "[Take]\t";
  const human = uno.players[0];
  for (let i = 0; i < human.cards.length; i++) {
    const card = human.cards[i];

    strLog += getPrintCard(card) + "\t";
  }

  strLog += "\n(-1)\t";
  for (let i = 0; i < human.cards.length; i++) {
    strLog += "(" + i + ")\t";
  }
  strLog += "\n\n";

  console.log(strLog);
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
  } else if (card.type === TYPE.SKIP) {
    return ">";
  } else if (card.type === TYPE.SELECT_COLOR) {
    return "+";
  } else if (card.type === TYPE.T2) {
    return "+2";
  } else if (card.type === TYPE.T4) {
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

module.exports = { printDeck, printColor, getColor };
