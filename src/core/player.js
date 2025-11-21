/**
 * Player system for the Garden Bean game
 */

export class Player {
  constructor(startX = 5, startY = 5) {
    this.x = startX;
    this.y = startY;
    this.maxHP = 50;
    this.hp = 50;
    this.xp = 0;
    this.level = 1;
    this.talentPoints = 0;
    this.talents = {
      roastMastery: 0,
      aromaControl: 0,
      beanIntuition: 0,
      soilSense: 0,
      caffeineSurge: 0,
      beanResistance: 0
    };
    this.deck = [];
    this.block = 0; // Current block value
  }

  /**
   * Move player in a direction
   */
  move(direction) {
    const moves = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    };

    const move = moves[direction];
    if (move) {
      return {
        x: this.x + move.dx,
        y: this.y + move.dy
      };
    }
    return { x: this.x, y: this.y };
  }

  /**
   * Set player position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Gain experience points
   */
  gainXP(amount) {
    this.xp += amount;
    const xpNeeded = this.getXPForNextLevel();
    if (this.xp >= xpNeeded) {
      this.levelUp();
    }
  }

  /**
   * Calculate XP needed for next level
   */
  getXPForNextLevel() {
    return this.level * 10;
  }

  /**
   * Level up the player
   */
  levelUp() {
    this.level++;
    this.talentPoints++;
    this.maxHP += 5;
    this.hp = this.maxHP; // Full heal on level up
    this.xp = 0; // Reset XP for next level
  }

  /**
   * Spend a talent point on a talent
   */
  spendTalentPoint(talentName) {
    if (this.talentPoints > 0 && this.talents.hasOwnProperty(talentName)) {
      this.talents[talentName]++;
      this.talentPoints--;
      return true;
    }
    return false;
  }

  /**
   * Get talent value
   */
  getTalentValue(talentName) {
    return this.talents[talentName] || 0;
  }

  /**
   * Take damage
   */
  takeDamage(amount) {
    const damage = Math.max(0, amount - this.block);
    this.hp -= damage;
    this.block = Math.max(0, this.block - amount);
    if (this.hp < 0) this.hp = 0;
    return damage;
  }

  /**
   * Heal HP
   */
  heal(amount) {
    this.hp = Math.min(this.maxHP, this.hp + amount);
  }

  /**
   * Add block
   */
  addBlock(amount) {
    this.block += amount;
  }

  /**
   * Reset block (at end of turn)
   */
  resetBlock() {
    this.block = 0;
  }

  /**
   * Check if player is alive
   */
  isAlive() {
    return this.hp > 0;
  }
}
