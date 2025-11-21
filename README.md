# 🌱 Garden Bean PWA

A Progressive Web App card game about protecting your garden from pests and harvesting beans.

## 📖 Game Overview

Garden Bean is a roguelike deckbuilding game where you navigate a 10x10 garden grid, rescue harvest fields before they decay, and battle pests using a card-based combat system. The game features a talent system that allows you to specialize your playstyle.

## 🎮 How to Play

### Controls
- **Movement**: Use Arrow Keys or WASD to move around the garden
- **Combat**: Click on cards to play them, then click "End Turn" when done

### Game Mechanics

#### Grid Exploration
- Navigate a 10x10 garden filled with different tiles:
  - 🔵 **Player** (blue): Your current position
  - 🟡 **Harvest** (yellow): Fields that need rescuing
  - 🔴 **Enemy** (red): Pests that block your path
  - 🟣 **Event** (purple): Random encounters
  - 🟢 **Shop** (teal): Future upgrade location

#### Tick System
- Every movement costs 2-10 ticks (random)
- Each combat costs 5 ticks
- Harvests lose 1 HP per tick when threatened
- Watch the tick counter to track time passing

#### Harvest System
- Harvest fields have HP ranging from 20-100
- They lose 1 HP per tick
- Rescue them by stepping on their tile before they reach 0 HP
- Gain XP based on remaining HP when rescued

#### Combat
- Turn-based card combat against garden pests
- Draw 5 cards at the start of combat
- Use 3 energy per turn to play cards
- Attack cards deal damage to enemies
- Block cards provide defense
- Defeat enemies to gain XP and level up

#### Cards
- **Strike**: Deal 6 damage (Cost: 1)
- **Defend**: Gain 5 block (Cost: 1)
- **Heavy Strike**: Deal 12 damage (Cost: 2)
- **Caffeine Boost**: Gain 3 block and heal 3 HP (Cost: 1)
- **Roasted Bean**: Deal 6 damage, with Roast Mastery talent deals 8 (Cost: 1)
- **Aroma Burst**: Gain 8 block, with Aroma Control talent gains 11 (Cost: 2)

#### Talents
Spend talent points (gained on level up) to improve abilities:
- **Roast Mastery**: Increase attack card effectiveness (5% chance per point)
- **Aroma Control**: Improve defensive abilities
- **Bean Intuition**: Better event outcomes
- **Soil Sense**: Enhanced harvest interactions
- **Caffeine Surge**: Energy-related bonuses
- **Bean Resistance**: Damage reduction

Each talent point gives a 5% success chance, capped at 95%.

#### Leveling System
- Gain XP by defeating enemies and rescuing harvests
- Level up when you reach the XP threshold (Level × 10)
- Each level:
  - Increases max HP by 5
  - Fully heals you
  - Grants 1 talent point
  - Increases XP needed for next level

### Enemies
- **Garden Slug**: Low HP (20), attacks for 5 damage
- **Blood Mosquito**: Low HP (15), multi-hit attack (3 damage × 2)
- **Angry Carrot**: Medium HP (30), strong attack (7 damage)

### Events
- **Mysterious Compost Heap**: Bean Intuition check - success grants XP, failure deals damage
- **Garden Gnome**: Choose between healing herbs or seed knowledge

## 🚀 Installation

### Play Online
Visit the GitHub Pages URL to play directly in your browser.

### Run Locally
1. Clone the repository
2. Navigate to the project directory
3. Start a local HTTP server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   ```
4. Open `http://localhost:8080/public/` in your browser

### Install as PWA
1. Visit the game in a supported browser (Chrome, Edge, Safari)
2. Look for the "Install" or "Add to Home Screen" option
3. Install the app for offline play

## 🏗️ Project Structure

```
/public
  index.html          # Main HTML entry point
  style.css           # Game styling
  main.js             # Main game controller
  sw.js               # Service worker for PWA
  manifest.json       # PWA manifest

/src/core
  grid.js             # Grid system
  player.js           # Player attributes and actions
  ticks.js            # Time/tick management
  harvest.js          # Harvest field system
  encounters.js       # Encounter handling
  combat.js           # Combat system
  deck.js             # Deck management
  cards.js            # Card definitions
  talents.js          # Talent system
  enemies.js          # Enemy definitions
  events.js           # Event system
  utils.js            # Utility functions

/assets
  /images             # Future image assets
  /icons              # PWA icons
```

## 🎯 Success Criteria (v1.0)

✅ Game loads and runs on GitHub Pages  
✅ Player can move on the grid using keyboard  
✅ Tick system tracks game time  
✅ Harvests lose HP over time and can be destroyed  
✅ Combat is fully playable with card mechanics  
✅ Deck system works (draw, play, discard, energy)  
✅ Talent checks function correctly  
✅ Leveling and talent point distribution work  
✅ Events trigger and provide choices  
✅ Basic UI reflects all game state  
✅ PWA is installable and works offline  

## 🔮 Future Enhancements

The following features are planned for future versions:
- Boss encounters
- Card reward system after combat
- Advanced enemy AI
- Animations and visual effects
- Custom icons and artwork
- Sound effects and music
- Meta-progression (unlocks between runs)
- Save system
- Difficulty scaling
- More cards, enemies, and events

## 🛠️ Technical Details

- **Technology**: Vanilla HTML/CSS/JavaScript (ES6 modules)
- **PWA**: Service worker with offline caching
- **Rendering**: DOM-based (no canvas)
- **Architecture**: Modular class-based design
- **Compatibility**: Modern browsers with ES6 module support

## 📄 License

This project is open source. See the repository for license details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Enjoy protecting your garden! 🌱☕**