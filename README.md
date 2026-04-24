# The Bricks

A space-themed brick breaker where you guide a rocket through an asteroid field, manage limited fuel, collect charged abilities, and clear the entire sector to win.

## Features

- **Asteroid Field Gameplay** - Bounce the rocket off the pad and clear a 4 x 12 asteroid layout.
- **Fuel System** - Fuel drains during flight and when the rocket drops below the play area; gray asteroids restore fuel.
- **Ability System** - Blue and red asteroids charge abilities that apply random temporary gameplay effects.
- **Difficulty Modes** - Easy, Medium, Hard, and Experimental presets change rocket and pad speed through a SweetAlert2 mode picker.
- **Experimental Controls** - Experimental mode also exposes SweetAlert sliders for manual rocket and pad speed tuning.
- **Score History** - Runs are saved in local storage with score, timestamp, finish status, and difficulty.
- **Win and Loss Modals** - SweetAlert2 is used for score history, settings, game over, and victory screens.
- **Sprite-Based Visuals** - Pixel-art asteroid, rocket, and pad sprites sit on top of a space background with floating planets.

## Tech Stack

- **Build**: Vite
- **Styling**: Tailwind CSS v4, custom CSS
- **UI**: SweetAlert2, Lucide icons
- **Fonts**: Stepalange, JetBrains Mono
- **Deployment**: GitHub Pages

## Project Structure

```
src/
  js/
    main.js         # App bootstrap
    game.js         # Game state, loop, and effect system
    entities.js     # Rocket, pad, asteroid entities and collisions
    abilities.js    # Ability charging and effect application
    config.js       # Game settings, modes, and feature flags
    canvas.js       # Canvas and button element wiring
    ui.js           # HUD, modals, and UI updates
    render.js       # Canvas drawing
  assets/
    background/     # Space background image
    rocks/          # Asteroid sprite sheets (blue, gray, normal, red)
    rockets/        # Rocket sprites
    sound/          # Audio assets
  style/
    style.css       # Global styling and Tailwind
index.html          # Game shell and HUD layout
vite.config.js      # Vite config and GitHub Pages base path
package.json        # Scripts and dependencies
```

## Controls

| Input | Action |
|-------|--------|
| Left / Right Arrow | Move pad |
| Space | Launch rocket (before launch) |
| Blue ability button | Activate blue ability |
| Red ability button | Activate red ability |
| Pause button | Pause / resume game |
| Score button | Open score history |
| Mode button | Change difficulty |

## Ability Effects

**Red Ability (offense/defense)**:
- Pause fuel drain for 5 seconds
- Restore 1 fuel unit
- Slow fuel drain for 8 seconds

**Blue Ability (mobility/chaos)**:
- Boost pad speed for 8 seconds
- Stabilize rocket (reduce speed) for 8 seconds
- Slow pad speed for 8 seconds
- Overdrive rocket for 8 seconds
- Spike fuel drain for 5 seconds

## Asteroids

| Type | Chance | Effect |
|------|--------|--------|
| Normal | 60% | Destroys asteroid |
| Gray | 18% | Destroys asteroid, restores fuel |
| Blue | 14% | Destroys asteroid, charges blue ability |
| Red | 8% | Destroys asteroid, charges red ability |

## Run Tracking

- Every finished or failed run is stored in local storage.
- Score history shows score, timestamp, whether the run was finished, and the difficulty used for that run.
- Older saved entries without metadata are treated as `Did not finish` and `Unknown` difficulty.

## Difficulty Modes

| Mode | Rocket Speed | Pad Speed | Notes |
|------|--------------|-----------|-------|
| Easy | 4 | 3 | Slower movement |
| Medium | 5 | 4 | Default mode |
| Hard | 7 | 6 | Faster play |
| Experimental | 5 | 4 | Unlocks manual speed sliders |

## Setup

```bash
git clone https://github.com/majtobijakodric/the-bricks.git
cd the-bricks
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Deploy

```bash
npm run deploy
```

## Credits

Asteroid sprites: [Pixel Art Top Down Rocks Pack](https://dustdfg.itch.io/pixel-art-top-down-rocks-pack) by dustdfg

Space background: [Space Background Generator](https://deep-fold.itch.io/space-background-generator) by deep-fold

## License

MIT License. See [LICENSE](LICENSE) for the full text.
