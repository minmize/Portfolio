/**
 * ============================================================================
 * WORLD'S EDGE MOUNTAINS — 3D CAMPAIGN MAP ENGINE
 * Terrain · rivers · roads · holds · fog of war · HUD · Book of Works
 * ============================================================================
 */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function isCompact() { return window.innerWidth < 900; }

  /* ===================== ICONS ===================== */
  var ICONS = {
    citadel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21h18M5 21V9l3-2V4h8v3l3 2v12"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/><path d="M9 10h6"/></svg>',
    forge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 16h16l-2 5H6l-2-5z"/><path d="M7 16v-4h10v4"/><path d="M12 3c2 2.5 3 4.2 3 6a3 3 0 0 1-6 0c0-1.8 1-3.5 3-6z"/></svg>',
    gate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21V6l4-3h10l4 3v15"/><path d="M8 21v-8a4 4 0 0 1 8 0v8"/><line x1="12" y1="9" x2="12" y2="21"/></svg>',
    gyro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="13" r="4"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="12" y1="6" x2="12" y2="9"/><path d="M8 17l-3 3M16 17l3 3"/></svg>',
    rune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"/><path d="M12 6v12M8 9l4 3 4-3M8 15l4-3 4 3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 7v10M8.5 11.5h7"/></svg>',
    scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><line x1="8" y1="9" x2="15" y2="9"/><line x1="8" y1="13" x2="15" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>',
    anvil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 10H3l2 4h3v4H6l-1 3h14l-1-3h-2v-4h5l-2-4H7z"/><path d="M9 6h6v4H9z"/></svg>',
    mine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 3 20 9 16 20 8 20 4 9 12 3"/><polyline points="4 9 12 13 20 9"/><line x1="12" y1="13" x2="12" y2="20"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2V4z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/><line x1="3" y1="21" x2="21" y2="21"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18h18v2H3zM4 15l2.5-8 5.5 4.5L17.5 7 20 15H4z"/></svg>',
    envoy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>'
  };
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  var TIER_NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

  /* ===================== SMALL HELPERS ===================== */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function smoothstep(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function seeded(seed) {
    var s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* ===================== NOISE ===================== */
  function hash2(ix, iz) {
    var n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }
  function valueNoise(x, z) {
    var ix = Math.floor(x), iz = Math.floor(z);
    var fx = x - ix, fz = z - iz;
    var ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
    var a = hash2(ix, iz), b = hash2(ix + 1, iz), c = hash2(ix, iz + 1), d = hash2(ix + 1, iz + 1);
    return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
  }
  function ridgedFbm(x, z, oct) {
    var sum = 0, amp = 0.55, f = 1, norm = 0;
    for (var i = 0; i < oct; i++) {
      var r = 1 - Math.abs(valueNoise(x * f, z * f) * 2 - 1);
      sum += r * r * amp; norm += amp; f *= 2.07; amp *= 0.48;
    }
    return sum / norm;
  }
  function fbm(x, z, oct) {
    var sum = 0, amp = 0.5, f = 1, norm = 0;
    for (var i = 0; i < oct; i++) { sum += valueNoise(x * f, z * f) * amp; norm += amp; f *= 2.03; amp *= 0.5; }
    return sum / norm;
  }

  /* ===================== GEOGRAPHY ===================== */
  // Explored ellipse — everything beyond it fades into the grey fog of war
  var WORLD = { cx: 0, cz: 2, rx: 68, rz: 98 };
  function fowDist(x, z) {
    var dx = (x - WORLD.cx) / WORLD.rx, dz = (z - WORLD.cz) / WORLD.rz;
    return Math.sqrt(dx * dx + dz * dz);
  }
  var WATER_Y = 1.4, LAVA_Y = 1.62;

  function catmull(pts, spacing, closed) {
    var out = [], n = pts.length, segs = closed ? n : n - 1;
    for (var i = 0; i < segs; i++) {
      var p0 = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
      var p1 = pts[i], p2 = pts[(i + 1) % n];
      var p3 = pts[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
      var steps = Math.max(3, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / spacing));
      for (var s = 0; s < steps; s++) {
        var t = s / steps, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    if (!closed) out.push(pts[n - 1].slice());
    return out;
  }
  function makeLine(pts, spacing, pad) {
    var s = catmull(pts, spacing, false);
    var minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    s.forEach(function (p) {
      if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
      if (p[1] < minZ) minZ = p[1]; if (p[1] > maxZ) maxZ = p[1];
    });
    return { pts: s, minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad };
  }
  function inBox(l, x, z) { return x >= l.minX && x <= l.maxX && z >= l.minZ && z <= l.maxZ; }
  function distToPolyline(x, z, pts) {
    var best = 1e9;
    for (var i = 0; i < pts.length - 1; i++) {
      var ax = pts[i][0], az = pts[i][1];
      var vx = pts[i + 1][0] - ax, vz = pts[i + 1][1] - az;
      var wx = x - ax, wz = z - az, L = vx * vx + vz * vz;
      var t = L > 0 ? clamp01((wx * vx + wz * vz) / L) : 0;
      var dx = wx - vx * t, dz = wz - vz * t, d = dx * dx + dz * dz;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  function river(pts, w) { var l = makeLine(pts, 2.5, w * 4); l.w = w; return l; }
  var RIVERS = [
    river([[-39, -29], [-48, -23], [-60, -27], [-74, -19], [-94, -24], [-122, -15], [-160, -20]], 2.1),
    river([[-23, -4], [-33, 0], [-45, 6], [-58, 3], [-74, 10], [-97, 7], [-160, 13]], 1.6),
    river([[-41, 33], [-52, 37], [-64, 32], [-80, 41], [-104, 38], [-160, 49]], 2.4)
  ];
  var LAKES = [{ x: -33, z: -30, rx: 8, rz: 5 }];

  var EXTRA_ROADS = [
    [[-18, -10], [-30, -13], [-42, -9], [-56, -13], [-74, -7], [-104, -10]],
    [[-11, 35], [-22, 40], [-28, 50]],
    [[3, -43], [-10, -38], [-23, -35]],
    [[17, 3], [30, 0], [44, -4]]
  ];
  var ROADS = (DATA.underwayRoutes || []).concat(EXTRA_ROADS).map(function (r) { return makeLine(r, 1.5, 1.4); });
  function roadDist(x, z) {
    var best = 99;
    for (var i = 0; i < ROADS.length; i++) {
      if (!inBox(ROADS[i], x, z)) continue;
      var d = distToPolyline(x, z, ROADS[i].pts);
      if (d < best) best = d;
    }
    return best;
  }

  // NNE → SSW spine of the World's Edge Mountains
  function spineCenterX(z) { return -0.22 * z + 5.5 * Math.sin(z * 0.043); }

  // Magma rifts through Death Pass around Karag Dron
  function lavaFactor(x, z) {
    if (z < 12 || z > 60 || x < -38 || x > 28) return 0;
    var d1 = Math.abs(z - (27 - 0.34 * x + 3.6 * Math.sin(x * 0.16)));
    var d2 = (z > 23 && z < 50) ? Math.abs(x - (-3 + 0.25 * (z - 28) + 2.8 * Math.sin(z * 0.22))) : 99;
    var d = Math.min(d1, d2), W = 3.4;
    if (d > W) return 0;
    var env = clamp01(1 - Math.abs(z - 34) / 22);
    return Math.pow(1 - d / W, 1.5) * env;
  }

  var ALL_CITIES = [];
  DATA.provinces.forEach(function (p) {
    p.cities.forEach(function (c) { ALL_CITIES.push({ city: c, prov: p, x: c.coords.x, z: c.coords.z }); });
  });

  function terrainHeight(x, z) {
    var sx = spineCenterX(z), dx = x - sx;
    var massif = Math.exp(-(dx * dx) / (dx < 0 ? 1150 : 920));
    var ridge = ridgedFbm(x * 0.048 + 11.3, z * 0.048 - 7.1, 4);
    var detail = ridgedFbm(x * 0.13 - 4.2, z * 0.13 + 9.4, 3);
    var hills = fbm(x * 0.035 + 3.1, z * 0.035 + 5.7, 3);

    var h = 2.1 + hills * 3.2 + massif * (4.5 + ridge * 17.5 + detail * 3.6);
    h += massif * Math.max(0, (-z - 22) / 58) * 4.2 * ridge;          // taller northern peaks
    if (dx > 28) h += smoothstep(28, 60, dx) * hills * 5;               // rough Dark Lands uplands

    // The Silver Road valley: Karaz-a-Karak → Mount Squighorn
    if (x > -26 && x < 25) {
      var dSr = Math.abs(z - (-10 + ((x + 18) / 35) * 13));
      if (dSr < 8.5) { var cut = 1 - dSr / 8.5; h = h * (1 - 0.36 * cut * cut) + 1.8 * cut; }
    }

    // Ring of eight peaks around Karak Eight Peaks
    var k8x = -5, k8z = 59;
    if (Math.hypot(x - k8x, z - k8z) < 20) {
      for (var k = 0; k < 8; k++) {
        var ang = k * (Math.PI / 4) + 0.38;
        var px = k8x + Math.cos(ang) * 11.2, pz = k8z + Math.sin(ang) * 10.6;
        var dp = Math.hypot(x - px, z - pz);
        if (dp < 6.4) { var pk = 1 - dp / 6.4; h += (Math.sin(ang) > 0.55 ? 6.8 : 11.8) * pk * pk * (0.75 + 0.35 * detail); }
      }
    }

    // Hold terraces + a snowy crag behind each hold
    for (var i = 0; i < ALL_CITIES.length; i++) {
      var c = ALL_CITIES[i], dc = Math.hypot(x - c.x, z - c.z);
      if (dc < 6.8) {
        var t = 1 - dc / 6.8, sm = t * t * (3 - 2 * t);
        h = h * (1 - sm * 0.72) + (c.city.isCapital ? 7.4 : 6.4) * sm * 0.72;
      }
      var db = Math.hypot((x - c.x) * 0.75, z - (c.z - 8.2));
      if (db < 8.5) { var tb = 1 - db / 8.5; h += (c.city.isCapital ? 8.8 : 6.4) * tb * tb * (0.7 + 0.4 * ridge); }
    }

    h = Math.max(1.85, h);

    // Rivers and lakes carve below the water line
    for (var r = 0; r < RIVERS.length; r++) {
      var rv = RIVERS[r];
      if (!inBox(rv, x, z)) continue;
      var d = distToPolyline(x, z, rv.pts) / rv.w;
      if (d < 4) h = Math.min(h, 0.6 + d * d * 1.2);
    }
    for (var l = 0; l < LAKES.length; l++) {
      var q = Math.hypot((x - LAKES[l].x) / LAKES[l].rx, (z - LAKES[l].z) / LAKES[l].rz);
      if (q < 2.6) h = Math.min(h, 0.5 + q * q * 1.3);
    }

    var lava = lavaFactor(x, z);
    if (lava > 0) h = Math.max(1.9, h - lava * 3.2);                     // shallow magma trench
    return h;
  }

  function slopeAt(x, z) {
    var e = 0.6;
    return Math.hypot(terrainHeight(x + e, z) - terrainHeight(x - e, z), terrainHeight(x, z + e) - terrainHeight(x, z - e)) / (2 * e);
  }

  function terrainColor(x, z, h, slope) {
    var lava = lavaFactor(x, z);
    var n = fbm(x * 0.11 + 2.2, z * 0.11 - 3.4, 2);
    var n2 = valueNoise(x * 0.7, z * 0.7);
    var sx = spineCenterX(z);

    // granite
    var r = 0.34 + n * 0.10, g = 0.32 + n * 0.09, b = 0.30 + n * 0.08;

    // meadow / forest floor on gentle lower slopes
    var grass = smoothstep(1.05, 0.45, slope) * smoothstep(11.5, 5.5, h);
    var gr = 0.24 + n * 0.08, gg = 0.33 + n * 0.09, gb = 0.16 + n * 0.05;
    if (x > sx + 10) { gr = 0.33 + n * 0.07; gg = 0.30 + n * 0.06; gb = 0.21 + n * 0.04; }   // drier eastern slopes
    var south = smoothstep(14, 42, z);                                                         // Badlands ochre
    gr = mix(gr, 0.45 + n * 0.08, south); gg = mix(gg, 0.35 + n * 0.06, south); gb = mix(gb, 0.22 + n * 0.04, south);
    r = mix(r, gr, grass); g = mix(g, gg, grass); b = mix(b, gb, grass);

    // cliffs
    if (slope > 0.9) { var cl = Math.min(1, (slope - 0.9) / 1.3); r *= 1 - cl * 0.28; g *= 1 - cl * 0.27; b *= 1 - cl * 0.24; }

    // shores
    if (h < 2.25) { var bank = smoothstep(2.25, 1.45, h) * 0.75; r = mix(r, 0.40, bank); g = mix(g, 0.36, bank); b = mix(b, 0.27, bank); }

    // roads
    var rd = roadDist(x, z);
    if (rd < 0.95) { var rt = smoothstep(0.95, 0.3, rd) * 0.85; r = mix(r, 0.50, rt); g = mix(g, 0.41, rt); b = mix(b, 0.29, rt); }

    // ash fields around the magma
    if (lava > 0) { var ash = Math.min(1, lava * 3); r = mix(r, 0.17, ash); g = mix(g, 0.13, ash); b = mix(b, 0.12, ash); }

    // snow only on the high peaks (lower in the frozen north)
    var snowLine = 16.5 + Math.max(-3.5, Math.min(3.6, z * 0.055)) - n * 2.2;
    if (h > snowLine && lava < 0.05) {
      var sn = smoothstep(0, 3.6, h - snowLine) * Math.max(0.2, 1 - Math.max(0, slope - 1.1) * 0.55);
      r = mix(r, 0.88 + n * 0.07, sn); g = mix(g, 0.90 + n * 0.06, sn); b = mix(b, 0.95 + n * 0.04, sn);
    }

    if (lava > 0.55) { var lc = smoothstep(0.55, 0.9, lava); r = mix(r, 0.6, lc); g = mix(g, 0.15, lc); b = mix(b, 0.04, lc); }

    var v = 0.94 + n2 * 0.12; r *= v; g *= v; b *= v;

    // fog of war: unexplored land turns grey
    var fw = smoothstep(0.8, 1.06, fowDist(x, z));
    if (fw > 0) {
      var lum = r * 0.3 + g * 0.59 + b * 0.11, grey = 0.4 + lum * 0.42;
      r = mix(r, grey, fw); g = mix(g, grey + 0.01, fw); b = mix(b, grey + 0.03, fw);
    }
    return [r, g, b];
  }

  function pointInPoly(px, pz, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
      if (((zi > pz) !== (zj > pz)) && (px < ((xj - xi) * (pz - zi)) / (zj - zi + 1e-9) + xi)) inside = !inside;
    }
    return inside;
  }

  /* ===================== STATE & CAMERA ===================== */
  var state = {
    tier: "strategic",
    activeProvinceId: null,
    hoveredProvinceId: null,
    activeCityId: null,
    activeOptionIdx: 0
  };

  function strategicView() {
    return { x: 0, y: 5, z: -2, yaw: -0.17, pitch: 1.0, dist: isCompact() ? 225 : 195 };
  }
  var sv = strategicView();
  var camRig = {
    target: { x: sv.x, y: sv.y, z: sv.z }, yaw: sv.yaw, pitch: sv.pitch, dist: sv.dist,
    goalTarget: { x: sv.x, y: sv.y, z: sv.z }, goalYaw: sv.yaw, goalPitch: sv.pitch, goalDist: sv.dist
  };
  function setGoal(x, y, z, yaw, pitch, dist) {
    camRig.goalTarget.x = x; camRig.goalTarget.y = y; camRig.goalTarget.z = z;
    camRig.goalYaw = yaw; camRig.goalPitch = pitch; camRig.goalDist = dist;
  }

  function getProvince(id) {
    for (var i = 0; i < DATA.provinces.length; i++) if (DATA.provinces[i].id === id) return DATA.provinces[i];
    return null;
  }
  function provinceIndex(id) {
    for (var i = 0; i < DATA.provinces.length; i++) if (DATA.provinces[i].id === id) return i;
    return -1;
  }
  function findCity(cityId) {
    for (var i = 0; i < DATA.provinces.length; i++) {
      var p = DATA.provinces[i];
      for (var j = 0; j < p.cities.length; j++) if (p.cities[j].id === cityId) return { province: p, city: p.cities[j] };
    }
    return null;
  }

  /* ===================== DOM ===================== */
  var $ = function (id) { return document.getElementById(id); };
  var stageEl = $("map-stage"), canvasEl = $("webgl-canvas"), markerLayer = $("marker-layer");
  var tooltipEl = $("twTooltip"), returnBtn = $("returnBtn"), minimapSvg = $("minimap-svg"), minimapLabel = $("minimapLabel");
  var bookEl = $("book"), bookToc = $("bookToc"), bookPage = $("bookPage");
  var buildingInfo = $("buildingInfo");

  /* ===================== PLAQUE ===================== */
  $("plaqueName").textContent = DATA.identity.name;
  $("plaqueScript").textContent = DATA.identity.siteDescription || DATA.identity.tagline;

  /* ===================== MAP MARKERS ===================== */
  var markers = { provinces: [], cities: [], landmarks: [] };

  function buildMarkers() {
    var frag = document.createDocumentFragment();

    DATA.provinces.forEach(function (prov) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-label";
      btn.dataset.provinceId = prov.id;
      btn.setAttribute("aria-label", prov.category + " — " + prov.loreName + ". Enter province.");
      btn.innerHTML =
        '<span class="map-label__lore">' + esc(prov.loreName) + "</span>" +
        '<span class="map-label__rule" aria-hidden="true"></span>' +
        '<span class="map-label__cat">' + esc(prov.category) + "</span>" +
        '<span class="map-label__hint">' + prov.cities.length + " holds · enter</span>";
      btn.addEventListener("click", function (e) { e.stopPropagation(); hideTooltip(); enterProvince(prov.id); });
      btn.addEventListener("pointerenter", function (e) { setHoveredProvince(prov.id); showProvinceTooltip(prov, e.clientX, e.clientY); });
      btn.addEventListener("pointermove", function (e) { moveTooltip(e.clientX, e.clientY); });
      btn.addEventListener("pointerleave", function () { setHoveredProvince(null); hideTooltip(); });
      frag.appendChild(btn);
      var la = prov.labelAt || prov.center;
      markers.provinces.push({ el: btn, x: la.x, y: terrainHeight(la.x, la.z) + 3, z: la.z, anchor: "center" });
    });

    DATA.provinces.forEach(function (prov) {
      prov.cities.forEach(function (city) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "settle" + (city.isCapital ? " is-capital" : "");
        btn.dataset.cityId = city.id;
        btn.style.setProperty("--prov-color", prov.color);
        btn.setAttribute("aria-label", city.title + " — " + city.holdName);
        btn.innerHTML =
          '<span class="settle__plate">' +
            '<span class="settle__shield">' + esc(city.tier) + "</span>" +
            '<span class="settle__text"><span class="settle__name">' + esc(city.title) + '</span><span class="settle__hold">' + esc(city.holdName) + "</span></span>" +
          "</span>" +
          '<span class="settle__stem" aria-hidden="true"></span>';
        btn.addEventListener("click", function (e) {
          e.stopPropagation(); hideTooltip();
          if (state.tier === "strategic") enterProvince(prov.id); else openCity(city.id, 0);
        });
        btn.addEventListener("pointerenter", function (e) { setHoveredProvince(prov.id); showCityTooltip(city, prov, e.clientX, e.clientY); });
        btn.addEventListener("pointermove", function (e) { moveTooltip(e.clientX, e.clientY); });
        btn.addEventListener("pointerleave", function () { setHoveredProvince(null); hideTooltip(); });
        frag.appendChild(btn);
        markers.cities.push({
          el: btn, city: city, prov: prov, anchor: "bottom",
          x: city.coords.x, y: terrainHeight(city.coords.x, city.coords.z) + (city.isCapital ? 7.6 : 6.2), z: city.coords.z
        });
      });
    });

    (DATA.landmarks || []).forEach(function (lm) {
      var div = document.createElement("div");
      div.className = "lm lm--" + (lm.type || "label");
      div.setAttribute("aria-hidden", "true");
      div.textContent = lm.name;
      frag.appendChild(div);
      var lift = lm.type === "region" ? 14 : lm.type === "water" ? 1.2 : (lm.type === "label" ? 2.5 : 4.2);
      var baseY = lm.type === "water" ? WATER_Y : terrainHeight(lm.coords.x, lm.coords.z);
      markers.landmarks.push({ el: div, x: lm.coords.x, y: baseY + lift, z: lm.coords.z, anchor: "center" });
    });

    markerLayer.appendChild(frag);
  }

  /* ===================== TOOLTIP ===================== */
  function showProvinceTooltip(prov, cx, cy) {
    tooltipEl.innerHTML =
      '<div class="tt-head"><span class="tt-title">' + esc(prov.loreName) + '</span><span class="tt-side">' + esc(prov.faction) + "</span></div>" +
      '<div class="tt-rows">' +
        "<div><span>Discipline:</span> " + esc(prov.category) + "</div>" +
        "<div><span>Holds:</span> " + prov.cities.map(function (c) { return esc(c.title); }).join(", ") + "</div>" +
        "<div><span>Terrain:</span> " + esc(prov.climate) + "</div>" +
        "<div><span>Arsenal:</span> " + esc(prov.windsOfMagic) + "</div>" +
      "</div>" +
      '<div class="tt-tag">' + esc(prov.summary) + "</div>";
    tooltipEl.classList.add("is-visible");
    moveTooltip(cx, cy);
  }
  function showCityTooltip(city, prov, cx, cy) {
    tooltipEl.innerHTML =
      '<div class="tt-head"><span class="tt-title">' + esc(city.holdName) + '</span><span class="tt-side">Tier ' + esc(city.tier) + "</span></div>" +
      '<div class="tt-rows">' +
        "<div><span>Project:</span> " + esc(city.title) + "</div>" +
        "<div><span>Province:</span> " + esc(prov.loreName) + "</div>" +
        "<div><span>Terrain:</span> " + esc(city.terrain) + "</div>" +
        "<div><span>Constructions:</span> " + city.constructionOptions.length + "</div>" +
      "</div>" +
      '<div class="tt-tag">' + esc(city.tagline) + "</div>";
    tooltipEl.classList.add("is-visible");
    moveTooltip(cx, cy);
  }
  function moveTooltip(cx, cy) {
    var w = 304, h = tooltipEl.offsetHeight || 180;
    var x = cx + 18, y = cy + 16;
    if (x + w + 16 > window.innerWidth) x = cx - w - 16;
    if (y + h + 16 > window.innerHeight) y = cy - h - 14;
    tooltipEl.style.transform = "translate3d(" + Math.max(8, x) + "px," + Math.max(8, y) + "px,0)";
  }
  function hideTooltip() { tooltipEl.classList.remove("is-visible"); }

  /* ===================== MINIMAP ===================== */
  var minimapReticle = null;
  function buildMinimap() {
    var s = '<defs><radialGradient id="mmFog" cx="50%" cy="50%" r="50%">' +
      '<stop offset="62%" stop-color="#9a9b98" stop-opacity="0"/><stop offset="100%" stop-color="#8d9091" stop-opacity="0.95"/></radialGradient></defs>';

    // mountain spine
    var spine = [];
    for (var z = -92; z <= 92; z += 8) spine.push(spineCenterX(z).toFixed(1) + "," + z);
    s += '<polyline points="' + spine.join(" ") + '" fill="none" stroke="rgba(70,50,25,0.28)" stroke-width="20" stroke-linecap="round"/>';
    s += '<polyline points="' + spine.join(" ") + '" fill="none" stroke="rgba(60,40,18,0.5)" stroke-width="2" stroke-dasharray="3 3"/>';

    RIVERS.forEach(function (rv) {
      s += '<polyline points="' + rv.pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="none" stroke="#4f7488" stroke-width="' + (rv.w * 0.9).toFixed(1) + '" stroke-linecap="round"/>';
    });
    LAKES.forEach(function (l) { s += '<ellipse cx="' + l.x + '" cy="' + l.z + '" rx="' + l.rx + '" ry="' + l.rz + '" fill="#4f7488"/>'; });

    DATA.provinces.forEach(function (prov) {
      var pts = prov.border.map(function (p) { return p[0] + "," + p[1]; }).join(" ");
      s += '<polygon class="mm-prov" data-mm-prov="' + prov.id + '" points="' + pts + '" fill="' + prov.color + '"/>';
    });

    ROADS.forEach(function (rd) {
      s += '<polyline points="' + rd.pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="none" stroke="#3a2610" stroke-width="0.9" stroke-dasharray="2 1.6" opacity="0.75" pointer-events="none"/>';
    });

    ALL_CITIES.forEach(function (c) {
      s += c.city.isCapital
        ? '<rect x="' + (c.x - 2.8) + '" y="' + (c.z - 2.8) + '" width="5.6" height="5.6" fill="#f6ead0" stroke="#1e1408" stroke-width="1.1" pointer-events="none"/>'
        : '<circle cx="' + c.x + '" cy="' + c.z + '" r="2.3" fill="#f6ead0" stroke="#1e1408" stroke-width="1" pointer-events="none"/>';
    });

    s += '<ellipse cx="' + WORLD.cx + '" cy="' + WORLD.cz + '" rx="' + (WORLD.rx * 1.25) + '" ry="' + (WORLD.rz * 1.18) + '" fill="url(#mmFog)" pointer-events="none"/>';
    s += '<g id="mmReticle" pointer-events="none"><rect x="-14" y="-10" width="28" height="20" fill="rgba(224,71,47,0.10)" stroke="#a8231b" stroke-width="1.6"/></g>';

    minimapSvg.innerHTML = s;
    minimapReticle = $("mmReticle");
    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (poly) {
      poly.addEventListener("click", function (e) { e.stopPropagation(); enterProvince(poly.getAttribute("data-mm-prov")); });
      poly.addEventListener("pointerenter", function () { setHoveredProvince(poly.getAttribute("data-mm-prov")); });
      poly.addEventListener("pointerleave", function () { setHoveredProvince(null); });
    });
  }
  function updateMinimapReticle() {
    if (!minimapReticle) return;
    var sc = Math.max(0.5, Math.min(2.6, camRig.dist / 60));
    minimapReticle.setAttribute("transform", "translate(" + camRig.target.x.toFixed(1) + " " + camRig.target.z.toFixed(1) + ") scale(" + sc.toFixed(2) + ")");
  }

  /* ===================== NAVIGATION ===================== */
  function syncTier() {
    document.body.setAttribute("data-tier", state.tier);

    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (el) {
      var id = el.getAttribute("data-mm-prov");
      el.classList.toggle("is-active", id === state.activeProvinceId);
      el.classList.toggle("is-hover", id === state.hoveredProvinceId);
    });

    markers.cities.forEach(function (m) {
      var inProv = !state.activeProvinceId || m.prov.id === state.activeProvinceId;
      m.el.classList.toggle("is-dimmed", state.tier !== "strategic" && !inProv);
      m.el.classList.toggle("is-selected", state.tier === "settlement" && m.city.id === state.activeCityId);
    });

    var prov = getProvince(state.activeProvinceId);
    if (state.tier === "strategic") {
      returnBtn.hidden = true;
      minimapLabel.textContent = "World's Edge";
    } else if (state.tier === "province") {
      returnBtn.hidden = false;
      returnBtn.textContent = "‹ Return to the World Map";
      minimapLabel.textContent = prov ? prov.loreName : "Province";
    } else {
      var found = findCity(state.activeCityId);
      returnBtn.hidden = false;
      returnBtn.textContent = "‹ Back to " + (prov ? prov.loreName : "Province");
      minimapLabel.textContent = found ? found.city.holdName : "Hold";
    }

    updateWorldHighlights();
  }

  function goStrategic() {
    state.tier = "strategic";
    state.activeProvinceId = null;
    state.activeCityId = null;
    var v = strategicView();
    setGoal(v.x, v.y, v.z, v.yaw, v.pitch, v.dist);
    syncTier();
  }

  function enterProvince(provinceId) {
    var prov = getProvince(provinceId);
    if (!prov) return;
    state.tier = "province";
    state.activeProvinceId = prov.id;
    state.activeCityId = null;
    setGoal(prov.center.x, terrainHeight(prov.center.x, prov.center.z) * 0.6 + 2, prov.center.z + 2, -0.14, 0.68, isCompact() ? 80 : 58);
    syncTier();
  }

  function openCity(cityId, optionIdx) {
    var found = findCity(cityId);
    if (!found) return;
    state.tier = "settlement";
    state.activeProvinceId = found.province.id;
    state.activeCityId = found.city.id;
    state.activeOptionIdx = optionIdx || 0;

    // Frame the hold in the open space above the construction bar and right of the info panel
    var c = found.city.coords, h = terrainHeight(c.x, c.z), compact = isCompact();
    setGoal(c.x - (compact ? 0 : 6.5), h + 1, c.z + (compact ? 10 : 4), -0.11, 0.62, compact ? 52 : 38);

    renderSettlement(found.province, found.city);
    syncTier();
  }

  function stepBack() {
    if (state.tier === "settlement" && state.activeProvinceId) enterProvince(state.activeProvinceId);
    else if (state.tier === "province") goStrategic();
  }

  /* ===================== SETTLEMENT UI ===================== */
  function renderSettlement(prov, city) {
    $("sbProvince").innerHTML =
      '<span class="sb-province__lore">' + esc(prov.loreName) + '</span><span class="sb-province__cat">' + esc(prov.category) + "</span>";

    var tabs = "";
    prov.cities.forEach(function (c) {
      tabs += '<button type="button" role="tab" aria-selected="' + (c.id === city.id) + '" class="sb-tab' + (c.id === city.id ? " is-active" : "") + '" data-switch-city="' + c.id + '">' + esc(c.holdName) + "</button>";
    });
    var tabsEl = $("sbTabs");
    tabsEl.innerHTML = tabs;
    Array.prototype.forEach.call(tabsEl.querySelectorAll("[data-switch-city]"), function (b) {
      b.addEventListener("click", function () { openCity(b.getAttribute("data-switch-city"), 0); });
    });

    var cityEl = $("sbCity");
    cityEl.style.setProperty("--prov-color", prov.color);
    cityEl.innerHTML =
      '<div class="sb-city__shield" aria-hidden="true">' + esc(city.tier) + "</div>" +
      "<div>" +
        '<div class="sb-city__hold">' + esc(city.holdName) + "</div>" +
        '<h2 class="sb-city__title">' + esc(city.title) + "</h2>" +
        '<p class="sb-city__tag">' + esc(city.tagline) + "</p>" +
      "</div>";

    var opts = city.constructionOptions || [];
    var slots = "";
    opts.forEach(function (o, i) {
      var sel = i === state.activeOptionIdx;
      slots +=
        '<button type="button" role="tab" aria-selected="' + sel + '" class="slot' + (sel ? " is-selected" : "") + '" data-opt-idx="' + i + '">' +
          '<span class="slot__art" aria-hidden="true">' + (ICONS[o.icon] || ICONS.citadel) +
            '<span class="slot__tier">' + esc(o.tier) + "</span>" +
            '<span class="slot__type">' + esc(o.slotType) + "</span>" +
          "</span>" +
          '<span class="slot__name">' + esc(o.topic) + "</span>" +
        "</button>";
    });
    var slotsEl = $("sbSlots");
    slotsEl.innerHTML = slots;
    Array.prototype.forEach.call(slotsEl.querySelectorAll("[data-opt-idx]"), function (b) {
      b.addEventListener("click", function () {
        state.activeOptionIdx = +b.getAttribute("data-opt-idx");
        renderSettlement(prov, city);
      });
    });

    renderBuildingInfo(city, opts[state.activeOptionIdx] || opts[0]);
  }

  function renderBuildingInfo(city, o) {
    if (!o) { buildingInfo.innerHTML = ""; return; }
    var tierN = TIER_NUM[o.tier] || 1, pips = "";
    for (var i = 1; i <= 5; i++) pips += '<i class="' + (i <= tierN ? "on" : "") + '"></i>';

    var effects = (o.effects || []).map(function (e) { return "<li><span><strong>" + esc(e[0]) + "</strong> " + esc(e[1]) + "</span></li>"; }).join("");
    var unlocks = (o.unlocks || []).map(function (u) { return "<span>" + esc(u) + "</span>"; }).join("");

    var actions = "";
    if (o.links && o.links.length) {
      actions = o.links.map(function (l) {
        return '<a class="tw-btn" href="' + esc(l.url) + '"' + (l.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + esc(l.label) + "</a>";
      }).join("");
    } else if (city.repoUrl) {
      var mail = city.repoUrl.indexOf("mailto:") === 0;
      actions = '<a class="tw-btn" href="' + esc(city.repoUrl) + '"' + (mail ? "" : ' target="_blank" rel="noopener noreferrer"') + ">" + (mail ? "Write to me →" : "Source on GitHub ↗") + "</a>";
    }

    buildingInfo.innerHTML =
      '<div class="bi-ribbon"><span>' + esc(o.slotType) + '</span><span class="bi-tier" title="Tier ' + esc(o.tier) + '">' + pips + "</span></div>" +
      '<div class="bi-scroll">' +
        '<p class="bi-building">' + esc(o.buildingName) + "</p>" +
        '<h3 class="bi-title">' + esc(o.topic) + "</h3>" +
        '<div class="bi-stats"><span><i>Cost</i>' + esc(o.cost) + "</span><span><i>Status</i>" + esc(o.turns) + "</span></div>" +
        '<p class="bi-desc">' + esc(o.description) + "</p>" +
        (effects ? '<div class="bi-label">Effects</div><ul class="bi-effects">' + effects + "</ul>" : "") +
        (unlocks ? '<div class="bi-label">Built with</div><div class="bi-chips">' + unlocks + "</div>" : "") +
        (actions ? '<div class="bi-actions">' + actions + "</div>" : "") +
      "</div>";
    var sc = buildingInfo.querySelector(".bi-scroll");
    if (sc) sc.scrollTop = 0;
  }

  /* ===================== BOOK OF WORKS (plain reader) ===================== */
  function buildBook() {
    var id = DATA.identity;
    var toc = '<div class="toc__title">Contents</div><p class="toc__sub">The whole map, written plainly.</p><ol class="toc__list">' +
      '<li class="toc__chapter"><a href="#bk-preface" data-bk="bk-preface"><span class="toc__num">·</span>Preface</a></li>';

    var page = '<div class="bk-measure">' +
      '<header id="bk-preface">' +
        '<p class="bk-eyebrow" id="bookTitle">The Book of Works</p>' +
        '<h2 class="bk-title">' + esc(id.name) + "</h2>" +
        '<p class="bk-lede">' + esc(id.tagline) + "</p>" +
        '<p class="bk-contact"><a href="mailto:' + esc(id.email) + '">' + esc(id.email) + '</a><a href="' + esc(id.github) + '" target="_blank" rel="noopener noreferrer">github.com/' + esc(id.handle) + "</a></p>" +
      "</header>";

    DATA.provinces.forEach(function (p, pi) {
      var cid = "bk-" + p.id;
      toc += '<li class="toc__chapter"><a href="#' + cid + '" data-bk="' + cid + '"><span class="toc__num">' + ROMAN[pi] + "</span>" + esc(p.category) + "</a><ol>";
      page += '<div class="bk-orn" aria-hidden="true"><span></span></div>' +
        '<section class="bk-chapter" id="' + cid + '">' +
          '<p class="bk-chapter__num">Chapter ' + ROMAN[pi] + " · " + esc(p.loreName) + "</p>" +
          '<h2 class="bk-chapter__title">' + esc(p.category) + "</h2>" +
          '<p class="bk-chapter__sum">' + esc(p.summary) + "</p>";

      p.cities.forEach(function (c) {
        var sid = "bk-" + c.id;
        toc += '<li><a href="#' + sid + '" data-bk="' + sid + '">' + esc(c.title) + "</a></li>";
        page += '<article class="bk-entry" id="' + sid + '">' +
          '<h3 class="bk-entry__title">' + esc(c.title) + "</h3>" +
          '<p class="bk-entry__meta">' + esc(c.holdName) + (c.repoPath ? " · " + esc(c.repoPath) : "") + "</p>" +
          '<p class="bk-entry__tag">' + esc(c.tagline) + "</p>" +
          '<div class="bk-chips">' + (c.stack || []).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>";

        c.constructionOptions.forEach(function (o) {
          page += '<section class="bk-part">' +
            '<h4 class="bk-part__title">' + esc(o.topic) + "</h4>" +
            '<p class="bk-part__desc">' + esc(o.description) + "</p>" +
            '<ul class="bk-list">' + (o.effects || []).map(function (e) { return "<li><strong>" + esc(e[0]) + "</strong> " + esc(e[1]) + "</li>"; }).join("") + "</ul>" +
            (o.links && o.links.length
              ? '<div class="bk-foot">' + o.links.map(function (l) { return '<a class="bk-link" href="' + esc(l.url) + '"' + (l.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + esc(l.label) + "</a>"; }).join("") + "</div>"
              : "") +
          "</section>";
        });

        if (c.repoUrl && c.repoUrl.indexOf("mailto:") !== 0) {
          page += '<div class="bk-foot"><a class="bk-link" href="' + esc(c.repoUrl) + '" target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a></div>';
        }
        page += "</article>";
      });
      page += "</section>";
      toc += "</ol></li>";
    });
    toc += "</ol>";
    page += "</div>";

    bookToc.innerHTML = toc;
    bookPage.innerHTML = page;

    Array.prototype.forEach.call(bookToc.querySelectorAll("[data-bk]"), function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = $(a.getAttribute("data-bk"));
        if (!target) return;
        var top = target.getBoundingClientRect().top - bookPage.getBoundingClientRect().top + bookPage.scrollTop - 24;
        if (bookPage.scrollTo) bookPage.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
        else bookPage.scrollTop = top;
      });
    });
    bookPage.addEventListener("scroll", updateBookSpy);
  }

  function updateBookSpy() {
    var links = bookToc.querySelectorAll("[data-bk]"), current = null;
    var pageTop = bookPage.getBoundingClientRect().top;
    Array.prototype.forEach.call(links, function (a) {
      var t = $(a.getAttribute("data-bk"));
      if (t && t.getBoundingClientRect().top - pageTop < 120) current = a;
    });
    Array.prototype.forEach.call(links, function (a) { a.classList.toggle("is-active", a === current); });
  }

  function openBook() {
    hideTooltip();
    bookEl.classList.add("is-open");
    bookEl.setAttribute("aria-hidden", "false");
    try { bookPage.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    updateBookSpy();
  }
  function closeBook() {
    bookEl.classList.remove("is-open");
    bookEl.setAttribute("aria-hidden", "true");
    try { $("bookOpenBtn").focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function bookIsOpen() { return bookEl.classList.contains("is-open"); }

  /* ===================== THREE.JS WORLD ===================== */
  var hasThree = typeof window.THREE !== "undefined";
  var renderer = null, scene = null, camera = null, terrainMesh = null;
  var terrainColorAttr = null, baseColors = null, vertProv = null;
  var borderMeshes = {}, holdRings = {}, holdHits = [];
  var cloudMats = [], lavaMats = [], lavaLight = null, smoke = [];
  var lastTintKey = "";

  function setHoveredProvince(pid) {
    if (state.hoveredProvinceId === pid) return;
    state.hoveredProvinceId = pid;
    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (el) {
      el.classList.toggle("is-hover", el.getAttribute("data-mm-prov") === pid);
    });
    updateWorldHighlights();
  }

  var RED_CORE = 0xff5a3c, RED_GLOW = 0xc0281c;
  function updateWorldHighlights() {
    if (!hasThree || !scene) return;

    DATA.provinces.forEach(function (prov) {
      var b = borderMeshes[prov.id];
      if (!b) return;
      var hov = prov.id === state.hoveredProvinceId, act = prov.id === state.activeProvinceId;
      b.core.material.color.set(hov || act ? RED_CORE : (prov.accent || prov.color));
      b.core.material.opacity = hov ? 1 : act ? 0.95 : 0.75;
      b.glow.material.color.set(hov || act ? RED_GLOW : prov.color);
      b.glow.material.opacity = hov ? 0.8 : act ? 0.55 : 0.32;
    });

    Object.keys(holdRings).forEach(function (cid) {
      holdRings[cid].visible = state.tier === "settlement" && state.activeCityId === cid;
    });

    // Terrain tint: red wash on the hovered province, dim the land outside the open province
    var hovIdx = provinceIndex(state.hoveredProvinceId), actIdx = provinceIndex(state.activeProvinceId);
    var focus = state.tier !== "strategic";
    var key = hovIdx + "|" + actIdx + "|" + focus;
    if (key === lastTintKey || !terrainColorAttr) return;
    lastTintKey = key;
    var arr = terrainColorAttr.array, n = vertProv.length;
    for (var i = 0; i < n; i++) {
      var r = baseColors[i * 3], g = baseColors[i * 3 + 1], b2 = baseColors[i * 3 + 2], p = vertProv[i];
      if (p >= 0 && p === hovIdx && p !== actIdx) { r = mix(r, 0.78, 0.2); g = mix(g, 0.14, 0.2); b2 = mix(b2, 0.1, 0.2); }
      if (focus && p !== actIdx) { r *= 0.74; g *= 0.74; b2 *= 0.76; }
      arr[i * 3] = r; arr[i * 3 + 1] = g; arr[i * 3 + 2] = b2;
    }
    terrainColorAttr.needsUpdate = true;
  }

  // Tileable value-noise canvas (used for clouds and lava)
  function noiseCanvas(size, period, octaves, seedOff) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d"), img = ctx.createImageData(size, size), d = img.data;
    function ph(ix, iy, p) { ix = ((ix % p) + p) % p; iy = ((iy % p) + p) % p; return hash2(ix + seedOff, iy - seedOff * 0.7); }
    function pn(x, y, p) {
      var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      var a = ph(ix, iy, p), b = ph(ix + 1, iy, p), cc = ph(ix, iy + 1, p), dd = ph(ix + 1, iy + 1, p);
      return a + (b - a) * ux + (cc - a) * uy + (a - b - cc + dd) * ux * uy;
    }
    var vals = new Float32Array(size * size);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var v = 0, amp = 0.5, f = period, norm = 0;
        for (var o = 0; o < octaves; o++) { v += pn(x / size * f, y / size * f, f) * amp; norm += amp; amp *= 0.5; f *= 2; }
        vals[y * size + x] = v / norm;
      }
    }
    return { canvas: c, ctx: ctx, img: img, data: d, vals: vals };
  }

  function makeCloudTexture() {
    var n = noiseCanvas(256, 4, 5, 17);
    for (var i = 0; i < n.vals.length; i++) {
      var v = Math.round(n.vals[i] * 255);
      n.data[i * 4] = n.data[i * 4 + 1] = n.data[i * 4 + 2] = v; n.data[i * 4 + 3] = 255;
    }
    n.ctx.putImageData(n.img, 0, 0);
    var t = new THREE.CanvasTexture(n.canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  var _noiseTex = null;
  function sharedNoise() { return _noiseTex || (_noiseTex = makeCloudTexture()); }

  function gradientTexture(soft) {
    var c = document.createElement("canvas");
    c.width = 4; c.height = 64;
    var ctx = c.getContext("2d"), img = ctx.createImageData(4, 64);
    for (var y = 0; y < 64; y++) {
      var u = Math.abs((y + 0.5) / 64 * 2 - 1);
      var a = soft ? Math.pow(1 - u, 1.8) : 1 - smoothstep(0.45, 1, u);
      for (var x = 0; x < 4; x++) { var k = (y * 4 + x) * 4; img.data[k] = img.data[k + 1] = img.data[k + 2] = 255; img.data[k + 3] = Math.round(a * 255); }
    }
    ctx.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(c);
  }

  function ribbonGeometry(pts, width, lift, closed) {
    var n = pts.length, count = closed ? n + 1 : n;
    var pos = new Float32Array(count * 6), uv = new Float32Array(count * 4), idx = [];
    for (var k = 0; k < count; k++) {
      var i = k % n;
      var prev = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
      var next = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
      var tx = next[0] - prev[0], tz = next[1] - prev[1], tl = Math.hypot(tx, tz) || 1;
      var nx = -tz / tl * width / 2, nz = tx / tl * width / 2;
      var lx = pts[i][0] + nx, lz = pts[i][1] + nz, rx = pts[i][0] - nx, rz = pts[i][1] - nz;
      pos[k * 6] = lx; pos[k * 6 + 1] = Math.max(terrainHeight(lx, lz), WATER_Y) + lift; pos[k * 6 + 2] = lz;
      pos[k * 6 + 3] = rx; pos[k * 6 + 4] = Math.max(terrainHeight(rx, rz), WATER_Y) + lift; pos[k * 6 + 5] = rz;
      uv[k * 4] = k / (count - 1); uv[k * 4 + 1] = 0; uv[k * 4 + 2] = k / (count - 1); uv[k * 4 + 3] = 1;
      if (k < count - 1) { var a = k * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }

  function initThree() {
    if (!hasThree) return false;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: "high-performance" });
    } catch (err) { hasThree = false; return false; }

    var compact = isCompact();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    var FOG = 0x8f9497;
    renderer.setClearColor(FOG, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(FOG, 150, 420);
    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 1, 900);

    scene.add(new THREE.HemisphereLight(0xd6e2f0, 0x3a2c20, 0.7));
    var sun = new THREE.DirectionalLight(0xfff0d6, 1.12);
    sun.position.set(-80, 120, 55);
    sun.castShadow = true;
    sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
    var sc = sun.shadow.camera;
    sc.left = -125; sc.right = 125; sc.top = 125; sc.bottom = -125; sc.near = 1; sc.far = 420;
    sc.updateProjectionMatrix();
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.06;
    scene.add(sun);
    var rim = new THREE.DirectionalLight(0x86a8d4, 0.32);
    rim.position.set(70, 50, -80);
    scene.add(rim);
    lavaLight = new THREE.PointLight(0xff5a14, 2.2, 60, 1.6);
    lavaLight.position.set(-6, 9, 32);
    scene.add(lavaLight);

    buildTerrain();
    buildWaterAndLava();
    buildForest();
    buildRocks();
    buildBorders();
    DATA.provinces.forEach(function (p) { p.cities.forEach(function (c) { buildHold(c, p); }); });
    (DATA.landmarks || []).forEach(buildMinorSite);
    buildClouds();
    return true;
  }

  function buildTerrain() {
    var TW = 300, TD = 340, SX = 250, SZ = 290;
    var geo = new THREE.PlaneGeometry(TW, TD, SX, SZ);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, 2);
    var pos = geo.attributes.position, count = pos.count, cols = SX + 1;
    var heights = new Float32Array(count);
    for (var i = 0; i < count; i++) { heights[i] = terrainHeight(pos.getX(i), pos.getZ(i)); pos.setY(i, heights[i]); }

    var dx = TW / SX, dz = TD / SZ;
    baseColors = new Float32Array(count * 3);
    vertProv = new Int8Array(count);
    for (var j = 0; j < count; j++) {
      var ix = j % cols, iz = (j - ix) / cols;
      var hL = heights[ix > 0 ? j - 1 : j], hR = heights[ix < SX ? j + 1 : j];
      var hU = heights[iz > 0 ? j - cols : j], hD = heights[iz < SZ ? j + cols : j];
      var slope = Math.hypot((hR - hL) / (dx * (ix > 0 && ix < SX ? 2 : 1)), (hD - hU) / (dz * (iz > 0 && iz < SZ ? 2 : 1)));
      var x = pos.getX(j), z = pos.getZ(j);
      var rgb = terrainColor(x, z, heights[j], slope);
      baseColors[j * 3] = rgb[0]; baseColors[j * 3 + 1] = rgb[1]; baseColors[j * 3 + 2] = rgb[2];
      var pi = -1;
      for (var p = 0; p < DATA.provinces.length; p++) if (pointInPoly(x, z, DATA.provinces[p].border)) { pi = p; break; }
      vertProv[j] = pi;
    }
    terrainColorAttr = new THREE.BufferAttribute(new Float32Array(baseColors), 3);
    geo.setAttribute("color", terrainColorAttr);
    geo.computeVertexNormals();

    terrainMesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93, metalness: 0 }));
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    scene.add(terrainMesh);
  }

  function buildWaterAndLava() {
    var wg = new THREE.PlaneGeometry(300, 340);
    wg.rotateX(-Math.PI / 2);
    var water = new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ color: 0x2c4c5e, roughness: 0.2, metalness: 0.35, transparent: true, opacity: 0.92 }));
    water.position.set(0, WATER_Y, 2);
    water.receiveShadow = true;
    scene.add(water);

    // Glowing magma veins draped along the Death Pass rifts
    var rift1 = [], rift2 = [];
    for (var x = -36; x <= 26; x += 1.5) rift1.push([x, 27 - 0.34 * x + 3.6 * Math.sin(x * 0.16)]);
    for (var z = 24; z <= 49; z += 1.2) rift2.push([-3 + 0.25 * (z - 28) + 2.8 * Math.sin(z * 0.22), z]);
    var noise = sharedNoise();
    [rift1, rift2].forEach(function (pts, i) {
      var mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uNoise: { value: noise }, uLen: { value: pts.length * 1.4 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: [
          "uniform float uTime; uniform sampler2D uNoise; uniform float uLen; varying vec2 vUv;",
          "void main(){",
          "  float n = texture2D(uNoise, vec2(vUv.x * uLen * 0.06 + uTime * 0.025, vUv.y * 0.4 - uTime * 0.012)).r;",
          "  float core = smoothstep(0.0, 0.85, 1.0 - abs(vUv.y * 2.0 - 1.0));",
          "  float ends = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);",
          "  vec3 col = mix(vec3(0.5, 0.05, 0.02), vec3(1.0, 0.5, 0.1), smoothstep(0.3, 0.72, n) * core);",
          "  col = mix(col, vec3(1.0, 0.86, 0.45), smoothstep(0.66, 0.92, n) * core * core);",
          "  gl_FragColor = vec4(col, core * ends * (0.7 + 0.3 * n));",
          "}"
        ].join("\n"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
      });
      var vein = new THREE.Mesh(ribbonGeometry(pts, i === 0 ? 2.8 : 2.2, 0.25, false), mat);
      vein.renderOrder = 4;
      scene.add(vein);
      lavaMats.push(mat);
    });
  }

  function nearHold(x, z, r) {
    for (var c = 0; c < ALL_CITIES.length; c++) if (Math.hypot(x - ALL_CITIES[c].x, z - ALL_CITIES[c].z) < r) return true;
    return false;
  }

  function buildForest() {
    var rnd = seeded(41), list = [];
    for (var i = 0; i < 12000 && list.length < 2600; i++) {
      var x = -85 + rnd() * 170, z = -100 + rnd() * 200;
      if (fowDist(x, z) > 1.02) continue;
      if (fbm(x * 0.06 + 40, z * 0.06 - 12, 2) < 0.46) continue;          // clumped forests
      var h = terrainHeight(x, z);
      if (h < 2.0 || h > 10.5 || lavaFactor(x, z) > 0) continue;
      if (z > 22 && rnd() < 0.82) continue;
      if (x > spineCenterX(z) + 12 && rnd() < 0.65) continue;
      if (slopeAt(x, z) > 0.95 || roadDist(x, z) < 1.3 || nearHold(x, z, 5)) continue;
      list.push({ x: x, y: h, z: z, s: 0.7 + rnd() * 0.6, c: rnd() });
    }
    if (!list.length) return;

    var lower = new THREE.ConeGeometry(0.62, 1.5, 6); lower.translate(0, 1.0, 0);
    var upper = new THREE.ConeGeometry(0.42, 1.2, 6); upper.translate(0, 1.85, 0);
    var mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });
    var a = new THREE.InstancedMesh(lower, mat, list.length), b = new THREE.InstancedMesh(upper, mat, list.length);
    var dummy = new THREE.Object3D(), col = new THREE.Color();
    list.forEach(function (t, k) {
      dummy.position.set(t.x, t.y - 0.15, t.z);
      dummy.scale.set(t.s, t.s * (0.9 + (k % 3) * 0.12), t.s);
      dummy.rotation.y = k * 1.7;
      dummy.updateMatrix();
      a.setMatrixAt(k, dummy.matrix); b.setMatrixAt(k, dummy.matrix);
      col.setRGB(0.13 + t.c * 0.06, 0.2 + t.c * 0.07, 0.12 + t.c * 0.03);
      a.setColorAt(k, col); b.setColorAt(k, col);
    });
    [a, b].forEach(function (m) { m.castShadow = true; m.receiveShadow = true; scene.add(m); });
  }

  function buildRocks() {
    var rnd = seeded(7), list = [];
    for (var i = 0; i < 4000 && list.length < 340; i++) {
      var x = -75 + rnd() * 150, z = -95 + rnd() * 190;
      if (fowDist(x, z) > 0.98) continue;
      var sl = slopeAt(x, z);
      if (sl < 0.45 || sl > 1.4 || nearHold(x, z, 4.5)) continue;
      list.push({ x: x, y: terrainHeight(x, z), z: z, s: 0.4 + rnd() * 0.9, r: rnd() * 6 });
    }
    var m = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.6, 0), new THREE.MeshStandardMaterial({ color: 0x6a645c, roughness: 0.95, flatShading: true }), list.length);
    var dummy = new THREE.Object3D();
    list.forEach(function (r, k) {
      dummy.position.set(r.x, r.y + 0.1, r.z);
      dummy.scale.set(r.s * 1.3, r.s * 0.8, r.s);
      dummy.rotation.set(r.r, r.r * 2, 0);
      dummy.updateMatrix();
      m.setMatrixAt(k, dummy.matrix);
    });
    m.castShadow = true;
    scene.add(m);
  }

  function buildBorders() {
    var core = gradientTexture(false), soft = gradientTexture(true);
    DATA.provinces.forEach(function (prov) {
      var pts = catmull(prov.border, 0.7, true);
      var glow = new THREE.Mesh(ribbonGeometry(pts, 3.2, 0.42, true), new THREE.MeshBasicMaterial({
        map: soft, color: prov.color, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide
      }));
      var line = new THREE.Mesh(ribbonGeometry(pts, 0.55, 0.5, true), new THREE.MeshBasicMaterial({
        map: core, color: prov.accent || prov.color, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide
      }));
      glow.renderOrder = 2; line.renderOrder = 3;
      scene.add(glow); scene.add(line);
      borderMeshes[prov.id] = { core: line, glow: glow };
    });
  }

  var MATS = null;
  function mats() {
    if (MATS) return MATS;
    MATS = {
      stone: new THREE.MeshStandardMaterial({ color: 0x6b655d, roughness: 0.88, flatShading: true }),
      stoneDark: new THREE.MeshStandardMaterial({ color: 0x46413b, roughness: 0.92, flatShading: true }),
      gold: new THREE.MeshStandardMaterial({ color: 0xd4ad63, roughness: 0.38, metalness: 0.6 }),
      door: new THREE.MeshStandardMaterial({ color: 0x17120e, roughness: 1 }),
      glow: new THREE.MeshBasicMaterial({ color: 0xffa94a }),
      roof: new THREE.MeshStandardMaterial({ color: 0x6e3a24, roughness: 0.85, flatShading: true }),
      dark: new THREE.MeshStandardMaterial({ color: 0x2e2620, roughness: 0.9, flatShading: true }),
      tent: new THREE.MeshStandardMaterial({ color: 0x7a5e3c, roughness: 0.95, flatShading: true }),
      fire: new THREE.MeshBasicMaterial({ color: 0xff7a24 })
    };
    return MATS;
  }

  function addMesh(group, geo, mat, x, y, z) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  }

  function buildHold(city, prov) {
    var M = mats(), g = new THREE.Group(), s = city.isCapital ? 1.3 : 1.0;
    var cx = city.coords.x, cz = city.coords.z, cy = terrainHeight(cx, cz);
    g.position.set(cx, cy, cz);
    g.scale.set(s, s, s);

    addMesh(g, new THREE.CylinderGeometry(3.4, 3.9, 1.2, 8), M.stoneDark, 0, 0.2, 0);            // terrace
    addMesh(g, new THREE.BoxGeometry(4.2, 3.0, 1.0), M.stone, 0, 2.2, 0.9);                       // great gate
    addMesh(g, new THREE.BoxGeometry(1.4, 2.0, 0.3), M.door, 0, 1.7, 1.45);
    addMesh(g, new THREE.BoxGeometry(0.95, 1.45, 0.12), M.glow, 0, 1.45, 1.58);
    addMesh(g, new THREE.BoxGeometry(4.7, 0.35, 1.25), M.gold, 0, 3.85, 0.9);                     // gilded lintel
    [-1.85, 1.85].forEach(function (ox) {                                                          // ancestor towers
      addMesh(g, new THREE.BoxGeometry(0.95, 3.9, 0.95), M.stone, ox, 2.55, 1.2);
      var roof = addMesh(g, new THREE.ConeGeometry(0.78, 0.95, 4), M.gold, ox, 4.95, 1.2);
      roof.rotation.y = Math.PI / 4;
    });
    addMesh(g, new THREE.BoxGeometry(2.7, 3.6, 2.3), M.stone, 0, 3.2, -0.9);                      // keep
    var crown = addMesh(g, new THREE.ConeGeometry(1.9, 1.3, 4), M.gold, 0, 5.65, -0.9);
    crown.rotation.y = Math.PI / 4;
    addMesh(g, new THREE.BoxGeometry(0.4, 1.4, 0.4), M.stoneDark, -0.95, 5.4, -1.6);              // forge chimneys
    addMesh(g, new THREE.BoxGeometry(0.4, 1.1, 0.4), M.stoneDark, 0.95, 5.25, -1.7);
    addMesh(g, new THREE.BoxGeometry(0.08, 2.3, 0.08), M.gold, 0, 7.4, -0.9);                     // banner
    addMesh(g, new THREE.BoxGeometry(0.06, 0.9, 1.05), new THREE.MeshStandardMaterial({
      color: new THREE.Color(prov.color), emissive: new THREE.Color(prov.color).multiplyScalar(0.25), roughness: 0.6
    }), 0, 7.95, -0.35);

    var huts = city.isCapital ? 6 : 4;                                                             // outbuildings
    for (var k = 0; k < huts; k++) {
      var a = Math.PI * 0.15 + (k / (huts - 1)) * Math.PI * 0.7, r = 3.3;
      var hx = Math.cos(a) * r * (k % 2 ? 1 : -1), hz = Math.sin(a) * r * 0.8 + 0.6;
      addMesh(g, new THREE.BoxGeometry(0.9, 0.7, 0.8), M.stone, hx, 0.95, hz);
      var hr = addMesh(g, new THREE.ConeGeometry(0.7, 0.55, 4), M.roof, hx, 1.57, hz);
      hr.rotation.y = Math.PI / 4;
    }

    // red selection ring on the terrace (shown when the hold is open)
    var ring = new THREE.Mesh(new THREE.RingGeometry(3.0, 3.4, 40), new THREE.MeshBasicMaterial({
      color: 0xe0472f, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false
    }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.86;
    ring.visible = false;
    g.add(ring);
    holdRings[city.id] = ring;

    var hit = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 3;
    hit.userData = { cityId: city.id, provinceId: prov.id };
    g.add(hit);
    holdHits.push(hit);

    scene.add(g);

    if (city.isCapital) {
      for (var p = 0; p < 4; p++) {
        smoke.push({ base: new THREE.Vector3(cx - 0.95 * s, cy + 6.3 * s, cz - 1.6 * s), phase: p / 4, sprite: null });
      }
    }
  }

  function buildMinorSite(lm) {
    var M = mats(), t = lm.type;
    if (t !== "tower" && t !== "ruin" && t !== "camp") return;
    var x = lm.coords.x, z = lm.coords.z, g = new THREE.Group();
    g.position.set(x, terrainHeight(x, z), z);
    if (t === "tower") {
      addMesh(g, new THREE.CylinderGeometry(0.9, 1.3, 4.2, 6), M.dark, 0, 2.1, 0);
      addMesh(g, new THREE.ConeGeometry(1.4, 2.0, 6), M.roof, 0, 5.2, 0);
      addMesh(g, new THREE.BoxGeometry(0.06, 1.4, 0.06), M.dark, 0, 6.8, 0);
      addMesh(g, new THREE.CylinderGeometry(1.8, 2.2, 0.8, 6), M.stoneDark, 0, 0.3, 0);
    } else if (t === "ruin") {
      [[-1.2, 0, 2.6], [0.4, -0.8, 1.6], [1.4, 0.6, 2.1], [-0.2, 1.2, 0.9]].forEach(function (c) {
        addMesh(g, new THREE.BoxGeometry(0.7, c[2], 0.7), M.stone, c[0], c[2] / 2, c[1]);
      });
      addMesh(g, new THREE.BoxGeometry(3.4, 0.4, 2.6), M.stoneDark, 0, 0.1, 0);
    } else {
      [[-1, 0], [1.1, 0.4], [0, -1.1]].forEach(function (c) { addMesh(g, new THREE.ConeGeometry(0.75, 1.3, 5), M.tent, c[0], 0.65, c[1]); });
      addMesh(g, new THREE.SphereGeometry(0.28, 6, 4), M.fire, 0.1, 0.25, 0.2);
    }
    scene.add(g);
  }

  function buildClouds() {
    var tex = sharedNoise();
    var vert = "varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }";
    var frag = [
      "uniform float uTime; uniform sampler2D uNoise; uniform vec2 uCenter; uniform vec2 uRadii; uniform vec2 uEdge;",
      "uniform float uOpacity; uniform vec3 uDark; uniform vec3 uLight; uniform float uScale; varying vec2 vW;",
      "void main(){",
      "  float n1 = texture2D(uNoise, vW * 0.0065 * uScale + vec2(uTime * 0.0040, uTime * 0.0016)).r;",
      "  float n2 = texture2D(uNoise, vW * 0.0170 * uScale + vec2(-uTime * 0.0030, uTime * 0.0050)).r;",
      "  float n = n1 * 0.62 + n2 * 0.38;",
      "  float d = length((vW - uCenter) / uRadii);",
      "  float m = smoothstep(uEdge.x, uEdge.y, d + (n - 0.5) * 0.45);",
      "  vec3 col = mix(uDark, uLight, smoothstep(0.25, 0.8, n));",
      "  gl_FragColor = vec4(col, m * uOpacity * (0.72 + 0.28 * n));",
      "}"
    ].join("\n");

    [
      { y: 12.5, edge: [0.80, 1.08], op: 0.92, scale: 1.0 },
      { y: 19.0, edge: [0.88, 1.22], op: 0.85, scale: 0.75 },
      { y: 27.0, edge: [0.98, 1.35], op: 0.9, scale: 0.55 }
    ].forEach(function (L) {
      var mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 }, uNoise: { value: tex },
          uCenter: { value: new THREE.Vector2(WORLD.cx, WORLD.cz) },
          uRadii: { value: new THREE.Vector2(WORLD.rx, WORLD.rz) },
          uEdge: { value: new THREE.Vector2(L.edge[0], L.edge[1]) },
          uOpacity: { value: L.op }, uScale: { value: L.scale },
          uDark: { value: new THREE.Color(0.47, 0.49, 0.52) },
          uLight: { value: new THREE.Color(0.82, 0.83, 0.84) }
        },
        vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false
      });
      var geo = new THREE.PlaneGeometry(900, 960);
      geo.rotateX(-Math.PI / 2);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, L.y, 2);
      mesh.renderOrder = 5;
      scene.add(mesh);
      cloudMats.push(mat);
    });

    // Forge smoke above capitals
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var ctx = c.getContext("2d"), gr = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    gr.addColorStop(0, "rgba(70,66,62,0.55)"); gr.addColorStop(1, "rgba(70,66,62,0)");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
    var smokeTex = new THREE.CanvasTexture(c);
    smoke.forEach(function (sm) {
      sm.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false }));
      scene.add(sm.sprite);
    });
  }

  /* ===================== 2D FALLBACK (no WebGL) ===================== */
  var ctx2d = null;
  function initFallback() {
    ctx2d = canvasEl.getContext("2d");
    canvasEl.width = window.innerWidth; canvasEl.height = window.innerHeight;
  }
  function projectFallback(wx, wy, wz) {
    var dx = wx - camRig.target.x, dy = wy - camRig.target.y, dz = wz - camRig.target.z;
    var cy = Math.cos(-camRig.yaw), sy = Math.sin(-camRig.yaw);
    var rx = dx * cy - dz * sy, rz = dx * sy + dz * cy;
    var cp = Math.cos(camRig.pitch), sp = Math.sin(camRig.pitch);
    var vz = rz * cp - dy * sp + camRig.dist, vy = rz * sp + dy * cp;
    if (vz < 2) return null;
    var f = (window.innerHeight * 0.5) / Math.tan((42 * Math.PI) / 360);
    return { x: window.innerWidth * 0.5 + (rx / vz) * f, y: window.innerHeight * 0.5 - (vy / vz) * f, depth: vz };
  }
  function renderFallback() {
    if (!ctx2d) return;
    var W = canvasEl.width, H = canvasEl.height;
    ctx2d.fillStyle = "#8f9497";
    ctx2d.fillRect(0, 0, W, H);
    for (var z = -96; z <= 96; z += 3.5) {
      for (var x = -72; x <= 72; x += 3.5) {
        var h = terrainHeight(x, z), p = projectFallback(x, h, z);
        if (!p || p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) continue;
        var rgb = h < WATER_Y ? [0.17, 0.3, 0.37] : terrainColor(x, z, h, 0.5), sz = Math.max(4, (300 / p.depth) * 3.5);
        ctx2d.fillStyle = "rgb(" + Math.round(rgb[0] * 255) + "," + Math.round(rgb[1] * 255) + "," + Math.round(rgb[2] * 255) + ")";
        ctx2d.fillRect(p.x - sz / 2, p.y - sz / 2, sz + 1, sz + 1);
      }
    }
  }

  /* ===================== INPUT ===================== */
  var drag = { active: false, button: 0, lastX: 0, lastY: 0, moved: 0 };

  function clampGoals() {
    camRig.goalTarget.x = Math.max(-55, Math.min(55, camRig.goalTarget.x));
    camRig.goalTarget.z = Math.max(-80, Math.min(84, camRig.goalTarget.z));
    camRig.goalDist = Math.max(24, Math.min(235, camRig.goalDist));
    camRig.goalPitch = Math.max(0.42, Math.min(1.12, camRig.goalPitch));
    camRig.goalYaw = Math.max(-0.85, Math.min(0.85, camRig.goalYaw));
  }

  stageEl.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  stageEl.addEventListener("pointerdown", function (e) {
    drag.active = true; drag.button = e.button; drag.lastX = e.clientX; drag.lastY = e.clientY; drag.moved = 0;
    try { stageEl.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  });
  stageEl.addEventListener("pointermove", function (e) {
    if (!drag.active) { handleHover(e.clientX, e.clientY); return; }
    var dx = e.clientX - drag.lastX, dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.moved += Math.hypot(dx, dy);
    if (drag.button === 2 || e.shiftKey) {
      camRig.goalYaw -= dx * 0.0045;
      camRig.goalPitch += dy * 0.0038;
    } else {
      var k = camRig.dist * 0.00115, cy = Math.cos(camRig.yaw), sy = Math.sin(camRig.yaw);
      camRig.goalTarget.x -= (dx * cy + dy * sy) * k;
      camRig.goalTarget.z -= (-dx * sy + dy * cy) * k;
      camRig.goalTarget.y = terrainHeight(camRig.goalTarget.x, camRig.goalTarget.z) * 0.55 + 2;
    }
    clampGoals();
  });
  stageEl.addEventListener("pointerup", function (e) {
    if (!drag.active) return;
    drag.active = false;
    if (drag.moved < 6 && drag.button === 0) handleClick(e.clientX, e.clientY);
  });

  // Scroll to zoom anywhere on the map (but not inside panels / the book)
  window.addEventListener("wheel", function (e) {
    if (bookIsOpen()) return;
    var t = e.target;
    if (t && t.closest && t.closest(".building-info, .settlement-bar, .minimap, .plaque")) return;
    e.preventDefault();
    camRig.goalDist *= e.deltaY > 0 ? 1.11 : 0.9;
    clampGoals();
    if (state.tier === "province" && camRig.goalDist > 118) goStrategic();
    else if (state.tier === "settlement" && camRig.goalDist > 90 && state.activeProvinceId) enterProvince(state.activeProvinceId);
  }, { passive: false });

  var raycaster = hasThree ? new THREE.Raycaster() : null;
  var ndc = hasThree ? new THREE.Vector2() : null;
  function raycastMap(cx, cy) {
    if (!hasThree || !camera || !terrainMesh) return null;
    ndc.set((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    var hh = raycaster.intersectObjects(holdHits, false);
    if (hh.length) return { type: "city", cityId: hh[0].object.userData.cityId, provinceId: hh[0].object.userData.provinceId };
    var th = raycaster.intersectObject(terrainMesh, false);
    if (!th.length) return null;
    var p = th[0].point;
    for (var i = 0; i < DATA.provinces.length; i++) {
      if (pointInPoly(p.x, p.z, DATA.provinces[i].border)) return { type: "province", provinceId: DATA.provinces[i].id };
    }
    return { type: "wild" };
  }
  var hoverRAF = false, hoverXY = [0, 0];
  function handleHover(cx, cy) {
    hoverXY[0] = cx; hoverXY[1] = cy;
    if (hoverRAF) return;
    hoverRAF = true;
    requestAnimationFrame(function () {
      hoverRAF = false;
      var hit = raycastMap(hoverXY[0], hoverXY[1]);
      var pid = hit && hit.provinceId ? hit.provinceId : null;
      // only highlight provinces you could enter from here
      if (state.tier !== "strategic" && pid === state.activeProvinceId && !(hit && hit.type === "city")) pid = null;
      setHoveredProvince(pid);
      stageEl.style.cursor = pid ? "pointer" : "";
    });
  }
  function handleClick(cx, cy) {
    var hit = raycastMap(cx, cy);
    if (!hit) return;
    if (hit.type === "city") {
      if (state.tier === "strategic") enterProvince(hit.provinceId); else openCity(hit.cityId, 0);
    } else if (hit.type === "province") {
      if (state.activeProvinceId !== hit.provinceId || state.tier === "strategic") enterProvince(hit.provinceId);
    } else {
      stepBack();
    }
  }

  /* ===================== BUTTONS & KEYS ===================== */
  returnBtn.addEventListener("click", stepBack);
  $("bookOpenBtn").addEventListener("click", openBook);
  $("bookCloseBtn").addEventListener("click", closeBook);
  bookEl.addEventListener("click", function (e) { if (e.target === bookEl) closeBook(); });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (bookIsOpen()) closeBook(); else stepBack(); return; }
    if (bookIsOpen()) return;
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    var step = camRig.dist * 0.08, k = e.key;
    if (k === "w" || k === "W" || k === "ArrowUp") camRig.goalTarget.z -= step;
    else if (k === "s" || k === "S" || k === "ArrowDown") camRig.goalTarget.z += step;
    else if (k === "a" || k === "A" || k === "ArrowLeft") camRig.goalTarget.x -= step;
    else if (k === "d" || k === "D" || k === "ArrowRight") camRig.goalTarget.x += step;
    else return;
    clampGoals();
  });

  window.addEventListener("resize", function () {
    if (hasThree && renderer && camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    } else if (ctx2d) {
      canvasEl.width = window.innerWidth; canvasEl.height = window.innerHeight;
    }
  });

  /* ===================== RENDER LOOP ===================== */
  var projVec = hasThree ? new THREE.Vector3() : null;
  function project(wx, wy, wz) {
    if (hasThree && camera) {
      projVec.set(wx, wy, wz).project(camera);
      if (projVec.z > 1) return null;
      return { x: (projVec.x * 0.5 + 0.5) * window.innerWidth, y: (-projVec.y * 0.5 + 0.5) * window.innerHeight };
    }
    return projectFallback(wx, wy, wz);
  }
  function placeMarkers(list) {
    var W = window.innerWidth, H = window.innerHeight;
    list.forEach(function (m) {
      var p = project(m.x, m.y, m.z);
      if (!p || p.x < -200 || p.x > W + 200 || p.y < -120 || p.y > H + 120) { m.el.style.visibility = "hidden"; return; }
      m.el.style.visibility = "visible";
      m.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) translate(-50%," + (m.anchor === "bottom" ? "-100%" : "-50%") + ")";
    });
  }

  var t0 = performance.now();
  function tick(now) {
    var t = (now - t0) * 0.001, k = reduceMotion ? 1 : 0.1;
    camRig.target.x += (camRig.goalTarget.x - camRig.target.x) * k;
    camRig.target.y += (camRig.goalTarget.y - camRig.target.y) * k;
    camRig.target.z += (camRig.goalTarget.z - camRig.target.z) * k;
    camRig.yaw += (camRig.goalYaw - camRig.yaw) * k;
    camRig.pitch += (camRig.goalPitch - camRig.pitch) * k;
    camRig.dist += (camRig.goalDist - camRig.dist) * k;

    if (hasThree && renderer && camera) {
      var horiz = Math.cos(camRig.pitch) * camRig.dist;
      var px = camRig.target.x + Math.sin(camRig.yaw) * horiz;
      var pz = camRig.target.z + Math.cos(camRig.yaw) * horiz;
      var py = camRig.target.y + Math.sin(camRig.pitch) * camRig.dist;
      camera.position.set(px, Math.max(py, terrainHeight(px, pz) + 4.5), pz);
      camera.lookAt(camRig.target.x, camRig.target.y, camRig.target.z);

      scene.fog.near = camRig.dist * 1.15;
      scene.fog.far = camRig.dist * 3.3;

      var tm = reduceMotion ? 0 : t;
      cloudMats.forEach(function (m) { m.uniforms.uTime.value = tm; });
      lavaMats.forEach(function (m) { m.uniforms.uTime.value = tm; });
      if (lavaLight) lavaLight.intensity = 2.0 + (reduceMotion ? 0 : Math.sin(t * 2.6) * 0.45);
      Object.keys(holdRings).forEach(function (id) {
        var r = holdRings[id];
        if (r.visible) r.material.opacity = 0.6 + (reduceMotion ? 0.2 : Math.sin(t * 3) * 0.25);
      });
      smoke.forEach(function (sm) {
        if (!sm.sprite) return;
        var life = ((reduceMotion ? 0.5 : t * 0.18) + sm.phase) % 1;
        sm.sprite.position.set(sm.base.x + life * 1.6, sm.base.y + life * 5, sm.base.z - life * 0.8);
        var sz = 1.2 + life * 3.2;
        sm.sprite.scale.set(sz, sz, 1);
        sm.sprite.material.opacity = Math.sin(life * Math.PI) * 0.7;
      });

      renderer.render(scene, camera);
    } else {
      renderFallback();
    }

    placeMarkers(markers.provinces);
    placeMarkers(markers.cities);
    placeMarkers(markers.landmarks);
    updateMinimapReticle();
    requestAnimationFrame(tick);
  }

  /* ===================== BOOT ===================== */
  buildMarkers();
  buildMinimap();
  buildBook();
  syncTier();

  // Deep links: #province=<id>, #hold=<id>, #book
  function applyHash() {
    var h = (window.location && window.location.hash || "").replace(/^#/, "");
    var m = /^(province|hold)=([\w-]+)$/.exec(h);
    if (m && m[1] === "province") enterProvince(m[2]);
    else if (m && m[1] === "hold") openCity(m[2], 0);
    else if (h === "book") openBook();
  }

  // Let the veil paint before the (synchronous) terrain build
  setTimeout(function () {
    if (!initThree()) initFallback();
    lastTintKey = "";
    applyHash();
    updateWorldHighlights();
    var veil = $("veil");
    if (veil) veil.classList.add("is-done");
    requestAnimationFrame(tick);
  }, 40);
})();
