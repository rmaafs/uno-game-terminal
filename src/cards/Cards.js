var TYPE = require("./Types");
var COLOR = require("./Colors");
var NUMBER = require("./Numbers");
var Card = require("./Card");

function getCardsArray() {
  let cards = [];
  let colors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW];

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    for (let j = 0; j < NUMBER.length; j++) {
      const number = NUMBER[j];
      for (let k = 0; k < 2; k++) {
        cards.push(new Card(TYPE.NUMBER, color, number));
        if (number === 0) {
          // Only one "0" card per color
          break;
        }
      }
    }

    // Reverse per color
    cards.push(new Card(TYPE.REVERSE, color, null));
    cards.push(new Card(TYPE.REVERSE, color, null));
    // Next per color
    cards.push(new Card(TYPE.SKIP, color, null));
    cards.push(new Card(TYPE.SKIP, color, null));
    // // +2 per color
    // cards.push(new Card(TYPE.T2, color, null));
    // cards.push(new Card(TYPE.T2, color, null));

    // // Special cards
    // cards.push(new Card(TYPE.T4, null, null));
    // cards.push(new Card(TYPE.SELECT_COLOR, null, null));
  }

  return cards;
}
module.exports = getCardsArray;
