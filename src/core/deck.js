/**
 * Deck system for the Garden Bean game
 */
import { shuffle } from './utils.js';
import { getCard } from './cards.js';

export class Deck {
  constructor(cardIds = []) {
    this.cards = [...cardIds]; // Card IDs
    this.drawPile = [];
    this.hand = [];
    this.discardPile = [];
  }

  /**
   * Initialize deck for combat
   */
  initialize() {
    this.drawPile = shuffle([...this.cards]);
    this.hand = [];
    this.discardPile = [];
  }

  /**
   * Draw cards into hand
   */
  draw(count = 1) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      // Reshuffle discard if draw pile is empty
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) {
          break; // No more cards to draw
        }
        this.drawPile = shuffle([...this.discardPile]);
        this.discardPile = [];
      }

      const cardId = this.drawPile.pop();
      if (cardId) {
        this.hand.push(cardId);
        drawn.push(cardId);
      }
    }
    return drawn;
  }

  /**
   * Play a card from hand
   */
  playCard(cardId) {
    const index = this.hand.indexOf(cardId);
    if (index !== -1) {
      this.hand.splice(index, 1);
      this.discardPile.push(cardId);
      return getCard(cardId);
    }
    return null;
  }

  /**
   * Discard hand
   */
  discardHand() {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }

  /**
   * Get hand (card objects)
   */
  getHand() {
    return this.hand.map(id => ({ ...getCard(id), instanceId: id }));
  }

  /**
   * Add card to deck
   */
  addCard(cardId) {
    this.cards.push(cardId);
  }

  /**
   * Remove card from deck
   */
  removeCard(cardId) {
    const index = this.cards.indexOf(cardId);
    if (index !== -1) {
      this.cards.splice(index, 1);
      return true;
    }
    return false;
  }
}
