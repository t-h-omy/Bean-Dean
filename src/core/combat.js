/**
 * Combat system for the Garden Bean game
 */
import { Deck } from './deck.js';
import { executeEnemyTurn } from './enemies.js';

export class Combat {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.deck = new Deck(player.deck);
    this.energy = 3;
    this.maxEnergy = 3;
    this.turnCount = 0;
    this.isPlayerTurn = true;
    this.combatLog = [];
    this.isOver = false;
    this.playerWon = false;
  }

  /**
   * Start combat
   */
  start() {
    this.deck.initialize();
    this.deck.draw(5);
    this.energy = this.maxEnergy;
    this.player.resetBlock();
    this.turnCount = 1;
    this.addLog('Combat started!');
  }

  /**
   * Play a card
   */
  playCard(cardId) {
    if (!this.isPlayerTurn || this.isOver) {
      return { success: false, message: 'Cannot play card now' };
    }

    const card = this.deck.playCard(cardId);
    if (!card) {
      return { success: false, message: 'Card not in hand' };
    }

    if (card.cost > this.energy) {
      // Return card to hand
      this.deck.hand.push(cardId);
      return { success: false, message: 'Not enough energy' };
    }

    // Spend energy
    this.energy -= card.cost;

    // Execute card effect
    const result = card.effect(this.player, this.enemy);
    this.addLog(`Played ${card.name}: ${card.description}`);

    // Check if enemy is defeated
    if (this.enemy.hp <= 0) {
      this.endCombat(true);
    }

    return { success: true, result };
  }

  /**
   * End player turn
   */
  endTurn() {
    if (!this.isPlayerTurn || this.isOver) return;

    this.isPlayerTurn = false;
    this.addLog('Player turn ended');

    // Discard hand
    this.deck.discardHand();

    // Enemy turn
    this.executeEnemyTurn();

    // Start new turn
    this.startNewTurn();
  }

  /**
   * Execute enemy turn
   */
  executeEnemyTurn() {
    const action = executeEnemyTurn(this.enemy, this.player);

    if (action.action === 'attack') {
      const totalDamage = action.damage;
      for (let i = 0; i < action.hits; i++) {
        const damagePerHit = Math.floor(totalDamage / action.hits);
        const actualDamage = this.player.takeDamage(damagePerHit);
        this.addLog(`${this.enemy.name} attacks for ${damagePerHit} damage (${actualDamage} taken)`);
      }

      // Check if player is defeated
      if (!this.player.isAlive()) {
        this.endCombat(false);
      }
    }
  }

  /**
   * Start new turn
   */
  startNewTurn() {
    if (this.isOver) return;

    this.turnCount++;
    this.player.resetBlock();
    this.energy = this.maxEnergy;
    this.deck.draw(5);
    this.isPlayerTurn = true;
    this.addLog(`--- Turn ${this.turnCount} ---`);
  }

  /**
   * End combat
   */
  endCombat(playerWon) {
    this.isOver = true;
    this.playerWon = playerWon;
    this.addLog(playerWon ? 'Victory!' : 'Defeat!');
  }

  /**
   * Add to combat log
   */
  addLog(message) {
    this.combatLog.push(message);
  }

  /**
   * Get current hand
   */
  getHand() {
    return this.deck.getHand();
  }

  /**
   * Get combat state
   */
  getState() {
    return {
      player: {
        hp: this.player.hp,
        maxHP: this.player.maxHP,
        block: this.player.block
      },
      enemy: {
        hp: this.enemy.hp,
        maxHP: this.enemy.maxHP,
        name: this.enemy.name,
        intent: this.enemy.intent,
        attackValue: this.enemy.attackValue
      },
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      hand: this.getHand(),
      turnCount: this.turnCount,
      isPlayerTurn: this.isPlayerTurn,
      isOver: this.isOver,
      playerWon: this.playerWon
    };
  }
}
