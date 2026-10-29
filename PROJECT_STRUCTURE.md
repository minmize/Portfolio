# Portfolio — Project Structure

> **REMINDER:** Check and update this file whenever you work on this project.
> If you add, remove, or significantly change any file or folder, update its entry here.

---

## Application Overview

An interactive 3D portfolio for **Sasha Guriev (`@minmize`)** styled after the **Total War:
Warhammer III** campaign map, set in the **World's Edge Mountains** — from **Karak Ungor** and
**Peak Pass** in the north, through **The Silver Road** (Thorgrim's start: Karaz-a-Karak, The
Pillars of Grungni, Mount Squighorn), across the magma veins of **Death Pass / Karag Dron**, down
to **Karak Eight Peaks**.

### Three-tier interaction
1. **World map (`data-tier="strategic"`)** — each province is a portfolio discipline, shown as big
   TW-style map lettering (lore name + category in script). Hovering a province lights its border
   and territory **red**; holds show as small heraldic shields.
2. **Province (`data-tier="province"`)** — clicking lettering, the terrain, or the minimap flies the
   camera into the province; holds expand into parchment nameplates (one project each). Other
   provinces dim.
3. **Settlement (`data-tier="settlement"`)** — clicking a hold opens:
   - a compact **construction bar** at the bottom (province ribbon, hold tabs, city plaque and
     one building slot per construction option), and
   - a **building info panel** on the left with the selected construction's full description,
     effects, tech used, and links.
   The camera frames the hold in the open space above the bar and right of the info panel.

Back navigation: the single red **Return** pill under the name plaque, `Esc`, scrolling out, or
clicking empty land.

### HUD (deliberately minimal)
- Top-left: **Book of Works** — a plain reader (parchment page + contents sidebar) containing every
  province, project and construction as text. It never navigates the map.
- Top-centre: name plaque with a one-line description (`identity.siteDescription`).
- Top-right: parchment minimap with fog edge and a red camera reticle.
- No zoom/turn/toggle buttons: scroll zooms, drag pans, right-drag/Shift-drag orbits, WASD/arrows pan.
  Borders, roads and landmarks are always on.

### World rendering (`app.js`, Three.js r128)
- Procedural ridged terrain (smooth shaded, vertex-coloured: meadows, forests, rock, ochre Badlands,
  snow only on high peaks), sun shadows.
- Rivers (Black Water lake, Blood River, two western rivers) carved below a water plane; roads painted
  along `underwayRoutes` + extra roads; animated magma-vein ribbons in Death Pass.
- Instanced pine forests and rocks; 3D Dwarf holds with forge smoke; minor sites (towers, ruins,
  camps) from `landmarks`.
- Province borders as draped glowing ribbons (province colour → red when hovered/active).
- **Fog of war**: land outside the explored ellipse (`WORLD`) is greyed, covered by three drifting
  shader cloud layers, and blends into grey distance fog — no hard map edge.
- 2D canvas fallback if WebGL/three.js is unavailable.
- Deep links: `#province=<id>`, `#hold=<id>`, `#book`.

### Typography
Grenze Gotisch (name, book titles) · Grenze (UI/headings) · Alegreya (body) — Google Fonts.

### Running locally
```bash
python3 -m http.server 4317   # then open http://localhost:4317
```

---

## Directory Layout

```
Portfolio/
├── index.html              # HTML shell: veil, map stage, HUD, settlement panels, Book of Works
├── styles.css              # TW:WH3-style bronze/gold/crimson UI + parchment reader
├── data.js                 # All content: provinces → cities → constructionOptions, landmarks, roads
├── app.js                  # 3D terrain/world, camera, markers, minimap, settlement UI, book
├── og-image.svg            # 1200×630 share image
├── PROJECT_STRUCTURE.md    # This file
└── .claude/launch.json     # Local static preview server config (:4317)
```

---

## Editing Content (`data.js`)

- **Province (category):** entry in `provinces` — `category`, `loreName`, `color`/`accent`, `center`
  (camera focus), `labelAt` (where the map lettering sits; keep it clear of holds), `border` polygon.
  Commented templates for *Research Papers* and *Instagram & Media* are at the bottom.
- **Hold (project):** entry in a province's `cities` — `coords {x,z}`, `holdName`, `title`, `tier`,
  `tagline`, `stack`, `repoUrl`.
- **Construction (detail):** entry in a city's `constructionOptions` — `topic`, `buildingName`,
  `slotType`, `tier`, `icon` (key in `ICONS` in app.js), `cost`, `turns`, `description`, `effects`,
  `unlocks`, optional `links`.
- **Scenery:** `landmarks` (`type`: tower | ruin | camp | label | water | region) and `underwayRoutes`
  (painted as roads).
- **Banner text:** `identity.name` and `identity.siteDescription`.
