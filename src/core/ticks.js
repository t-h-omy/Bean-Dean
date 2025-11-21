/**
 * Garden tick system
 * Manages game time progression
 */
import { randomInt } from './utils.js';

export class TickSystem {
  constructor() {
    this.currentTick = 0;
    this.listeners = [];
  }

  /**
   * Add a tick listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Advance time by a number of ticks
   */
  advance(ticks) {
    for (let i = 0; i < ticks; i++) {
      this.currentTick++;
      this.listeners.forEach(listener => listener(this.currentTick));
    }
  }

  /**
   * Get movement cost (2-10 ticks random)
   */
  getMovementCost() {
    return randomInt(2, 10);
  }

  /**
   * Get combat cost (5 ticks)
   */
  getCombatCost() {
    return 5;
  }

  /**
   * Get current tick
   */
  getCurrentTick() {
    return this.currentTick;
  }
}
