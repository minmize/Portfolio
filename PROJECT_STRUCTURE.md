# Portfolio — Project Structure

> **REMINDER:** Check and update this file whenever you work on this project.
> If you add, remove, or significantly change any file or folder, update its entry here.

---

## Application Overview

An interactive 3D personal portfolio for **Sasha Guriev (`@minmize`)**, modeled after the
**World's Edge Mountains** campaign map in **Total War: Warhammer III** — stretching from
**Karak Ungor** in the frozen north, through **The Silver Road** (**Karaz-a-Karak**, **The Pillars
of Grungni**, **Mount Squighorn** — where Thorgrim Grudgebearer starts), across the volcanic
magma fissures of **Karag Dron / Death Pass**, down to **Karak Eight Peaks** in the south.

### Three-Tier Campaign Interaction Model
1. **Zoomed-Out Strategic View (`data-tier="strategic"`) — Portfolio Categories as Provinces**
   - Each province along the World's Edge Mountains represents a top-level portfolio domain:
     - **The Silver Road** → **App Coding & Software** (*Karaz-a-Karak*, *The Pillars of Grungni*, *Mount Squighorn*)
     - **Death Pass & Eight Peaks** → **Algorithmic Trading & Finance** (*Karak Eight Peaks*, *Karag Dron*)
     - **Karak Ungor & Peak Pass** → **About, Arsenal & Contact** (*Karak Ungor*, *Karak Kadrin*)
   - Glowing 3D province borders trace the mountain valleys; hovering displays a Total War
     stone-and-brass province tooltip and highlights the region on the top-right parchment minimap.
2. **Zoomed-In Province View (`data-tier="province"`) — Subsections / Projects as Cities**
   - Clicking a province banner, 3D province territory, or minimap polygon smoothly flies the 3D
     camera into that mountain valley.
   - Cities expand into Total War parchment-and-shield settlement nameplates (`NeuralNetworkBuilder`,
     `Movement Correction`, `GameSpecBuilder`, `Stock Predictor`, `MarketMind`, etc.).
3. **Settlement Construction Panel (`data-tier="settlement"`) — Detailed Construction Options**
   - Clicking a city frames its 3D Dwarfen stronghold and slides up the bottom **Settlement
     Construction Panel**.
   - Each city features tailored **Construction Options** (building slots with Dwarfen icons,
     tiers, and technical cost/turn badges) describing every facet of the project in detail
     (architecture, pipeline mechanics, building-effect highlights, unlocked tech stack, and
     repository/contact links).

### Offline-First Rendering
- Uses **Three.js** (`WebGLRenderer`) for sculpted ridged-multifractal alpine terrain, snowlines,
  glowing Death Pass magma rifts, instanced pine forests, 3D Dwarfen strongholds, valley mist,
  and draped 3D province borders.
- Includes a built-in **software 3D Canvas perspective fallback** in `app.js` if WebGL or the
  Three.js CDN is unavailable offline.

### Running Locally
Zero build step — works directly on GitHub Pages or any static server:
```bash
python3 -m http.server 4317   # then open http://localhost:4317
```
`.claude/launch.json` (`"portfolio"`) is pre-configured for `:4317`.

---

## Directory Layout

```
Portfolio/
├── index.html              # Semantic HTML shell, Total War HUD chrome & modal containers
├── styles.css              # Dwarfen slate, brass, royal blue & parchment UI design system
├── data.js                 # Pure portfolio configuration: provinces → cities → constructionOptions
├── app.js                  # Three.js 3D World's Edge terrain, camera rig, minimap & HUD logic
├── og-image.svg            # 1200×630 World's Edge Mountains Open Graph preview image
├── PROJECT_STRUCTURE.md    # Living architecture & editing guide (this file)
└── .claude/launch.json     # Local static preview server config (:4317)
```

---

## Editing Content (`data.js`)

All portfolio content lives in `window.PORTFOLIO_DATA` inside `data.js`:
- **Add or edit a category (Province):** Add/edit an object in `PORTFOLIO_DATA.provinces` (ready-made commented templates for **Research Papers** at *Rib Peaks* and **Instagram & Media** at *Eastern Badlands* are included at the bottom of `data.js`).
- **Add or edit a subsection/project (City):** Add an entry to a province's `cities` array with `coords: { x, z }`, `holdName`, `title`, `tier`, and `tagline`.
- **Add or edit detailed descriptions (Construction Options):** Add entries to a city's `constructionOptions` array (`topic`, `buildingName`, `slotType`, `tier`, `icon`, `cost`, `turns`, `description`, `effects`, `unlocks`).
