/**
 * Main game controller for Garden Bean PWA
 */
import { Grid } from '../src/core/grid.js';
import { Player } from '../src/core/player.js';
import { TickSystem } from '../src/core/ticks.js';
import { HarvestSystem } from '../src/core/harvest.js';
import { EncounterSystem } from '../src/core/encounters.js';
import { Combat } from '../src/core/combat.js';
import { getStarterDeck } from '../src/core/cards.js';
import { executeEvent, getEvent } from '../src/core/events.js';

class Game {
  constructor() {
    this.grid = new Grid(10, 10);
    this.player = new Player(5, 5);
    this.tickSystem = new TickSystem();
    this.harvestSystem = new HarvestSystem();
    this.encounterSystem = new EncounterSystem(this);
    this.combat = null;
    this.currentEvent = null;
    this.state = 'exploration'; // exploration, combat, event, gameover
    
    this.initializeGame();
    this.setupEventListeners();
    this.render();
  }

  initializeGame() {
    // Give player starter deck
    this.player.deck = getStarterDeck();
    
    // Populate grid
    this.grid.populate();
    
    // Create harvests for harvest tiles
    this.grid.tiles.forEach(tile => {
      if (tile.type === 'harvest') {
        this.harvestSystem.createHarvest(tile.harvestId);
      }
    });
    
    // Setup tick listener for harvest updates
    this.tickSystem.addListener(() => {
      this.harvestSystem.update();
      this.render();
    });
  }

  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.state === 'exploration') {
        this.handleMovement(e);
      }
    });
  }

  handleMovement(e) {
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      'W': 'up',
      's': 'down',
      'S': 'down',
      'a': 'left',
      'A': 'left',
      'd': 'right',
      'D': 'right'
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      this.movePlayer(direction);
    }
  }

  movePlayer(direction) {
    const newPos = this.player.move(direction);
    
    // Check if valid position
    if (!this.grid.isValidPosition(newPos.x, newPos.y)) {
      return;
    }
    
    // Update player position
    this.player.setPosition(newPos.x, newPos.y);
    
    // Advance ticks
    const movementCost = this.tickSystem.getMovementCost();
    this.tickSystem.advance(movementCost);
    
    // Check for encounters
    const tile = this.grid.getTile(newPos.x, newPos.y);
    this.handleEncounter(tile);
    
    this.render();
  }

  handleEncounter(tile) {
    if (tile.type === 'empty') return;
    
    const encounter = this.encounterSystem.handleTileEnter(tile);
    
    if (encounter.type === 'combat') {
      this.startCombat(encounter.enemy);
      // Clear tile
      this.grid.setTile(tile.x, tile.y, 'empty');
    } else if (encounter.type === 'event') {
      this.startEvent(encounter.eventId);
      // Clear tile
      this.grid.setTile(tile.x, tile.y, 'empty');
    } else if (encounter.type === 'harvest') {
      this.rescueHarvest(encounter.harvestId);
      // Clear tile
      this.grid.setTile(tile.x, tile.y, 'empty');
    }
  }

  startCombat(enemy) {
    this.state = 'combat';
    this.combat = new Combat(this.player, enemy);
    this.combat.start();
    
    // Advance ticks for combat
    const combatCost = this.tickSystem.getCombatCost();
    this.tickSystem.advance(combatCost);
    
    this.render();
  }

  endCombat() {
    if (this.combat && this.combat.playerWon) {
      // Reward XP
      this.player.gainXP(10);
    }
    
    this.combat = null;
    this.state = 'exploration';
    this.encounterSystem.clearEncounter();
    this.render();
  }

  startEvent(eventId) {
    this.state = 'event';
    this.currentEvent = {
      id: eventId,
      data: getEvent(eventId)
    };
    this.render();
  }

  executeEventAction(choiceId = null) {
    const result = executeEvent(this.currentEvent.id, this.player, choiceId);
    
    if (result.needsChoice) {
      // Still need choice, don't end event
      return;
    }
    
    // Apply rewards/penalties
    if (result.reward) {
      if (result.reward.xp) this.player.gainXP(result.reward.xp);
      if (result.reward.heal) this.player.heal(result.reward.heal);
    }
    if (result.penalty) {
      if (result.penalty.damage) this.player.takeDamage(result.penalty.damage);
    }
    
    // End event
    this.currentEvent = null;
    this.state = 'exploration';
    this.encounterSystem.clearEncounter();
    this.render();
  }

  rescueHarvest(harvestId) {
    const result = this.harvestSystem.rescueHarvest(harvestId);
    if (result.rescued) {
      this.player.gainXP(result.xp);
    }
    this.harvestSystem.removeHarvest(harvestId);
    this.render();
  }

  render() {
    this.renderGrid();
    this.renderPlayerInfo();
    this.renderTickCounter();
    
    if (this.state === 'combat') {
      this.renderCombat();
    } else if (this.state === 'event') {
      this.renderEvent();
    } else {
      this.hideOverlays();
    }
  }

  renderGrid() {
    const gridEl = document.getElementById('grid');
    if (!gridEl) return;
    
    gridEl.innerHTML = '';
    
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        const tile = this.grid.getTile(x, y);
        const tileEl = document.createElement('div');
        tileEl.className = 'tile';
        
        // Add tile type class
        if (tile.type !== 'empty') {
          tileEl.classList.add(`tile-${tile.type}`);
        }
        
        // Highlight player position
        if (x === this.player.x && y === this.player.y) {
          tileEl.classList.add('tile-player');
        }
        
        // Show harvest HP
        if (tile.type === 'harvest') {
          const harvest = this.harvestSystem.getHarvest(tile.harvestId);
          if (harvest) {
            const hpBar = document.createElement('div');
            hpBar.className = 'hp-bar';
            hpBar.style.width = `${(harvest.hp / harvest.maxHP) * 100}%`;
            tileEl.appendChild(hpBar);
            
            const hpText = document.createElement('div');
            hpText.className = 'hp-text';
            hpText.textContent = harvest.hp;
            tileEl.appendChild(hpText);
          }
        }
        
        gridEl.appendChild(tileEl);
      }
    }
  }

  renderPlayerInfo() {
    const playerInfoEl = document.getElementById('player-info');
    if (!playerInfoEl) return;
    
    const xpNeeded = this.player.getXPForNextLevel();
    
    playerInfoEl.innerHTML = `
      <div class="stat">HP: ${this.player.hp}/${this.player.maxHP}</div>
      <div class="stat">Level: ${this.player.level}</div>
      <div class="stat">XP: ${this.player.xp}/${xpNeeded}</div>
      <div class="stat">Talent Points: ${this.player.talentPoints}</div>
    `;
  }

  renderTickCounter() {
    const tickEl = document.getElementById('tick-counter');
    if (!tickEl) return;
    
    tickEl.textContent = `Ticks: ${this.tickSystem.getCurrentTick()}`;
  }

  renderCombat() {
    const combatEl = document.getElementById('combat-overlay');
    if (!combatEl) return;
    
    combatEl.style.display = 'block';
    
    const state = this.combat.getState();
    
    // Render combat info
    const infoEl = combatEl.querySelector('.combat-info');
    infoEl.innerHTML = `
      <div class="enemy-info">
        <h3>${state.enemy.name}</h3>
        <div class="stat">HP: ${state.enemy.hp}/${state.enemy.maxHP}</div>
        <div class="stat">Intent: ${state.enemy.intent} (${state.enemy.attackValue})</div>
      </div>
      <div class="player-combat-info">
        <div class="stat">HP: ${state.player.hp}/${state.player.maxHP}</div>
        <div class="stat">Block: ${state.player.block}</div>
        <div class="stat">Energy: ${state.energy}/${state.maxEnergy}</div>
      </div>
    `;
    
    // Render hand
    const handEl = combatEl.querySelector('.hand');
    handEl.innerHTML = '';
    state.hand.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">Cost: ${card.cost}</div>
        <div class="card-desc">${card.description}</div>
      `;
      cardEl.addEventListener('click', () => {
        this.combat.playCard(card.instanceId);
        this.render();
      });
      handEl.appendChild(cardEl);
    });
    
    // Render end turn button
    const endTurnBtn = combatEl.querySelector('#end-turn-btn');
    if (!state.isOver) {
      endTurnBtn.style.display = 'block';
      endTurnBtn.onclick = () => {
        this.combat.endTurn();
        this.render();
      };
    } else {
      endTurnBtn.style.display = 'none';
      
      // Show victory/defeat message
      const resultEl = document.createElement('div');
      resultEl.className = 'combat-result';
      resultEl.innerHTML = `
        <h2>${state.playerWon ? 'Victory!' : 'Defeat!'}</h2>
        <button id="continue-btn">Continue</button>
      `;
      combatEl.appendChild(resultEl);
      
      document.getElementById('continue-btn').onclick = () => {
        this.endCombat();
      };
    }
  }

  renderEvent() {
    const eventEl = document.getElementById('event-overlay');
    if (!eventEl) return;
    
    eventEl.style.display = 'block';
    
    const event = this.currentEvent.data;
    const result = executeEvent(this.currentEvent.id, this.player);
    
    eventEl.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
    `;
    
    if (result.needsChoice) {
      const choicesEl = document.createElement('div');
      choicesEl.className = 'event-choices';
      result.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.description;
        btn.onclick = () => this.executeEventAction(choice.id);
        choicesEl.appendChild(btn);
      });
      eventEl.appendChild(choicesEl);
    } else {
      const resultEl = document.createElement('div');
      resultEl.innerHTML = `
        <p>${result.description}</p>
        <button id="event-continue-btn">Continue</button>
      `;
      eventEl.appendChild(resultEl);
      
      document.getElementById('event-continue-btn').onclick = () => {
        this.executeEventAction();
      };
    }
  }

  hideOverlays() {
    const combatEl = document.getElementById('combat-overlay');
    const eventEl = document.getElementById('event-overlay');
    if (combatEl) combatEl.style.display = 'none';
    if (eventEl) eventEl.style.display = 'none';
  }
}

// Start game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
  });
} else {
  window.game = new Game();
}
