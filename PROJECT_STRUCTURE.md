# Portfolio — Project Structure

> **REMINDER:** Check and update this file whenever you work on this project.
> If you add, remove, or significantly change any file or folder, update its entry here.

---

## Application Overview

A single-file personal site for **Sasha Guriev (@minmize)**, built as a fixed full-screen
night-sky experience (no page scroll). The aesthetic is a monochrome, engraved star atlas
— high-contrast white-on-black with sharp 4-point stars and a stippled **spiral galaxy** in
the corner. The only colour besides white is a single **muted green**, used solely for the
name (top-left).

The central element is an **ornate, hand-drawn box** (a charcoal/sketch SVG frame via an
`feDisplacementMap` "rough" filter): a flowy looping top line, a broken bottom line, glowing
4-point corner stars (top-right + bottom-left) with hanging lines, cross corners (top-left +
bottom-right), faint hazy diagonals, and a glowing centre star on the cycler — reproducing
the reference mockup.

**Interaction model:**
- **Landing = the About box.** On load the box is centred over the sky showing *About*
  section 1 ("Who I am"); the five sections (Who I am / What I've built / Skills / How I
  work / Contact) are navigated by a prev/next cycler with a glowing centre star.
- **Click a star** → the same box swaps to that project.
- The swap is a ~0.5s **directional bleed** (content slides + de-blurs from the clicked
  element's direction) with a **light-beam sweep**.
- **Home** — click the green name (top-left), any empty sky, or `Esc` returns to About §1.
- **Index** — a greyish "Index" link under the name opens a *separate* full-screen screen
  with **inertia ("rolling") scrolling** listing every project as cards that share the box's
  hand-drawn frame language; clicking a card returns to the hero and opens that project.

Content is grounded in the sibling repos (MarketMind / "Financial App", NeuralNetworkApp,
Stock_Predictor, Movement_Correction, GameSpecBuilder).

**Design system:** strict 8-pt spacing (`--s-*`); a single serif (**Times New Roman**) for
all type; sharp radii (2–3px); monochrome palette + one muted-green accent (`--green`);
fixed `feTurbulence` film grain; motion is intent-driven (parallax, bleed, beam, inertia)
and disabled under `prefers-reduced-motion`. Celestial elements have **no focus box**
(outline removed) — focus shows via glow/scale instead.

**External APIs / services:** none. Google Fonts is the only network request.

**To run:**
```bash
python3 -m http.server 4317   # from this folder, then open http://localhost:4317
```
`.claude/launch.json` ("portfolio") is provided for the Launch preview panel.

---

## Directory Layout

```
Portfolio/
├── index.html              # Complete app — HTML, CSS, JS in one file
├── og-image.svg            # 1200×630 monochrome Open Graph / share image
├── PROJECT_STRUCTURE.md     # This file
└── .claude/launch.json     # Static-preview helper (serves this folder on :4317)
```

---

## `index.html`

### Structure
| Region | Purpose |
|--------|---------|
| `.grain` | Fixed `feTurbulence` film-grain overlay (engraved feel) |
| `.stage` → `svg.sky` | The fixed hero. Layers: `#ambient` (dot field + bright 4-point stars), `#constellations` (clickable project stars, no labels), `#moon` (now holds the stippled spiral galaxy), `#snake` (unused/empty) |
| `.nameplate` | Green serif name (returns home) + greyish **Index** link |
| `.panel` | The ornate centre box (the landing): `#frame` (SVG ornament), `#beam` (light sweep), `#panelViewport`/`#panelContent` (scrolls internally) |
| `.indexscreen` | Separate inertia-scroll screen with the grouped project cards |

### Script responsibilities (one IIFE)
| Area | What it does |
|------|--------------|
| `PHASES`, `CONSTELLATIONS`, `POSM`, `VIEW` | Content + landscape (data) / portrait (`POSM`) star positions; `VIEW` holds per-breakpoint viewBox, galaxy centre, ambient config |
| `buildGalaxy` / `sparkleStar` | Procedural stippled spiral galaxy (two log-spiral arms + glowing core) rendered into the `#moon` layer, and the 4-point star generator |
| `layoutSky` + `build*` | Picks the landscape/portrait layout by `matchMedia` and (re)builds ambient, constellations, galaxy; rebuilt on breakpoint change |
| `buildFrame` | Draws the ornate box border sized to the live panel (rough filter): flowy looping top, broken bottom, big glowing corner stars (TR+BL) with hanging lines, cross corners (TL+BR), faint hazy diagonals |
| `showPanel` / `goHome` / `dirFrom` | The directional bleed + beam swap, and return-to-About-landing |
| `openAbout` / `openProject` + delegated cycler | Render About (with prev/next) and project detail into the box |
| Back triggers | Green name, empty-sky click, and `Esc` |
| Parallax | Pointer-driven layered sky shift (fine pointer only; rAF) |
| Index screen | `buildIndex`, native scroll + rAF inertia wheel layer (degrades to native scroll where rAF is throttled), open/close |

---

## `og-image.svg`
Static 1200×630 monochrome share image (night sky + name lockup), referenced by the
`og:image` / `twitter:image` tags. For production deploys, set absolute URLs and consider a
PNG fallback, since some scrapers don't render SVG.
