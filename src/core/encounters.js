/**
 * Encounter system for the Garden Bean game
 */
import { createEnemy, getRandomEnemyTemplate } from './enemies.js';
import { getRandomEventId } from './events.js';

export class EncounterSystem {
  constructor(game) {
    this.game = game;
    this.currentEncounter = null;
  }

  /**
   * Handle player entering a tile
   */
  handleTileEnter(tile) {
    if (tile.type === 'enemy') {
      return this.startEnemyEncounter(tile);
    } else if (tile.type === 'event') {
      return this.startEventEncounter(tile);
    } else if (tile.type === 'harvest') {
      return this.handleHarvestRescue(tile);
    } else if (tile.type === 'shop') {
      return this.startShopEncounter();
    }
    return null;
  }

  /**
   * Start enemy encounter
   */
  startEnemyEncounter(tile) {
    const enemyTemplate = getRandomEnemyTemplate();
    const enemy = createEnemy(enemyTemplate);
    
    this.currentEncounter = {
      type: 'enemy',
      tile,
      enemy
    };

    return {
      type: 'combat',
      enemy
    };
  }

  /**
   * Start event encounter
   */
  startEventEncounter(tile) {
    const eventId = getRandomEventId();
    
    this.currentEncounter = {
      type: 'event',
      tile,
      eventId
    };

    return {
      type: 'event',
      eventId
    };
  }

  /**
   * Handle harvest rescue
   */
  handleHarvestRescue(tile) {
    this.currentEncounter = {
      type: 'harvest',
      tile,
      harvestId: tile.harvestId
    };

    return {
      type: 'harvest',
      harvestId: tile.harvestId
    };
  }

  /**
   * Start shop encounter
   */
  startShopEncounter() {
    this.currentEncounter = {
      type: 'shop'
    };

    return {
      type: 'shop'
    };
  }

  /**
   * Clear current encounter
   */
  clearEncounter() {
    this.currentEncounter = null;
  }
}
