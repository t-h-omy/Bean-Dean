/**
 * Talent system for the Garden Bean game
 */

export class TalentSystem {
  /**
   * Check if a talent succeeds
   * @param {Object} player - The player object
   * @param {string} talentName - Name of the talent to check
   * @returns {boolean} - Whether the check succeeded
   */
  static checkTalent(player, talentName) {
    const talentValue = player.getTalentValue(talentName);
    const chance = Math.min(talentValue * 0.05, 0.95); // 5% per point, max 95%
    return Math.random() < chance;
  }

  /**
   * Execute a talent check with callbacks
   * @param {Object} player - The player object
   * @param {string} talentName - Name of the talent to check
   * @param {Function} onSuccess - Callback for success
   * @param {Function} onFail - Callback for failure
   */
  static executeTalentCheck(player, talentName, onSuccess, onFail) {
    const success = this.checkTalent(player, talentName);
    if (success && onSuccess) {
      return onSuccess();
    } else if (!success && onFail) {
      return onFail();
    }
    return success;
  }

  /**
   * Check if player meets minimum talent requirement
   * @param {Object} player - The player object
   * @param {string} talentName - Name of the talent
   * @param {number} minValue - Minimum required value
   * @returns {boolean} - Whether requirement is met
   */
  static meetsRequirement(player, talentName, minValue) {
    return player.getTalentValue(talentName) >= minValue;
  }

  /**
   * Get talent names
   */
  static getTalentNames() {
    return [
      'roastMastery',
      'aromaControl',
      'beanIntuition',
      'soilSense',
      'caffeineSurge',
      'beanResistance'
    ];
  }

  /**
   * Get talent display name
   */
  static getTalentDisplayName(talentName) {
    const displayNames = {
      roastMastery: 'Roast Mastery',
      aromaControl: 'Aroma Control',
      beanIntuition: 'Bean Intuition',
      soilSense: 'Soil Sense',
      caffeineSurge: 'Caffeine Surge',
      beanResistance: 'Bean Resistance'
    };
    return displayNames[talentName] || talentName;
  }
}
