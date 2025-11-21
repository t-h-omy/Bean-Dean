/**
 * Event system for the Garden Bean game
 */
import { TalentSystem } from './talents.js';
import { generateId } from './utils.js';

/**
 * Event definitions
 */
export const EVENTS = {
  compostHeap: {
    id: 'compostHeap',
    name: 'Mysterious Compost Heap',
    description: 'You find a strange, glowing compost heap. It smells... interesting.',
    type: 'talentCheck',
    talentCheck: {
      talent: 'beanIntuition',
      success: {
        description: 'Your intuition guides you to the good parts!',
        reward: { xp: 15 }
      },
      fail: {
        description: 'You dig in the wrong spot and get stung!',
        penalty: { damage: 5 }
      }
    }
  },

  gardenGnome: {
    id: 'gardenGnome',
    name: 'Garden Gnome',
    description: 'A mysterious gnome offers you a choice of gifts.',
    type: 'choice',
    choices: [
      {
        id: 'heal',
        description: 'Take the healing herbs',
        reward: { heal: 10 }
      },
      {
        id: 'xp',
        description: 'Take the ancient seed knowledge',
        reward: { xp: 10 }
      }
    ]
  }
};

/**
 * Get event by ID
 */
export function getEvent(eventId) {
  return EVENTS[eventId];
}

/**
 * Get random event ID
 */
export function getRandomEventId() {
  const eventIds = Object.keys(EVENTS);
  return eventIds[Math.floor(Math.random() * eventIds.length)];
}

/**
 * Execute event
 */
export function executeEvent(eventId, player, choiceId = null) {
  const event = EVENTS[eventId];
  if (!event) return null;

  if (event.type === 'talentCheck') {
    const success = TalentSystem.checkTalent(player, event.talentCheck.talent);
    if (success) {
      return {
        success: true,
        description: event.talentCheck.success.description,
        reward: event.talentCheck.success.reward
      };
    } else {
      return {
        success: false,
        description: event.talentCheck.fail.description,
        penalty: event.talentCheck.fail.penalty
      };
    }
  } else if (event.type === 'choice') {
    if (choiceId !== null) {
      const choice = event.choices.find(c => c.id === choiceId);
      if (choice) {
        return {
          success: true,
          description: choice.description,
          reward: choice.reward
        };
      }
    }
    // Return choices for UI to display
    return {
      needsChoice: true,
      choices: event.choices
    };
  }

  return null;
}
