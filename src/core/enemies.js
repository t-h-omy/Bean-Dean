/**
 * Enemy definitions for the Garden Bean game
 */
import { generateId } from './utils.js';

/**
 * Enemy templates
 */
export const ENEMY_TEMPLATES = {
  slug: {
    name: 'Garden Slug',
    maxHP: 20,
    intent: 'attack',
    attackValue: 5,
    description: 'A slow but persistent pest'
  },

  mosquito: {
    name: 'Blood Mosquito',
    maxHP: 15,
    intent: 'attack',
    attackValue: 3,
    multiHit: 2, // Attacks twice
    description: 'Quick and annoying'
  },

  angryCarrot: {
    name: 'Angry Carrot',
    maxHP: 30,
    intent: 'attack',
    attackValue: 7,
    description: 'A vegetable with a grudge'
  }
};

/**
 * Create enemy instance from template
 */
export function createEnemy(templateName) {
  const template = ENEMY_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Unknown enemy template: ${templateName}`);
  }

  return {
    id: generateId(),
    template: templateName,
    name: template.name,
    maxHP: template.maxHP,
    hp: template.maxHP,
    intent: template.intent,
    attackValue: template.attackValue,
    multiHit: template.multiHit || 1,
    description: template.description
  };
}

/**
 * Get random enemy template name
 */
export function getRandomEnemyTemplate() {
  const templates = Object.keys(ENEMY_TEMPLATES);
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Enemy AI - execute enemy turn
 */
export function executeEnemyTurn(enemy, player) {
  if (enemy.intent === 'attack') {
    const totalDamage = enemy.attackValue * enemy.multiHit;
    return {
      action: 'attack',
      damage: totalDamage,
      hits: enemy.multiHit
    };
  }
  return { action: 'none' };
}
