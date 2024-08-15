var {
  removeElementAtIndex,
  removeElement,
  randomizeArray,
} = require("./Utils");
const COLOR = require("./cards/Colors");

class Player {
  constructor(id, name, isHuman) {
    this.id = id;
    this.name = name ?? "Player " + this.id;
    this.isHuman = isHuman;
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(card) {
    this.cards = removeElement(this.cards, card);
  }

  removeCardIndex(cardIndex) {
    this.cards = removeElementAtIndex(this.cards, cardIndex);
  }

  simulateMovement(uno) {
    const deckCard = uno.getActualDeckCard();

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.isPlayeableWith(deckCard, uno.giveCardsNextPlayer)) {
        return card;
      }
    }

    return undefined;
  }

  hasT2orT4() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.isT2() || card.isT4()) {
        return true;
      }
    }
    return false;
  }

  selectRandomColor(currentColor) {
    let colors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW];
    colors = removeElement(colors, currentColor);
    return randomizeArray(colors)[0];
  }
}

module.exports = Player;
