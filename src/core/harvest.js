/**
 * Harvest system for the Garden Bean game
 */
import { randomInt, generateId } from './utils.js';

export class HarvestSystem {
  constructor() {
    this.harvests = new Map();
  }

  /**
   * Create a new harvest field
   */
  createHarvest(id) {
    const maxHP = randomInt(20, 100);
    const harvest = {
      id: id || generateId(),
      hp: maxHP,
      maxHP: maxHP,
      threatened: true,
      destroyed: false
    };
    this.harvests.set(harvest.id, harvest);
    return harvest;
  }

  /**
   * Get harvest by ID
   */
  getHarvest(id) {
    return this.harvests.get(id);
  }

  /**
   * Update all harvests (called each tick)
   */
  update() {
    this.harvests.forEach(harvest => {
      if (harvest.threatened && !harvest.destroyed) {
        harvest.hp -= 1;
        if (harvest.hp <= 0) {
          harvest.hp = 0;
          harvest.destroyed = true;
        }
      }
    });
  }

  /**
   * Rescue a harvest (when player steps on it)
   */
  rescueHarvest(id) {
    const harvest = this.harvests.get(id);
    if (harvest && !harvest.destroyed) {
      harvest.threatened = false;
      // Calculate reward based on remaining HP
      const hpPercentage = harvest.hp / harvest.maxHP;
      const baseReward = 10;
      const reward = Math.floor(baseReward * (0.5 + hpPercentage * 0.5));
      return {
        xp: reward,
        rescued: true
      };
    }
    return {
      xp: 0,
      rescued: false
    };
  }

  /**
   * Remove harvest
   */
  removeHarvest(id) {
    this.harvests.delete(id);
  }

  /**
   * Get all harvests
   */
  getAllHarvests() {
    return Array.from(this.harvests.values());
  }
}
