var TYPE = require("./Types");
var COLOR = require("./Colors");
var NUMBER = require("./Numbers");
const { isNumeric } = require("../Utils");

class Card {
  constructor(type, color, number) {
    this.type = type;
    this.color = color;
    this.number = number;
  }

  isSameColor(card) {
    return this.color === card.color;
  }

  isColorCard() {
    return this.color !== undefined;
  }

  isSameNumeric(card) {
    return (
      isNumeric(this.number) &&
      isNumeric(card.number) &&
      this.number === card.number
    );
  }

  isSameSpecialType(card) {
    if (
      this.type === TYPE.REVERSE ||
      this.type === TYPE.SKIP ||
      this.type === TYPE.T2
    ) {
      return this.type === card.type;
    }

    return false;
  }

  isPlayeableWith(card) {
    if (this.type === TYPE.SELECT_COLOR) {
      return true;
    } else if (this.type === TYPE.T4) {
      return true;
    }

    if (this.isSameColor(card)) {
      return true;
    }
    if (this.isSameNumeric(card)) {
      return true;
    }
    if (this.isSameSpecialType(card)) {
      return true;
    }
  }

  isReverse() {
    return this.type === TYPE.REVERSE;
  }

  isSkip() {
    return this.type === TYPE.SKIP;
  }

  isT2() {
    return this.type === TYPE.T2;
  }

  isT4() {
    return this.type === TYPE.T4;
  }
}

module.exports = Card;
