/**
 * Card definitions for the Garden Bean game
 */
import { TalentSystem } from './talents.js';

/**
 * Base card effect functions
 */

export const CardEffects = {
  /**
   * Deal damage to enemy
   */
  attack(player, enemy, amount) {
    enemy.hp -= amount;
    return { type: 'damage', value: amount, target: 'enemy' };
  },

  /**
   * Gain block
   */
  block(player, enemy, amount) {
    player.addBlock(amount);
    return { type: 'block', value: amount, target: 'player' };
  },

  /**
   * Heal player
   */
  heal(player, enemy, amount) {
    player.heal(amount);
    return { type: 'heal', value: amount, target: 'player' };
  }
};

/**
 * Card definitions
 */
export const CARDS = {
  strike: {
    id: 'strike',
    name: 'Strike',
    type: 'attack',
    cost: 1,
    description: 'Deal 6 damage',
    effect: (player, enemy) => CardEffects.attack(player, enemy, 6)
  },

  defend: {
    id: 'defend',
    name: 'Defend',
    type: 'skill',
    cost: 1,
    description: 'Gain 5 block',
    effect: (player, enemy) => CardEffects.block(player, enemy, 5)
  },

  heavyStrike: {
    id: 'heavyStrike',
    name: 'Heavy Strike',
    type: 'attack',
    cost: 2,
    description: 'Deal 12 damage',
    effect: (player, enemy) => CardEffects.attack(player, enemy, 12)
  },

  caffeineBoost: {
    id: 'caffeineBoost',
    name: 'Caffeine Boost',
    type: 'skill',
    cost: 1,
    description: 'Gain 3 block and heal 3 HP',
    effect: (player, enemy) => {
      player.addBlock(3);
      player.heal(3);
      return { type: 'utility', value: 3, target: 'player' };
    }
  },

  roastedBean: {
    id: 'roastedBean',
    name: 'Roasted Bean',
    type: 'attack',
    cost: 1,
    description: 'Deal 6 damage. Roast Mastery: Deal 2 extra damage',
    talentCheck: {
      talent: 'roastMastery',
      onSuccess: (player, enemy) => CardEffects.attack(player, enemy, 8),
      onFail: (player, enemy) => CardEffects.attack(player, enemy, 6)
    },
    effect: (player, enemy) => {
      if (!player) return CardEffects.attack(player, enemy, 6);
      return TalentSystem.executeTalentCheck(
        player,
        'roastMastery',
        () => CardEffects.attack(player, enemy, 8),
        () => CardEffects.attack(player, enemy, 6)
      );
    }
  },

  aromaBurst: {
    id: 'aromaBurst',
    name: 'Aroma Burst',
    type: 'skill',
    cost: 2,
    description: 'Gain 8 block. Aroma Control: Gain 3 extra block',
    talentCheck: {
      talent: 'aromaControl',
      onSuccess: (player, enemy) => CardEffects.block(player, enemy, 11),
      onFail: (player, enemy) => CardEffects.block(player, enemy, 8)
    },
    effect: (player, enemy) => {
      if (!player) return CardEffects.block(player, enemy, 8);
      return TalentSystem.executeTalentCheck(
        player,
        'aromaControl',
        () => CardEffects.block(player, enemy, 11),
        () => CardEffects.block(player, enemy, 8)
      );
    }
  }
};

/**
 * Get starter deck
 */
export function getStarterDeck() {
  return [
    'strike',
    'strike',
    'strike',
    'defend',
    'defend',
    'caffeineBoost',
    'roastedBean',
    'heavyStrike'
  ];
}

/**
 * Get card by ID
 */
export function getCard(cardId) {
  return CARDS[cardId];
}
