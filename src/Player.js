var { removeElementAtIndex, removeElement } = require("./Utils");

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

      if (card.isPlayeableWith(deckCard)) {
        return card;
      }
    }

    return undefined;
  }
}

module.exports = Player;
