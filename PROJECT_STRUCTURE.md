# Portfolio — Project Structure

> **REMINDER:** Check and update this file whenever you work on this project.
> If you add, remove, or significantly change any file or folder, update its entry here.

---

## Application Overview

An interactive 3D portfolio for **Sasha Guriev (`@minmize`)** styled after the **Total War:
Warhammer III** campaign map, set in the **World's Edge Mountains** — from **Karak Ungor** and
**Peak Pass** in the north, through **The Silver Road** (Thorgrim's start: Karaz-a-Karak, The
Pillars of Grungni, Mount Squighorn), across the volcanic magma rifts of **Death Pass / Karag Dron**,
down to **Karak Eight Peaks**.

### Self-contained build (`src/` → `index.html`)
To guarantee that opening `index.html` directly from disk (`file://`), a static previewer, or
GitHub Pages never flashes unstyled HTML or fails on blocked relative/CDN assets, `build.py`
inlines `src/styles.css`, `src/vendor/three.min.js`, `src/data.js`, and `src/app.js` into a single
self-contained root `index.html` (~756 KB). Edit files in `src/` and run `python3 build.py`.

### Three-tier interaction
1. **World map (`data-tier="strategic"`)** — each province is a portfolio discipline, shown as big
   TW-style map lettering (lore name + category in script). Hovering a province lights its border
   and territory **red**; holds show as heraldic tier shields.
2. **Province (`data-tier="province"`)** — clicking lettering, the terrain, or a right-rail province
   medallion flies the camera into the province; holds expand into parchment nameplates (one project
   each). Other provinces dim.
3. **Settlement (`data-tier="settlement"`)** — clicking a hold (or pressing **End Turn**) opens:
   - a compact **construction bar** at the bottom (province ribbon, hold tabs, city plaque, and
     one building slot per construction option), and
   - a **building info panel** on the left with the selected construction's full description,
     effects, tech used, and links.
   The camera frames the hold in the open space above the bar and right of the info panel.

Back navigation: the single red **Return** pill under the name plaque, `Esc`, scrolling/zooming out,
or clicking empty land.

### HUD
- **Top-left**: **Book of Works** — a standalone parchment plain-text reader with table of contents
  covering every province, project, and construction. It never navigates the map.
- **Top-centre**: Dwarfen bronze name plaque (`Sasha Guriev`) with a short italic script description
  (`identity.siteDescription`). No top-right minimap.
- **Right rail**: Vertical gilded spine with Dwarfen crest, Roman-numeral province medallions
  (showing hold count badges and active red ring), and direct Email / GitHub envoy medallions.
- **Bottom-right turn dial**: Circular `+` and `−` zoom buttons stacked above an ornate hourglass
  **End Turn** dial with turn badge and `"Next: <Hold Name>"` ribbon that cycles hold-by-hold.
- **Bottom status band**: Dark-bronze strip with gilded chevron trim showing `Turn`, Imperial
  Calendar `Season & Year`, current map location, central gilded ornament, and camera controls hint.
- Borders, roads/underway routes, and landmarks are always visible (no cluttering toggle buttons).

### World rendering (`src/app.js`, Three.js r128)
- **Linear PBR & ACES Filmic tone mapping**: `sRGBEncoding` + `ACESFilmicToneMapping`, alpine sky
  hemisphere light, angled directional sun with `PCFSoftShadowMap`, cool sky fill, and volcanic
  point light over Death Pass.
- **Per-pixel terrain shader & derivative bump mapping**: 340×380 ridged-multifractal heightfield
  with concavity ambient occlusion, world-space Mikkelsen `dFdx`/`dFdy` rock-relief normal
  perturbation, cold weathered slate-granite cliff strata, scorched volcanic basalt around Death
  Pass / Karag Dron, broken craggy alpine snowpack, and rotated western Old World farmland patchwork
  with dark hedgerows.
- **Surrounding biomes & settlements**: Western Stirland/Ostermark rivers, Black Water crater lake,
  Blood River, instanced plaster-and-thatch human hamlets in the western lowlands, dense clumped
  conifer and broadleaf forests, angular scree boulders, eastern Dark Lands ash wastes, and southern
  Badlands ochre scrub.
- **Dwarf holds**: Mountain-carved granite bastions with sloped buttresses, crenellated parapets,
  recessed iron-bound double doors with bronze cross-bars and glowing forge slits, bearded ancestor
  statues, octagonal slate watchtowers, fire braziers, and drifting forge smoke.
- **Fog of war**: Land outside the explored ellipse (`WORLD`) desaturates into mist, covered by
  three drifting shader cloud layers blending seamlessly into distance fog — no hard map cutoff.
- 2D canvas fallback if WebGL is unavailable; deep links: `#province=<id>`, `#hold=<id>`, `#book`.

### Typography
Grenze Gotisch (name, book titles) · Grenze (UI/headings) · Alegreya (body) — Google Fonts with
serif fallbacks.

### Building & running locally
```bash
python3 build.py              # bundles src/* into standalone root index.html
python3 -m http.server 4317   # optional local server -> http://localhost:4317 (file:// also works)
```

---

## Directory Layout

```
Portfolio/
├── index.html              # Self-contained production bundle generated by build.py (zero local/JS deps)
├── build.py                # Inlines src/styles.css, three.min.js, data.js, and app.js into index.html
├── src/
│   ├── index.html          # Editable HTML shell: veil, map stage, HUD, right rail, turn dial, book
│   ├── styles.css          # Editable TW:WH3 bronze/gold/crimson UI, rail, status band, parchment reader
│   ├── data.js             # Editable content: provinces → cities → constructionOptions, landmarks, roads
│   ├── app.js              # Editable 3D terrain/shader/world, camera, markers, rail, turns, settlement UI
│   └── vendor/
│       └── three.min.js    # Bundled Three.js r128 (offline-safe, inlined by build.py)
├── og-image.svg            # 1200×630 share image
├── PROJECT_STRUCTURE.md    # This file
└── .claude/launch.json     # Local static preview server config (:4317)
```

---

## Editing Content (`src/data.js`)

After editing `src/data.js` (or any file in `src/`), run `python3 build.py` to regenerate root `index.html`.

- **Province (category):** entry in `provinces` — `category`, `loreName`, `color`/`accent`, `center`
  (camera focus), `labelAt` (where the map lettering sits; keep it clear of holds), `border` polygon.
  Commented templates for *Research Papers* and *Instagram & Media* are at the bottom.
- **Hold (project):** entry in a province's `cities` — `coords {x,z}`, `holdName`, `title`, `tier`,
  `tagline`, `stack`, `repoUrl`.
- **Construction (detail):** entry in a city's `constructionOptions` — `topic`, `buildingName`,
  `slotType`, `tier`, `icon` (key in `ICONS` in `src/app.js`), `cost`, `turns`, `description`,
  `effects`, `unlocks`, optional `links`.
- **Scenery:** `landmarks` (`type`: tower | ruin | camp | label | water | region) and `underwayRoutes`
  (painted as roads).
- **Banner text:** `identity.name` and `identity.siteDescription`.
