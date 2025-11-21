/**
 * Grid system for the Garden Bean game
 */
import { randomInt, generateId } from './utils.js';

export class Grid {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.initialize();
  }

  /**
   * Initialize the grid with empty tiles
   */
  initialize() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push({
          x,
          y,
          type: 'empty'
        });
      }
    }
  }

  /**
   * Get tile at position
   */
  getTile(x, y) {
    return this.tiles.find(t => t.x === x && t.y === y);
  }

  /**
   * Set tile type and data
   */
  setTile(x, y, type, data = {}) {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.type = type;
      Object.assign(tile, data);
    }
  }

  /**
   * Get random empty tile
   */
  getRandomEmptyTile() {
    const emptyTiles = this.tiles.filter(t => t.type === 'empty');
    if (emptyTiles.length === 0) return null;
    return emptyTiles[randomInt(0, emptyTiles.length - 1)];
  }

  /**
   * Populate grid with harvest fields, enemies, events, and shop
   */
  populate() {
    // Add 3-5 harvest fields
    const harvestCount = randomInt(3, 5);
    for (let i = 0; i < harvestCount; i++) {
      const tile = this.getRandomEmptyTile();
      if (tile) {
        const harvestId = generateId();
        this.setTile(tile.x, tile.y, 'harvest', { harvestId });
      }
    }

    // Add 3-8 enemy fields
    const enemyCount = randomInt(3, 8);
    for (let i = 0; i < enemyCount; i++) {
      const tile = this.getRandomEmptyTile();
      if (tile) {
        const enemyId = generateId();
        this.setTile(tile.x, tile.y, 'enemy', { enemyId });
      }
    }

    // Add 1-2 event fields
    const eventCount = randomInt(1, 2);
    for (let i = 0; i < eventCount; i++) {
      const tile = this.getRandomEmptyTile();
      if (tile) {
        const eventId = generateId();
        this.setTile(tile.x, tile.y, 'event', { eventId });
      }
    }

    // Add 1 shop
    const shopTile = this.getRandomEmptyTile();
    if (shopTile) {
      this.setTile(shopTile.x, shopTile.y, 'shop');
    }
  }

  /**
   * Check if position is valid
   */
  isValidPosition(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
