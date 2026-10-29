/**
 * ============================================================================
 * WORLD'S EDGE MOUNTAINS — 3D TOTAL WAR: WARHAMMER III PORTFOLIO ENGINE
 * ============================================================================
 */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== BUILDING SLOT SVG ICONS ===================== */
  var ICONS = {
    citadel: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21h18M5 21V9l3-2V4h8v3l3 2v12"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/><path d="M9 10h6"/></svg>',
    forge: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 16h16l-2 5H6l-2-5z"/><path d="M7 16v-4h10v4"/><path d="M12 3c2 2.5 3 4.2 3 6a3 3 0 0 1-6 0c0-1.8 1-3.5 3-6z"/></svg>',
    gate: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21V6l4-3h10l4 3v15"/><path d="M8 21v-8a4 4 0 0 1 8 0v8"/><line x1="12" y1="9" x2="12" y2="21"/></svg>',
    gyro: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="13" r="4"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="12" y1="6" x2="12" y2="9"/><path d="M8 17l-3 3M16 17l3 3"/></svg>',
    rune: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"/><path d="M12 6v12M8 9l4 3 4-3M8 15l4-3 4 3"/></svg>',
    shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 7v10M8.5 11.5h7"/></svg>',
    scroll: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><line x1="8" y1="9" x2="15" y2="9"/><line x1="8" y1="13" x2="15" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>',
    anvil: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 10H3l2 4h3v4H6l-1 3h14l-1-3h-2v-4h5l-2-4H7z"/><path d="M9 6h6v4H9z"/></svg>',
    mine: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polygon points="12 3 20 9 16 20 8 20 4 9 12 3"/><polyline points="4 9 12 13 20 9"/><line x1="12" y1="13" x2="12" y2="20"/></svg>',
    book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2V4z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4z"/></svg>',
    chart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/><line x1="3" y1="21" x2="21" y2="21"/></svg>',
    crown: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 18h18v2H3zM4 15l2.5-8 5.5 4.5L17.5 7 20 15H4z"/></svg>',
    envoy: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>'
  };

  var HAMMER_SVG =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>';

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ===================== DETERMINISTIC NOISE & WORLD'S EDGE TOPOGRAPHY ===================== */
  function hash2(ix, iz) {
    var n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, z) {
    var ix = Math.floor(x), iz = Math.floor(z);
    var fx = x - ix, fz = z - iz;
    var ux = fx * fx * (3 - 2 * fx);
    var uz = fz * fz * (3 - 2 * fz);
    var a = hash2(ix, iz);
    var b = hash2(ix + 1, iz);
    var c = hash2(ix, iz + 1);
    var d = hash2(ix + 1, iz + 1);
    return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
  }

  function ridgedFbm(x, z, octaves) {
    var sum = 0, amp = 0.55, freq = 1, norm = 0;
    for (var i = 0; i < octaves; i++) {
      var n = valueNoise(x * freq, z * freq);
      var ridge = 1 - Math.abs(n * 2 - 1);
      ridge = ridge * ridge;
      sum += ridge * amp;
      norm += amp;
      freq *= 2.07;
      amp *= 0.48;
    }
    return sum / norm;
  }

  function fbm(x, z, octaves) {
    var sum = 0, amp = 0.5, freq = 1, norm = 0;
    for (var i = 0; i < octaves; i++) {
      sum += valueNoise(x * freq, z * freq) * amp;
      norm += amp;
      freq *= 2.03;
      amp *= 0.5;
    }
    return sum / norm;
  }

  /* NNE -> SSW spine of the World's Edge Mountains */
  function spineCenterX(z) {
    return -0.22 * z + 5.5 * Math.sin(z * 0.043);
  }

  /* Volcanic magma fissures snaking through Death Pass around Karag Dron (z ~ 18..48) */
  function lavaFactor(x, z) {
    if (z < 12 || z > 58 || x < -38 || x > 28) return 0;
    // Main Death Pass magma rift running SW from south of Mount Squighorn past Karag Dron
    var riftZ1 = 27 - 0.34 * x + 3.6 * Math.sin(x * 0.16);
    var d1 = Math.abs(z - riftZ1);
    // Secondary branch east of Karag Dron
    var riftX2 = -3 + 0.25 * (z - 28) + 2.8 * Math.sin(z * 0.22);
    var d2 = (z > 23 && z < 50) ? Math.abs(x - riftX2) : 99;
    var d = Math.min(d1, d2);
    var env = Math.min(1, Math.max(0, 1 - Math.abs(z - 34) / 22));
    if (d > 2.7) return 0;
    return Math.pow(1 - d / 2.7, 1.7) * env;
  }

  /* Pre-collect all city coordinates for sculpted mountain amphitheaters */
  var ALL_CITIES = [];
  DATA.provinces.forEach(function (p) {
    p.cities.forEach(function (c) {
      ALL_CITIES.push({ city: c, prov: p, x: c.coords.x, z: c.coords.z });
    });
  });

  function terrainHeight(x, z) {
    var sx = spineCenterX(z);
    var dx = x - sx;

    // Broad World's Edge mountain massif profile (asymmetric: foothills west, steeper Dark Lands east)
    var spread = dx < 0 ? 1150 : 920;
    var massif = Math.exp(-(dx * dx) / spread);

    var ridge = ridgedFbm(x * 0.048 + 11.3, z * 0.048 - 7.1, 4);
    var detail = ridgedFbm(x * 0.13 - 4.2, z * 0.13 + 9.4, 3);
    var hills = fbm(x * 0.035 + 3.1, z * 0.035 + 5.7, 3);

    var h = 0.6 + hills * 3.4 + massif * (4.5 + ridge * 17.5 + detail * 3.6);

    // Extra towering northern peaks near Karak Ungor & Peak Pass
    var northBoost = Math.max(0, (-z - 22) / 58);
    h += massif * northBoost * 4.2 * ridge;

    // Carve The Silver Road central pass valley running between Karaz-a-Karak (-18,-10) -> Squighorn (20,3)
    var srLineZ = -10 + ((x + 18) / 38) * 13;
    if (x > -26 && x < 27) {
      var dSr = Math.abs(z - srLineZ);
      if (dSr < 8.5) {
        var cut = (1 - dSr / 8.5);
        h = h * (1 - 0.36 * cut * cut) + 1.8 * cut;
      }
    }

    // Ring of Eight Peaks around Karak Eight Peaks (-5, 59)
    var k8x = -5, k8z = 59;
    var dk8 = Math.hypot(x - k8x, z - k8z);
    if (dk8 < 20) {
      for (var k = 0; k < 8; k++) {
        var ang = k * (Math.PI / 4) + 0.38;
        var px = k8x + Math.cos(ang) * 11.2;
        var pz = k8z + Math.sin(ang) * 10.6;
        // Keep southern camera sightline slightly lower than northern crown peaks
        var peakScale = Math.sin(ang) > 0.55 ? 6.8 : 11.8;
        var dp = Math.hypot(x - px, z - pz);
        if (dp < 6.4) {
          var pk = 1 - dp / 6.4;
          h += peakScale * pk * pk * (0.75 + 0.35 * detail);
        }
      }
    }

    // Sculpt readable stronghold terraces & dramatic backdrop peaks behind each hold
    for (var i = 0; i < ALL_CITIES.length; i++) {
      var c = ALL_CITIES[i];
      var dc = Math.hypot(x - c.x, z - c.z);
      if (dc < 6.8) {
        var t = 1 - dc / 6.8;
        var smooth = t * t * (3 - 2 * t);
        var shelfH = c.city.isCapital ? 7.4 : 6.4;
        h = h * (1 - smooth * 0.72) + shelfH * (smooth * 0.72);
      }
      // Dramatic snowy crag just north (-z) of each hold so it looks carved into a giant peak
      var db = Math.hypot((x - c.x) * 0.75, z - (c.z - 8.2));
      if (db < 8.5) {
        var tb = 1 - db / 8.5;
        h += (c.city.isCapital ? 8.8 : 6.4) * tb * tb * (0.7 + 0.4 * ridge);
      }
    }

    // Carve glowing volcanic fissures around Karag Dron / Death Pass
    var lava = lavaFactor(x, z);
    if (lava > 0) {
      h = h * (1 - lava * 0.72) + 1.35 * lava;
    }

    return Math.max(0.4, h);
  }

  function terrainSlope(x, z) {
    var e = 0.65;
    var hx = terrainHeight(x + e, z) - terrainHeight(x - e, z);
    var hz = terrainHeight(x, z + e) - terrainHeight(x, z - e);
    return Math.hypot(hx, hz) / (2 * e);
  }

  /* Biome RGB [0..1] for any (x, z, h, slope) on the World's Edge Mountains */
  function terrainColor(x, z, h, slope) {
    var lava = lavaFactor(x, z);
    if (lava > 0.36) {
      var core = Math.min(1, (lava - 0.36) / 0.55);
      return [
        0.72 + 0.28 * core,
        0.16 + 0.48 * core * core,
        0.03 + 0.09 * core
      ];
    }

    var n = fbm(x * 0.11 + 2.2, z * 0.11 - 3.4, 2);
    var sx = spineCenterX(z);

    // Base granite & slate rock
    var r = 0.28 + n * 0.1, g = 0.27 + n * 0.09, b = 0.26 + n * 0.09;

    // Western Old World pine-forested foothills (left of Karaz-a-Karak / Varenka Hills)
    if (x < sx - 4 && h < 8.8 && z < 26 && slope < 1.05) {
      var greenMix = Math.max(0, Math.min(1, (8.8 - h) / 5.5)) * Math.max(0, 1 - slope * 0.85);
      r = r * (1 - greenMix) + (0.17 + n * 0.07) * greenMix;
      g = g * (1 - greenMix) + (0.25 + n * 0.09) * greenMix;
      b = b * (1 - greenMix) + (0.14 + n * 0.05) * greenMix;
    }

    // Southern Badlands / Death Pass scorched basalt & ochre scree
    if (z > 16) {
      var southMix = Math.min(1, (z - 16) / 28);
      if (lava > 0.02 || (z > 20 && z < 52 && h < 10.5)) {
        var ash = Math.min(1, lava * 2.2 + southMix * 0.45);
        r = r * (1 - ash * 0.55) + 0.14 * (ash * 0.55);
        g = g * (1 - ash * 0.55) + 0.11 * (ash * 0.55);
        b = b * (1 - ash * 0.55) + 0.11 * (ash * 0.55);
      } else if (h < 7.2) {
        var bad = southMix * Math.max(0, (7.2 - h) / 5.5) * 0.6;
        r = r * (1 - bad) + (0.37 + n * 0.08) * bad;
        g = g * (1 - bad) + (0.27 + n * 0.06) * bad;
        b = b * (1 - bad) + (0.19 + n * 0.04) * bad;
      }
    }

    // Steep cliff darkening for chiseled Total War rock relief
    if (slope > 0.85) {
      var cliff = Math.min(1, (slope - 0.85) / 1.4);
      r *= (1 - cliff * 0.25);
      g *= (1 - cliff * 0.24);
      b *= (1 - cliff * 0.20);
    }

    // Alpine snowline (lower in frozen Karak Ungor north, higher in volcanic Eight Peaks south)
    var snowLine = 10.6 + Math.max(-2.6, Math.min(3.4, z * 0.045)) - n * 1.8;
    if (h > snowLine && lava < 0.05) {
      var snowAmt = Math.min(1, (h - snowLine) / 3.6) * Math.max(0.12, 1 - Math.max(0, slope - 0.95) * 0.62);
      r = r * (1 - snowAmt) + (0.86 + n * 0.09) * snowAmt;
      g = g * (1 - snowAmt) + (0.89 + n * 0.08) * snowAmt;
      b = b * (1 - snowAmt) + (0.94 + n * 0.05) * snowAmt;
    }

    return [r, g, b];
  }

  /* Point-in-polygon helper for clicking provinces directly on 3D terrain */
  function pointInPoly(px, pz, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], zi = poly[i][1];
      var xj = poly[j][0], zj = poly[j][1];
      var intersect = ((zi > pz) !== (zj > pz)) &&
        (px < ((xj - xi) * (pz - zi)) / (zj - zi + 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /* ===================== APPLICATION STATE ===================== */
  var state = {
    tier: "strategic",          // 'strategic' | 'province' | 'settlement'
    activeProvinceId: null,
    hoveredProvinceId: null,
    activeCityId: null,
    activeOptionIdx: 0,
    showBorders: true,
    showUnderway: true,
    showLandmarks: true,
    cycleIdx: -1
  };

  /* Camera orbit/pan/zoom rig (spherical offset around target) */
  function defaultStrategicDist() {
    return window.innerWidth < 760 ? 172 : 146;
  }

  var camRig = {
    target: { x: 0, y: 5, z: -5 },
    yaw: -0.17,
    pitch: 0.84,
    dist: defaultStrategicDist(),
    // Smooth interpolation destination
    goalTarget: { x: 0, y: 5, z: -5 },
    goalYaw: -0.17,
    goalPitch: 0.84,
    goalDist: defaultStrategicDist()
  };

  function getProvince(id) {
    for (var i = 0; i < DATA.provinces.length; i++) {
      if (DATA.provinces[i].id === id) return DATA.provinces[i];
    }
    return null;
  }

  function findCity(cityId) {
    for (var i = 0; i < DATA.provinces.length; i++) {
      var p = DATA.provinces[i];
      for (var j = 0; j < p.cities.length; j++) {
        if (p.cities[j].id === cityId) return { province: p, city: p.cities[j] };
      }
    }
    return null;
  }

  /* ===================== DOM REFERENCES ===================== */
  var stageEl = document.getElementById("map-stage");
  var canvasEl = document.getElementById("webgl-canvas");
  var markerLayer = document.getElementById("marker-layer");
  var tooltipEl = document.getElementById("twTooltip");
  var contextCrumb = document.getElementById("contextCrumb");
  var contextHint = document.getElementById("contextHint");
  var contextBackBtn = document.getElementById("contextBackBtn");
  var minimapZoomLabel = document.getElementById("minimapZoomLabel");
  var minimapSvg = document.getElementById("minimap-svg");

  /* ===================== POPULATE TOP BAR & MARKERS ===================== */
  function initTopBar() {
    document.getElementById("hudIdentityName").textContent = DATA.identity.name;
    document.getElementById("hudIdentitySub").textContent = DATA.identity.factionTitle;
    document.getElementById("githubTopBtn").href = DATA.identity.github;
    document.getElementById("envoyMailBtn").href = "mailto:" + DATA.identity.email;

    var statsHtml = "";
    DATA.hudStats.forEach(function (st) {
      statsHtml +=
        '<div class="t-stat">' +
          '<span class="t-stat__label">' + esc(st.label) + ":</span>" +
          '<span class="t-stat__val">' + esc(st.value) + "</span>" +
          '<span class="t-stat__delta">(' + esc(st.delta) + ")</span>" +
        "</div>";
    });
    document.getElementById("hudTreasuryStats").innerHTML = statsHtml;
  }

  var markerNodes = { provinces: [], cities: [], landmarks: [] };

  function buildFloatingMarkers() {
    var frag = document.createDocumentFragment();

    // 1. Zoomed-Out Province Category Placards
    DATA.provinces.forEach(function (prov) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "prov-marker";
      btn.dataset.provinceId = prov.id;
      btn.style.setProperty("--prov-color", prov.color);
      btn.style.setProperty("--prov-glow", prov.color + "88");
      btn.setAttribute("aria-label", prov.category + " — Province: " + prov.loreName);

      var countLabel = prov.cities.length + (prov.cities.length === 1 ? " Hold" : " Holds");
      btn.innerHTML =
        '<div class="prov-marker__card">' +
          '<div class="prov-marker__crest" aria-hidden="true">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0d79c" stroke-width="2"><polygon points="12 2 21 8 18 20 6 20 3 8 12 2"/></svg>' +
          "</div>" +
          '<div class="prov-marker__body">' +
            '<span class="prov-marker__lore">' + esc(prov.loreName) + " · " + countLabel + "</span>" +
            '<span class="prov-marker__cat">' + esc(prov.category) + "</span>" +
            '<span class="prov-marker__meta">' + esc(prov.subtitle) + "</span>" +
          "</div>" +
        "</div>" +
        '<span class="prov-marker__cta">Click Region to Zoom In</span>';

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        hideTooltip();
        enterProvince(prov.id);
      });
      btn.addEventListener("pointerenter", function (e) {
        setHoveredProvince(prov.id);
        showProvinceTooltip(prov, e.clientX, e.clientY);
      });
      btn.addEventListener("pointermove", function (e) {
        moveTooltip(e.clientX, e.clientY);
      });
      btn.addEventListener("pointerleave", function () {
        setHoveredProvince(null);
        hideTooltip();
      });

      frag.appendChild(btn);
      var h = terrainHeight(prov.center.x, prov.center.z);
      markerNodes.provinces.push({ el: btn, prov: prov, x: prov.center.x, y: h + 8.5, z: prov.center.z });
    });

    // 2. City / Settlement Nameplate Banners (TW:WH3 Parchment + Shield)
    DATA.provinces.forEach(function (prov) {
      prov.cities.forEach(function (city) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "city-marker" + (city.isCapital ? " is-capital" : "");
        btn.dataset.cityId = city.id;
        btn.dataset.provinceId = prov.id;
        btn.style.setProperty("--prov-color", prov.color);
        btn.setAttribute("aria-label", city.title + " (" + city.holdName + ") in " + prov.category);

        btn.innerHTML =
          '<div class="city-banner">' +
            '<span class="city-banner__shield" title="Tier ' + esc(city.tier) + '">' + esc(city.tier) + "</span>" +
            '<span class="city-banner__ribbon">' +
              '<span class="city-banner__title">' + esc(city.title) + "</span>" +
              '<span class="city-banner__hold">' + esc(city.holdName) + "</span>" +
            "</span>" +
            '<span class="city-banner__hammer" title="Inspect Construction Options" aria-hidden="true">' + HAMMER_SVG + "</span>" +
          "</div>" +
          '<span class="city-banner__pin" aria-hidden="true"></span>';

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          hideTooltip();
          if (state.tier === "strategic") {
            enterProvince(prov.id);
          } else {
            openCity(city.id, 0);
          }
        });
        btn.addEventListener("pointerenter", function (e) {
          setHoveredProvince(prov.id);
          showCityTooltip(city, prov, e.clientX, e.clientY);
        });
        btn.addEventListener("pointermove", function (e) {
          moveTooltip(e.clientX, e.clientY);
        });
        btn.addEventListener("pointerleave", function () {
          setHoveredProvince(null);
          hideTooltip();
        });

        frag.appendChild(btn);
        var h = terrainHeight(city.coords.x, city.coords.z);
        markerNodes.cities.push({
          el: btn,
          city: city,
          prov: prov,
          x: city.coords.x,
          y: h + (city.isCapital ? 4.8 : 4.1),
          z: city.coords.z
        });
      });
    });

    // 3. Scenic Warhammer Landmarks (Varenka Hills, Mount Gunbad, Black Crag)
    (DATA.landmarks || []).forEach(function (lm) {
      var div = document.createElement("div");
      div.className = "landmark-marker";
      div.setAttribute("aria-hidden", "true");
      div.textContent = lm.name;
      frag.appendChild(div);
      var h = terrainHeight(lm.coords.x, lm.coords.z);
      markerNodes.landmarks.push({ el: div, x: lm.coords.x, y: h + 3.2, z: lm.coords.z });
    });

    markerLayer.appendChild(frag);
  }

  /* ===================== TW:WH3 TOOLTIPS (MOUNT SQUIGHORN STYLE) ===================== */
  function showProvinceTooltip(prov, cx, cy) {
    tooltipEl.innerHTML =
      '<div class="tw-tooltip__head">' +
        '<span class="tw-tooltip__title">' + esc(prov.category) + "</span>" +
        '<span class="tw-tooltip__faction">' + esc(prov.faction) + "</span>" +
      "</div>" +
      '<div class="tw-tooltip__rows">' +
        '<div class="tw-tooltip__row"><span>Province:</span> ' + esc(prov.loreName) + "</div>" +
        '<div class="tw-tooltip__row"><span>Settlements:</span> ' + prov.cities.length + " Holds</div>" +
        '<div class="tw-tooltip__row"><span>Climate:</span> ' + esc(prov.climate) + "</div>" +
        '<div class="tw-tooltip__row"><span>Untainted:</span> ' + esc(prov.untainted) + "</div>" +
        '<div class="tw-tooltip__row"><span>Arsenal:</span> ' + esc(prov.windsOfMagic) + "</div>" +
      "</div>" +
      '<div class="tw-tooltip__tag">' + esc(prov.summary) + "</div>";
    tooltipEl.classList.add("is-visible");
    tooltipEl.setAttribute("aria-hidden", "false");
    moveTooltip(cx, cy);
  }

  function showCityTooltip(city, prov, cx, cy) {
    tooltipEl.innerHTML =
      '<div class="tw-tooltip__head">' +
        '<span class="tw-tooltip__title">' + esc(city.holdName) + " · " + esc(city.title) + "</span>" +
        '<span class="tw-tooltip__faction">Tier ' + esc(city.tier) + "</span>" +
      "</div>" +
      '<div class="tw-tooltip__rows">' +
        '<div class="tw-tooltip__row"><span>Province:</span> ' + esc(prov.loreName) + " (" + esc(prov.category) + ")</div>" +
        '<div class="tw-tooltip__row"><span>Terrain:</span> ' + esc(city.terrain) + "</div>" +
        '<div class="tw-tooltip__row"><span>Construction Options:</span> ' + city.constructionOptions.length + " Building Chains</div>" +
        '<div class="tw-tooltip__row"><span>Stack:</span> ' + esc(city.stack.slice(0, 4).join(" · ")) + "</div>" +
      "</div>" +
      '<div class="tw-tooltip__tag">' + esc(city.tagline) + "</div>";
    tooltipEl.classList.add("is-visible");
    tooltipEl.setAttribute("aria-hidden", "false");
    moveTooltip(cx, cy);
  }

  function moveTooltip(cx, cy) {
    var pad = 16;
    var w = 304, h = tooltipEl.offsetHeight || 170;
    var x = cx + 18;
    var y = cy + 16;
    if (x + w + pad > window.innerWidth) x = cx - w - 16;
    if (y + h + pad > window.innerHeight) y = cy - h - 14;
    tooltipEl.style.transform = "translate3d(" + Math.max(8, x) + "px," + Math.max(8, y) + "px,0)";
  }

  function hideTooltip() {
    tooltipEl.classList.remove("is-visible");
    tooltipEl.setAttribute("aria-hidden", "true");
  }

  /* ===================== STRATEGIC PARCHMENT MINIMAP ===================== */
  var minimapReticle = null;

  function buildMinimap() {
    var svg = "";
    // Subtle mountain ridge hachures along the World's Edge spine
    svg += '<path d="M18,-76 Q8,-40 0,-8 T-10,68" fill="none" stroke="rgba(68,48,22,0.35)" stroke-width="16" stroke-linecap="round"/>';
    svg += '<path d="M18,-76 Q8,-40 0,-8 T-10,68" fill="none" stroke="rgba(52,35,14,0.45)" stroke-width="5" stroke-dasharray="3 4" stroke-linecap="round"/>';

    // Province polygons
    DATA.provinces.forEach(function (prov) {
      var pts = prov.border.map(function (p) { return p[0] + "," + p[1]; }).join(" ");
      svg += '<polygon class="mm-prov" data-mm-prov="' + prov.id + '" points="' + pts + '" fill="' + prov.color + '"/>';
    });

    // Underway lines on minimap
    (DATA.underwayRoutes || []).forEach(function (route) {
      var pts = route.map(function (p) { return p[0] + "," + p[1]; }).join(" ");
      svg += '<polyline points="' + pts + '" fill="none" stroke="#2c1d0b" stroke-width="1.1" stroke-dasharray="2.4 2.4" opacity="0.7" pointer-events="none"/>';
    });

    // Settlement pins on minimap
    DATA.provinces.forEach(function (prov) {
      prov.cities.forEach(function (city) {
        if (city.isCapital) {
          svg += '<rect x="' + (city.coords.x - 2.6) + '" y="' + (city.coords.z - 2.6) + '" width="5.2" height="5.2" fill="#fff3cf" stroke="#1e1408" stroke-width="1.1" pointer-events="none"/>';
        } else {
          svg += '<circle cx="' + city.coords.x + '" cy="' + city.coords.z + '" r="2.1" fill="#efe2c2" stroke="#1e1408" stroke-width="1" pointer-events="none"/>';
        }
      });
    });

    // Camera viewport box / reticle
    svg += '<g id="mmReticle" pointer-events="none">' +
      '<rect x="-16" y="-12" width="32" height="24" fill="rgba(255,243,207,0.12)" stroke="#fff3cf" stroke-width="1.5"/>' +
      '<circle cx="0" cy="0" r="2" fill="#fff3cf"/>' +
    "</g>";

    minimapSvg.innerHTML = svg;
    minimapReticle = document.getElementById("mmReticle");

    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (poly) {
      poly.addEventListener("click", function (e) {
        e.stopPropagation();
        enterProvince(poly.getAttribute("data-mm-prov"));
      });
    });
  }

  function updateMinimapReticle() {
    if (!minimapReticle) return;
    var scale = Math.max(0.45, Math.min(2.1, camRig.dist / 68));
    minimapReticle.setAttribute(
      "transform",
      "translate(" + camRig.target.x.toFixed(1) + " " + camRig.target.z.toFixed(1) + ") scale(" + scale.toFixed(2) + ")"
    );
  }

  /* ===================== 3-TIER NAVIGATION & SETTLEMENT PANEL ===================== */
  function syncTierClasses() {
    document.body.setAttribute("data-tier", state.tier);

    // Highlight active province on minimap
    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (el) {
      var pid = el.getAttribute("data-mm-prov");
      el.classList.toggle("is-active", pid === state.activeProvinceId || pid === state.hoveredProvinceId);
    });

    // Dim non-active cities in province/settlement tiers & mark selected city
    markerNodes.cities.forEach(function (m) {
      var inActiveProv = !state.activeProvinceId || m.prov.id === state.activeProvinceId;
      m.el.classList.toggle("is-dimmed", state.tier !== "strategic" && !inActiveProv);
      m.el.classList.toggle("is-selected", state.tier === "settlement" && m.city.id === state.activeCityId);
    });

    // Update top context breadcrumb bar
    if (state.tier === "strategic") {
      contextCrumb.textContent = "World's Edge Mountains · Strategic Overview";
      contextHint.textContent = "Click a region banner to zoom into its cities · Drag to pan · Scroll to zoom";
      contextBackBtn.hidden = true;
      minimapZoomLabel.textContent = "Strategic";
    } else if (state.tier === "province") {
      var p = getProvince(state.activeProvinceId);
      contextCrumb.textContent = p ? (p.loreName + " ▸ " + p.category) : "Province View";
      contextHint.textContent = "Click any city banner to inspect its Construction Options";
      contextBackBtn.hidden = false;
      contextBackBtn.textContent = "← Strategic Map";
      minimapZoomLabel.textContent = p ? p.loreName : "Province";
    } else if (state.tier === "settlement") {
      var found = findCity(state.activeCityId);
      if (found) {
        contextCrumb.textContent = found.province.category + " ▸ " + found.city.holdName + " (" + found.city.title + ")";
        contextHint.textContent = "Select Construction Options below for detailed engineering breakdowns";
        contextBackBtn.hidden = false;
        contextBackBtn.textContent = "↑ " + found.province.loreName;
        minimapZoomLabel.textContent = found.city.holdName;
      }
    }

    sync3DBorderHighlights();
  }

  function goStrategic() {
    state.tier = "strategic";
    state.activeProvinceId = null;
    state.activeCityId = null;
    camRig.goalTarget.x = 0;
    camRig.goalTarget.y = 5;
    camRig.goalTarget.z = -5;
    camRig.goalYaw = -0.17;
    camRig.goalPitch = 0.84;
    camRig.goalDist = defaultStrategicDist();
    syncTierClasses();
  }

  function enterProvince(provinceId) {
    var prov = getProvince(provinceId);
    if (!prov) return;
    state.tier = "province";
    state.activeProvinceId = prov.id;
    state.activeCityId = null;

    var h = terrainHeight(prov.center.x, prov.center.z);
    camRig.goalTarget.x = prov.center.x;
    camRig.goalTarget.y = h + 1.5;
    camRig.goalTarget.z = prov.center.z + 2;
    camRig.goalYaw = -0.14;
    camRig.goalPitch = 0.66;
    camRig.goalDist = window.innerWidth < 760 ? 74 : 56;

    syncTierClasses();
  }

  function openCity(cityId, optionIdx) {
    var found = findCity(cityId);
    if (!found) return;
    state.tier = "settlement";
    state.activeProvinceId = found.province.id;
    state.activeCityId = found.city.id;
    state.activeOptionIdx = optionIdx || 0;

    var h = terrainHeight(found.city.coords.x, found.city.coords.z);
    // Shift camera target slightly south (+z) so the 3D hold frames cleanly above the bottom Construction HUD
    camRig.goalTarget.x = found.city.coords.x;
    camRig.goalTarget.y = h + 1.0;
    camRig.goalTarget.z = found.city.coords.z + (window.innerWidth < 760 ? 9.5 : 7.5);
    camRig.goalYaw = -0.11;
    camRig.goalPitch = 0.61;
    camRig.goalDist = window.innerWidth < 760 ? 48 : 37;

    renderSettlementPanel(found.province, found.city);
    syncTierClasses();
  }

  function renderSettlementPanel(prov, city) {
    // 1. Top bar: all holds in this province
    var tabsHtml = '<span class="sh-prov-label">' + esc(prov.loreName) + " — " + esc(prov.category) + ":</span>";
    prov.cities.forEach(function (c) {
      var active = c.id === city.id ? " is-active" : "";
      tabsHtml +=
        '<button type="button" class="hold-tab' + active + '" data-switch-city="' + c.id + '">' +
          '<span class="hold-tab__tier">' + esc(c.tier) + "</span>" +
          "<span>" + esc(c.title) + " <small style=\"opacity:.72\">(" + esc(c.holdName) + ")</small></span>" +
        "</button>";
    });
    var tabsContainer = document.getElementById("shHoldsTabs");
    tabsContainer.innerHTML = tabsHtml;
    Array.prototype.forEach.call(tabsContainer.querySelectorAll("[data-switch-city]"), function (btn) {
      btn.addEventListener("click", function () {
        openCity(btn.getAttribute("data-switch-city"), 0);
      });
    });

    // 2. City header
    document.getElementById("shCityHead").innerHTML =
      '<div class="sh-city-head__kicker">' + esc(city.holdName) + " · " + esc(city.tierLabel) + "</div>" +
      '<h2 class="sh-city-head__title">' + esc(city.title) + "</h2>" +
      '<p class="sh-city-head__tagline">' + esc(city.tagline) + "</p>";

    // 3. Construction Options list
    var opts = city.constructionOptions || [];
    document.getElementById("shSlotCount").textContent =
      opts.length + (opts.length === 1 ? " Construction Option" : " Construction Options");

    var slotsHtml = "";
    opts.forEach(function (opt, idx) {
      var sel = idx === state.activeOptionIdx;
      var iconSvg = ICONS[opt.icon] || ICONS.citadel;
      slotsHtml +=
        '<button type="button" role="tab" aria-selected="' + (sel ? "true" : "false") + '" class="b-slot' + (sel ? " is-selected" : "") + '" data-opt-idx="' + idx + '">' +
          '<span class="b-slot__icon" aria-hidden="true">' +
            iconSvg +
            '<span class="b-slot__tier">' + esc(opt.tier) + "</span>" +
          "</span>" +
          "<span>" +
            '<div class="b-slot__topic">' + esc(opt.topic) + "</div>" +
            '<div class="b-slot__name">' + esc(opt.buildingName) + "</div>" +
          "</span>" +
          '<span class="b-slot__badge">' + esc(opt.cost) + "</span>" +
        "</button>";
    });
    var slotsEl = document.getElementById("shBuildingSlots");
    slotsEl.innerHTML = slotsHtml;
    Array.prototype.forEach.call(slotsEl.querySelectorAll("[data-opt-idx]"), function (btn) {
      btn.addEventListener("click", function () {
        state.activeOptionIdx = +btn.getAttribute("data-opt-idx");
        renderSettlementPanel(prov, city);
      });
    });

    // 4. Selected Construction Option Detailed Blueprint
    var curOpt = opts[state.activeOptionIdx] || opts[0];
    if (!curOpt) return;

    var effectsHtml = "";
    (curOpt.effects || []).forEach(function (ef) {
      effectsHtml +=
        "<li>" +
          '<span class="blueprint-effects__diamond" aria-hidden="true">◆</span>' +
          "<span><strong>" + esc(ef[0]) + "</strong> " + esc(ef[1]) + "</span>" +
        "</li>";
    });

    var unlocksHtml = "";
    (curOpt.unlocks || []).forEach(function (u) {
      unlocksHtml += '<span class="unlock-chip">' + esc(u) + "</span>";
    });

    var actionLinksHtml = "";
    if (curOpt.links && curOpt.links.length) {
      curOpt.links.forEach(function (lnk) {
        var ext = lnk.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        actionLinksHtml += '<a class="sh-btn" href="' + esc(lnk.url) + '"' + ext + ">" + esc(lnk.label) + "</a>";
      });
    } else if (city.repoUrl) {
      var isMail = city.repoUrl.indexOf("mailto:") === 0;
      var extAttr = isMail ? "" : ' target="_blank" rel="noopener noreferrer"';
      var btnLabel = isMail ? "Send Envoy (Email) →" : "View on GitHub ↗";
      actionLinksHtml =
        '<span class="bp-repo-path">' + esc(city.repoPath || "") + "</span>" +
        '<a class="sh-btn" href="' + esc(city.repoUrl) + '"' + extAttr + ">" + btnLabel + "</a>";
    }

    var detailCol = document.getElementById("shDetailCol");
    detailCol.innerHTML =
      '<div class="blueprint-head">' +
        "<div>" +
          '<div class="blueprint-head__slot">' + esc(curOpt.slotType) + " · Tier " + esc(curOpt.tier) + " — " + esc(curOpt.buildingName) + "</div>" +
          '<h3 class="blueprint-head__title">' + esc(curOpt.topic) + "</h3>" +
        "</div>" +
        '<div class="blueprint-head__meta">' +
          '<span class="bp-pill">⚒ ' + esc(curOpt.cost) + "</span>" +
          '<span class="bp-pill">⏳ ' + esc(curOpt.turns) + "</span>" +
        "</div>" +
      "</div>" +
      '<p class="blueprint-desc">' + esc(curOpt.description) + "</p>" +
      '<ul class="blueprint-effects">' + effectsHtml + "</ul>" +
      '<div class="blueprint-foot">' +
        '<div class="unlock-chips">' + unlocksHtml + "</div>" +
        '<div class="bp-links">' + actionLinksHtml + "</div>" +
      "</div>";
    detailCol.scrollTop = 0;
  }

  /* ===================== GREAT BOOK OF WORKS (LEDGER MODAL) ===================== */
  var ledgerModal = document.getElementById("ledgerModal");

  function buildLedger() {
    var html = "";
    DATA.provinces.forEach(function (prov) {
      html +=
        '<section class="ledger-prov">' +
          '<div class="ledger-prov__head">' +
            '<h3 class="ledger-prov__title">' + esc(prov.category) + "</h3>" +
            '<span class="ledger-prov__lore">Province: ' + esc(prov.loreName) + " · " + prov.cities.length + " Holds</span>" +
          "</div>" +
          '<div class="ledger-grid">';
      prov.cities.forEach(function (city) {
        html +=
          '<button type="button" class="ledger-card" data-ledger-city="' + city.id + '">' +
            "<div>" +
              '<div class="ledger-card__hold">' + esc(city.holdName) + " · Tier " + esc(city.tier) + "</div>" +
              '<div class="ledger-card__name">' + esc(city.title) + "</div>" +
            "</div>" +
            '<p class="ledger-card__tag">' + esc(city.tagline) + "</p>" +
            '<div class="ledger-card__foot">' +
              "<span>" + city.constructionOptions.length + " Construction Options</span>" +
              "<span>Inspect Hold →</span>" +
            "</div>" +
          "</button>";
      });
      html += "</div></section>";
    });

    var container = document.getElementById("ledgerContent");
    container.innerHTML = html;
    Array.prototype.forEach.call(container.querySelectorAll("[data-ledger-city]"), function (btn) {
      btn.addEventListener("click", function () {
        var cid = btn.getAttribute("data-ledger-city");
        closeLedger();
        openCity(cid, 0);
      });
    });
  }

  function openLedger() {
    ledgerModal.classList.add("is-open");
    ledgerModal.setAttribute("aria-hidden", "false");
    document.getElementById("ledgerCloseBtn").focus();
  }

  function closeLedger() {
    ledgerModal.classList.remove("is-open");
    ledgerModal.setAttribute("aria-hidden", "true");
  }

  /* ===================== THREE.JS 3D WORLD'S EDGE MOUNTAINS ENGINE ===================== */
  var hasThree = typeof window.THREE !== "undefined";
  var renderer = null, scene = null, camera = null;
  var terrainMesh = null;
  var borderGroup = null, underwayGroup = null, holdsGroup = null;
  var borderLinesByProv = {};
  var holdRingsByCity = {};
  var holdHitMeshes = [];
  var lavaLight = null;
  var mistSprites = [];

  function setHoveredProvince(pid) {
    if (state.hoveredProvinceId === pid) return;
    state.hoveredProvinceId = pid;
    sync3DBorderHighlights();
    Array.prototype.forEach.call(minimapSvg.querySelectorAll(".mm-prov"), function (el) {
      var id = el.getAttribute("data-mm-prov");
      el.classList.toggle("is-active", id === state.activeProvinceId || id === state.hoveredProvinceId);
    });
  }

  function sync3DBorderHighlights() {
    if (!hasThree) return;
    DATA.provinces.forEach(function (prov) {
      var entry = borderLinesByProv[prov.id];
      if (!entry) return;
      var highlighted = prov.id === state.activeProvinceId || prov.id === state.hoveredProvinceId;
      entry.main.material.opacity = highlighted ? 0.98 : 0.58;
      entry.glow.material.opacity = highlighted ? 0.45 : 0.14;
    });
    Object.keys(holdRingsByCity).forEach(function (cid) {
      var ring = holdRingsByCity[cid];
      ring.material.opacity = (state.tier === "settlement" && state.activeCityId === cid) ? 0.92 : 0.25;
    });
  }

  function createMistTexture() {
    var c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    g.addColorStop(0, "rgba(218, 226, 236, 0.34)");
    g.addColorStop(0.5, "rgba(186, 198, 212, 0.14)");
    g.addColorStop(1, "rgba(160, 174, 190, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function initThreeScene() {
    if (!hasThree) return false;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (err) {
      hasThree = false;
      return false;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x161a20, 1);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1b2028, 0.0046);

    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 1, 460);

    // Campaign lighting: crisp alpine sunlight + cool sky fill + molten Death Pass glow
    var hemi = new THREE.HemisphereLight(0xcfe0f5, 0x2c221b, 0.72);
    scene.add(hemi);

    var sun = new THREE.DirectionalLight(0xfff0d4, 1.08);
    sun.position.set(-68, 96, 44);
    scene.add(sun);

    var rim = new THREE.DirectionalLight(0x7aa4d6, 0.36);
    rim.position.set(70, 52, -70);
    scene.add(rim);

    lavaLight = new THREE.PointLight(0xff5b14, 1.9, 54, 1.6);
    lavaLight.position.set(-7, 8, 32);
    scene.add(lavaLight);

    // 1. Sculpted World's Edge Mountains Terrain Mesh
    var W = 176, D = 224, segX = 210, segZ = 268;
    var geo = new THREE.PlaneGeometry(W, D, segX, segZ);
    geo.rotateX(-Math.PI / 2);

    var pos = geo.attributes.position;
    var colors = new Float32Array(pos.count * 3);

    for (var i = 0; i < pos.count; i++) {
      var vx = pos.getX(i);
      var vz = pos.getZ(i);
      var vh = terrainHeight(vx, vz);
      pos.setY(i, vh);

      var sl = terrainSlope(vx, vz);
      var rgb = terrainColor(vx, vz, vh, sl);
      colors[i * 3] = rgb[0];
      colors[i * 3 + 1] = rgb[1];
      colors[i * 3 + 2] = rgb[2];
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    var terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.91,
      metalness: 0.05,
      flatShading: true
    });
    terrainMesh = new THREE.Mesh(geo, terrainMat);
    scene.add(terrainMesh);

    // 2. Alpine Pine Forests (single InstancedMesh draw call)
    buildPineForest();

    // 3. Draped 3D Province Borders
    borderGroup = new THREE.Group();
    DATA.provinces.forEach(function (prov) {
      var rawPts = prov.border.map(function (pt) {
        return new THREE.Vector3(pt[0], terrainHeight(pt[0], pt[1]) + 0.48, pt[1]);
      });
      var curve = new THREE.CatmullRomCurve3(rawPts, true, "catmullrom", 0.35);
      var sampled = curve.getPoints(110);
      sampled.forEach(function (v) {
        v.y = terrainHeight(v.x, v.z) + 0.46;
      });

      var lineGeo = new THREE.BufferGeometry().setFromPoints(sampled);
      var mainMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(prov.accent || prov.color),
        transparent: true,
        opacity: 0.58
      });
      var mainLine = new THREE.LineLoop(lineGeo, mainMat);

      var glowPts = sampled.map(function (v) {
        return new THREE.Vector3(v.x, v.y + 0.32, v.z);
      });
      var glowGeo = new THREE.BufferGeometry().setFromPoints(glowPts);
      var glowMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(prov.color),
        transparent: true,
        opacity: 0.16
      });
      var glowLine = new THREE.LineLoop(glowGeo, glowMat);

      borderGroup.add(mainLine);
      borderGroup.add(glowLine);
      borderLinesByProv[prov.id] = { main: mainLine, glow: glowLine };
    });
    scene.add(borderGroup);

    // 4. Dwarfen Underway / Mountain Pass Routes
    underwayGroup = new THREE.Group();
    var stoneDotGeo = new THREE.BoxGeometry(0.65, 0.28, 0.65);
    var stoneDotMat = new THREE.MeshStandardMaterial({
      color: 0xd9b66c,
      emissive: 0x3b2a10,
      roughness: 0.6
    });
    (DATA.underwayRoutes || []).forEach(function (route) {
      var pts = route.map(function (p) {
        return new THREE.Vector3(p[0], terrainHeight(p[0], p[1]) + 0.3, p[1]);
      });
      var curve = new THREE.CatmullRomCurve3(pts, false);
      var steps = 38;
      for (var s = 0; s <= steps; s++) {
        var v = curve.getPoint(s / steps);
        var m = new THREE.Mesh(stoneDotGeo, stoneDotMat);
        m.position.set(v.x, terrainHeight(v.x, v.z) + 0.22, v.z);
        underwayGroup.add(m);
      }
    });
    scene.add(underwayGroup);

    // 5. 3D Dwarfen Stronghold Miniatures at Each City
    holdsGroup = new THREE.Group();
    DATA.provinces.forEach(function (prov) {
      prov.cities.forEach(function (city) {
        buildDwarfHoldMesh(city, prov);
      });
    });
    scene.add(holdsGroup);

    // 6. Valley Mist Clouds
    var mistTex = createMistTexture();
    var mistPositions = [
      [-26, 7.5, -14, 34], [8, 9.2, -11, 28], [-16, 6.5, 22, 32],
      [14, 11.5, -52, 34], [-18, 8.2, 56, 36], [26, 8.5, 14, 30]
    ];
    mistPositions.forEach(function (mp, i) {
      var smat = new THREE.SpriteMaterial({
        map: mistTex,
        transparent: true,
        opacity: 0.42,
        depthWrite: false
      });
      var sp = new THREE.Sprite(smat);
      sp.position.set(mp[0], mp[1], mp[2]);
      sp.scale.set(mp[3], mp[3] * 0.45, 1);
      scene.add(sp);
      mistSprites.push({ sprite: sp, baseX: mp[0], speed: 0.18 + i * 0.04, phase: i * 1.3 });
    });

    return true;
  }

  function buildPineForest() {
    var candidates = [];
    var seed = 41;
    function rnd() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (var i = 0; i < 1900 && candidates.length < 620; i++) {
      var x = -66 + rnd() * 124;
      var z = -82 + rnd() * 164;
      if (z > 28 && rnd() < 0.82) continue; // Sparse trees in volcanic Badlands
      var h = terrainHeight(x, z);
      if (h < 1.8 || h > 9.4) continue;
      if (lavaFactor(x, z) > 0.02) continue;
      var sl = terrainSlope(x, z);
      if (sl > 0.92) continue;

      // Keep clear of city strongholds
      var nearHold = false;
      for (var c = 0; c < ALL_CITIES.length; c++) {
        if (Math.hypot(x - ALL_CITIES[c].x, z - ALL_CITIES[c].z) < 4.5) {
          nearHold = true;
          break;
        }
      }
      if (nearHold) continue;

      // Prefer western forested slopes & sheltered Silver Road / Peak Pass valleys
      var sx = spineCenterX(z);
      if (x > sx + 14 && rnd() < 0.75) continue;

      candidates.push({ x: x, y: h, z: z, s: 0.65 + rnd() * 0.65 });
    }

    if (!candidates.length) return;
    var coneGeo = new THREE.ConeGeometry(0.55, 1.9, 5);
    coneGeo.translate(0, 0.95, 0);
    var treeMat = new THREE.MeshStandardMaterial({
      color: 0x22321d,
      roughness: 0.95,
      flatShading: true
    });
    var inst = new THREE.InstancedMesh(coneGeo, treeMat, candidates.length);
    var dummy = new THREE.Object3D();
    candidates.forEach(function (t, idx) {
      dummy.position.set(t.x, t.y - 0.1, t.z);
      dummy.scale.set(t.s, t.s * (0.9 + (idx % 3) * 0.15), t.s);
      dummy.rotation.y = idx * 1.1;
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
    scene.add(inst);
  }

  function buildDwarfHoldMesh(city, prov) {
    var gx = city.coords.x, gz = city.coords.z;
    var gy = terrainHeight(gx, gz);
    var group = new THREE.Group();
    group.position.set(gx, gy, gz);

    var scale = city.isCapital ? 1.28 : 0.96;
    var stoneMat = new THREE.MeshStandardMaterial({ color: 0x56524d, roughness: 0.85, flatShading: true });
    var brassMat = new THREE.MeshStandardMaterial({ color: 0xd4ad63, roughness: 0.42, metalness: 0.55 });
    var bannerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(prov.color),
      emissive: new THREE.Color(prov.color).multiplyScalar(0.28),
      roughness: 0.5
    });
    var hearthMat = new THREE.MeshBasicMaterial({ color: 0xffb347 });

    // Stepped citadel plinth
    var base = new THREE.Mesh(new THREE.BoxGeometry(3.2 * scale, 1.8 * scale, 2.8 * scale), stoneMat);
    base.position.y = 0.7 * scale;
    group.add(base);

    // Central Dwarfen keep
    var keep = new THREE.Mesh(new THREE.BoxGeometry(2.0 * scale, 2.2 * scale, 1.9 * scale), stoneMat);
    keep.position.set(0, 1.8 * scale, -0.2 * scale);
    group.add(keep);

    // Brass roof crown
    var crown = new THREE.Mesh(new THREE.ConeGeometry(1.55 * scale, 1.0 * scale, 4), brassMat);
    crown.rotation.y = Math.PI / 4;
    crown.position.set(0, 3.35 * scale, -0.2 * scale);
    group.add(crown);

    // Flanking bastion towers
    [-1.35, 1.35].forEach(function (ox) {
      var tower = new THREE.Mesh(new THREE.CylinderGeometry(0.48 * scale, 0.58 * scale, 2.5 * scale, 6), stoneMat);
      tower.position.set(ox * scale, 1.45 * scale, 0.7 * scale);
      group.add(tower);

      var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * scale, 0.55 * scale, 0.24 * scale, 6), brassMat);
      cap.position.set(ox * scale, 2.75 * scale, 0.7 * scale);
      group.add(cap);
    });

    // Warm forge portal glow
    var gateGlow = new THREE.Mesh(new THREE.BoxGeometry(0.65 * scale, 0.85 * scale, 0.2 * scale), hearthMat);
    gateGlow.position.set(0, 1.0 * scale, 1.38 * scale);
    group.add(gateGlow);

    // Heraldic standard
    var flag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2 * scale, 0.75 * scale), bannerMat);
    flag.position.set(0, 4.15 * scale, -0.2 * scale);
    group.add(flag);

    // Selection ring around stronghold base
    var ringGeo = new THREE.RingGeometry(2.2 * scale, 2.55 * scale, 28);
    ringGeo.rotateX(-Math.PI / 2);
    var ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(prov.accent || 0xf0d79c),
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.25;
    group.add(ring);
    holdRingsByCity[city.id] = ring;

    // Invisible click hit volume for direct 3D stronghold clicking
    var hit = new THREE.Mesh(
      new THREE.CylinderGeometry(3.0 * scale, 3.0 * scale, 5.0 * scale, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.y = 2.0 * scale;
    hit.userData = { cityId: city.id, provinceId: prov.id };
    group.add(hit);
    holdHitMeshes.push(hit);

    holdsGroup.add(group);
  }

  /* ===================== OFFLINE / NO-WEBGL 3D SOFTWARE CANVAS FALLBACK ===================== */
  var ctx2d = null;
  function initFallbackCanvas() {
    ctx2d = canvasEl.getContext("2d");
    resizeFallback();
  }
  function resizeFallback() {
    if (!ctx2d) return;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
  }

  function projectPointFallback(wx, wy, wz, camPos) {
    var dx = wx - camRig.target.x;
    var dy = wy - camRig.target.y;
    var dz = wz - camRig.target.z;

    var cy = Math.cos(-camRig.yaw), sy = Math.sin(-camRig.yaw);
    var rx = dx * cy - dz * sy;
    var rz = dx * sy + dz * cy;

    var cp = Math.cos(camRig.pitch), sp = Math.sin(camRig.pitch);
    var vz = rz * cp - dy * sp + camRig.dist;
    var vy = rz * sp + dy * cp;
    if (vz < 2) return null;

    var fovScale = (window.innerHeight * 0.5) / Math.tan((42 * Math.PI) / 360);
    return {
      x: window.innerWidth * 0.5 + (rx / vz) * fovScale,
      y: window.innerHeight * 0.5 - (vy / vz) * fovScale,
      depth: vz
    };
  }

  function renderFallbackCanvas() {
    if (!ctx2d) return;
    var W = canvasEl.width, H = canvasEl.height;
    var bg = ctx2d.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#12161d");
    bg.addColorStop(1, "#1b1714");
    ctx2d.fillStyle = bg;
    ctx2d.fillRect(0, 0, W, H);

    // Back-to-front shaded elevation strips
    var step = 3.5;
    for (var z = -88; z <= 88; z += step) {
      for (var x = -68; x <= 68; x += step) {
        var h = terrainHeight(x, z);
        var p = projectPointFallback(x, h, z);
        if (!p || p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) continue;
        var rgb = terrainColor(x, z, h, terrainSlope(x, z));
        var sz = Math.max(4, (280 / p.depth) * step);
        ctx2d.fillStyle =
          "rgb(" + Math.round(rgb[0] * 255) + "," + Math.round(rgb[1] * 255) + "," + Math.round(rgb[2] * 255) + ")";
        ctx2d.fillRect(p.x - sz * 0.5, p.y - sz * 0.5, sz + 1, sz + 1);
      }
    }

    // Province borders in fallback mode
    if (state.showBorders) {
      DATA.provinces.forEach(function (prov) {
        ctx2d.beginPath();
        prov.border.forEach(function (pt, idx) {
          var pp = projectPointFallback(pt[0], terrainHeight(pt[0], pt[1]) + 0.5, pt[1]);
          if (!pp) return;
          if (idx === 0) ctx2d.moveTo(pp.x, pp.y);
          else ctx2d.lineTo(pp.x, pp.y);
        });
        ctx2d.closePath();
        ctx2d.strokeStyle = prov.accent || prov.color;
        ctx2d.lineWidth = (prov.id === state.activeProvinceId || prov.id === state.hoveredProvinceId) ? 2.6 : 1.4;
        ctx2d.stroke();
      });
    }
  }

  /* ===================== CAMERA CONTROLS (PAN, ORBIT, ZOOM, RAYCAST CLICK) ===================== */
  var drag = { active: false, button: 0, startX: 0, startY: 0, lastX: 0, lastY: 0, moved: 0 };

  function clampCameraGoals() {
    camRig.goalTarget.x = Math.max(-52, Math.min(52, camRig.goalTarget.x));
    camRig.goalTarget.z = Math.max(-76, Math.min(78, camRig.goalTarget.z));
    camRig.goalDist = Math.max(26, Math.min(168, camRig.goalDist));
    camRig.goalPitch = Math.max(0.42, Math.min(1.12, camRig.goalPitch));
    camRig.goalYaw = Math.max(-0.85, Math.min(0.85, camRig.goalYaw));
  }

  stageEl.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  stageEl.addEventListener("pointerdown", function (e) {
    drag.active = true;
    drag.button = e.button;
    drag.startX = drag.lastX = e.clientX;
    drag.startY = drag.lastY = e.clientY;
    drag.moved = 0;
    stageEl.setPointerCapture(e.pointerId);
  });

  stageEl.addEventListener("pointermove", function (e) {
    if (!drag.active) {
      handleTerrainHover(e.clientX, e.clientY);
      return;
    }
    var dx = e.clientX - drag.lastX;
    var dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.moved += Math.hypot(dx, dy);

    if (drag.button === 2 || e.shiftKey) {
      // Right-drag or Shift+drag orbits camera angle
      camRig.goalYaw -= dx * 0.0045;
      camRig.goalPitch = Math.max(0.45, Math.min(1.08, camRig.goalPitch + dy * 0.0038));
    } else {
      // Left-drag pans across the World's Edge Mountains
      var panSpeed = camRig.dist * 0.00115;
      var cy = Math.cos(camRig.yaw), sy = Math.sin(camRig.yaw);
      camRig.goalTarget.x -= (dx * cy + dy * sy) * panSpeed;
      camRig.goalTarget.z -= (-dx * sy + dy * cy) * panSpeed;
      camRig.goalTarget.y = terrainHeight(camRig.goalTarget.x, camRig.goalTarget.z) * 0.55 + 2;
    }
    clampCameraGoals();
  });

  stageEl.addEventListener("pointerup", function (e) {
    if (!drag.active) return;
    drag.active = false;
    if (drag.moved < 6 && drag.button === 0) {
      handleTerrainClick(e.clientX, e.clientY);
    }
  });

  stageEl.addEventListener("wheel", function (e) {
    e.preventDefault();
    var factor = e.deltaY > 0 ? 1.11 : 0.9;
    camRig.goalDist *= factor;
    clampCameraGoals();

    // Zooming all the way out returns smoothly to Strategic Region View
    if (state.tier === "province" && camRig.goalDist > 112) {
      state.tier = "strategic";
      state.activeProvinceId = null;
      syncTierClasses();
    }
  }, { passive: false });

  var raycaster = hasThree ? new THREE.Raycaster() : null;
  var pointerNDC = hasThree ? new THREE.Vector2() : null;

  function raycastMap(clientX, clientY) {
    if (!hasThree || !camera || !terrainMesh) return null;
    pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
    pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);

    // Check 3D Dwarfen stronghold hit volumes first
    var holdHits = raycaster.intersectObjects(holdHitMeshes, false);
    if (holdHits.length > 0) {
      return {
        type: "city",
        cityId: holdHits[0].object.userData.cityId,
        provinceId: holdHits[0].object.userData.provinceId
      };
    }

    // Check 3D terrain inside province borders
    var hits = raycaster.intersectObject(terrainMesh, false);
    if (hits.length > 0) {
      var p = hits[0].point;
      for (var i = 0; i < DATA.provinces.length; i++) {
        if (pointInPoly(p.x, p.z, DATA.provinces[i].border)) {
          return { type: "province", provinceId: DATA.provinces[i].id };
        }
      }
      return { type: "wilderness" };
    }
    return null;
  }

  function handleTerrainHover(clientX, clientY) {
    var hit = raycastMap(clientX, clientY);
    if (hit && (hit.type === "province" || hit.type === "city")) {
      setHoveredProvince(hit.provinceId);
      stageEl.style.cursor = "pointer";
    } else {
      setHoveredProvince(null);
      stageEl.style.cursor = "grab";
    }
  }

  function handleTerrainClick(clientX, clientY) {
    var hit = raycastMap(clientX, clientY);
    if (!hit) return;
    if (hit.type === "city") {
      if (state.tier === "strategic") enterProvince(hit.provinceId);
      else openCity(hit.cityId, 0);
    } else if (hit.type === "province") {
      if (state.tier === "strategic" || state.activeProvinceId !== hit.provinceId) {
        enterProvince(hit.provinceId);
      } else if (state.tier === "settlement") {
        enterProvince(hit.provinceId);
      }
    } else if (hit.type === "wilderness") {
      if (state.tier === "settlement") enterProvince(state.activeProvinceId);
      else if (state.tier === "province") goStrategic();
    }
  }

  /* ===================== HUD BUTTONS & KEYBOARD BINDINGS ===================== */
  document.getElementById("strategicResetBtn").addEventListener("click", goStrategic);
  document.getElementById("shCloseBtn").addEventListener("click", goStrategic);
  document.getElementById("shProvinceBackBtn").addEventListener("click", function () {
    if (state.activeProvinceId) enterProvince(state.activeProvinceId);
    else goStrategic();
  });
  contextBackBtn.addEventListener("click", function () {
    if (state.tier === "settlement" && state.activeProvinceId) enterProvince(state.activeProvinceId);
    else goStrategic();
  });

  // Profile / High King's Chronicle shortcuts
  function jumpToProfile() {
    openCity("karak-ungor", 0);
  }
  document.getElementById("profileJumpBtn").addEventListener("click", jumpToProfile);
  document.getElementById("factionHomeBtn").addEventListener("click", jumpToProfile);

  // Ledger modal controls
  document.getElementById("ledgerOpenBtn").addEventListener("click", openLedger);
  document.getElementById("ledgerCloseBtn").addEventListener("click", closeLedger);
  ledgerModal.addEventListener("click", function (e) {
    if (e.target === ledgerModal) closeLedger();
  });

  // Map overlay ribbon toggles
  document.getElementById("toggleBordersBtn").addEventListener("click", function (e) {
    state.showBorders = !state.showBorders;
    e.currentTarget.classList.toggle("is-on", state.showBorders);
    if (borderGroup) borderGroup.visible = state.showBorders;
  });
  document.getElementById("toggleUnderwayBtn").addEventListener("click", function (e) {
    state.showUnderway = !state.showUnderway;
    e.currentTarget.classList.toggle("is-on", state.showUnderway);
    if (underwayGroup) underwayGroup.visible = state.showUnderway;
  });
  document.getElementById("toggleLandmarksBtn").addEventListener("click", function (e) {
    state.showLandmarks = !state.showLandmarks;
    e.currentTarget.classList.toggle("is-on", state.showLandmarks);
    document.body.classList.toggle("hide-landmarks", !state.showLandmarks);
  });

  // Bottom-right dial controls
  document.getElementById("zoomInBtn").addEventListener("click", function () {
    camRig.goalDist *= 0.8;
    clampCameraGoals();
  });
  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    camRig.goalDist *= 1.24;
    clampCameraGoals();
    if (state.tier === "province" && camRig.goalDist > 112) goStrategic();
  });
  document.getElementById("cycleProvinceBtn").addEventListener("click", function () {
    state.cycleIdx = (state.cycleIdx + 1) % DATA.provinces.length;
    enterProvince(DATA.provinces[state.cycleIdx].id);
  });

  // Keyboard navigation (Escape + WASD/Arrows)
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (ledgerModal.classList.contains("is-open")) {
        closeLedger();
      } else if (state.tier === "settlement" && state.activeProvinceId) {
        enterProvince(state.activeProvinceId);
      } else if (state.tier === "province") {
        goStrategic();
      }
      return;
    }
    if (ledgerModal.classList.contains("is-open")) return;
    var step = camRig.dist * 0.08;
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") { camRig.goalTarget.z -= step; clampCameraGoals(); }
    else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") { camRig.goalTarget.z += step; clampCameraGoals(); }
    else if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") { camRig.goalTarget.x -= step; clampCameraGoals(); }
    else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") { camRig.goalTarget.x += step; clampCameraGoals(); }
  });

  window.addEventListener("resize", function () {
    if (hasThree && renderer && camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
      resizeFallback();
    }
  });

  /* ===================== MAIN RENDER & 3D MARKER PROJECTION LOOP ===================== */
  var projVec = hasThree ? new THREE.Vector3() : null;

  function projectToScreen(wx, wy, wz) {
    if (hasThree && camera) {
      projVec.set(wx, wy, wz);
      projVec.project(camera);
      if (projVec.z > 1) return null;
      return {
        x: (projVec.x * 0.5 + 0.5) * window.innerWidth,
        y: (-projVec.y * 0.5 + 0.5) * window.innerHeight
      };
    }
    return projectPointFallback(wx, wy, wz);
  }

  function updateMarkerPositions() {
    var W = window.innerWidth, H = window.innerHeight;

    markerNodes.provinces.forEach(function (m) {
      var p = projectToScreen(m.x, m.y, m.z);
      if (!p || p.x < -160 || p.x > W + 160 || p.y < -100 || p.y > H + 100) {
        m.el.style.visibility = "hidden";
      } else {
        m.el.style.visibility = "visible";
        m.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) translate(-50%, -50%)";
      }
    });

    markerNodes.cities.forEach(function (m) {
      var p = projectToScreen(m.x, m.y, m.z);
      if (!p || p.x < -140 || p.x > W + 140 || p.y < -80 || p.y > H + 80) {
        m.el.style.visibility = "hidden";
      } else {
        m.el.style.visibility = "visible";
        m.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) translate(-50%, -100%)";
      }
    });

    markerNodes.landmarks.forEach(function (m) {
      var p = projectToScreen(m.x, m.y, m.z);
      if (!p || p.x < -100 || p.x > W + 100 || p.y < -60 || p.y > H + 60) {
        m.el.style.visibility = "hidden";
      } else {
        m.el.style.visibility = "visible";
        m.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) translate(-50%, -50%)";
      }
    });
  }

  var clockStart = performance.now();

  function tick(now) {
    var t = (now - clockStart) * 0.001;
    var lerp = reduceMotion ? 1 : 0.11;

    camRig.target.x += (camRig.goalTarget.x - camRig.target.x) * lerp;
    camRig.target.y += (camRig.goalTarget.y - camRig.target.y) * lerp;
    camRig.target.z += (camRig.goalTarget.z - camRig.target.z) * lerp;
    camRig.yaw += (camRig.goalYaw - camRig.yaw) * lerp;
    camRig.pitch += (camRig.goalPitch - camRig.pitch) * lerp;
    camRig.dist += (camRig.goalDist - camRig.dist) * lerp;

    if (hasThree && renderer && camera) {
      var horiz = Math.cos(camRig.pitch) * camRig.dist;
      var camX = camRig.target.x + Math.sin(camRig.yaw) * horiz;
      var camZ = camRig.target.z + Math.cos(camRig.yaw) * horiz;
      var camY = camRig.target.y + Math.sin(camRig.pitch) * camRig.dist;

      // Prevent camera from clipping below high mountain peaks
      var groundUnderCam = terrainHeight(camX, camZ) + 4.5;
      camera.position.set(camX, Math.max(camY, groundUnderCam), camZ);
      camera.lookAt(camRig.target.x, camRig.target.y, camRig.target.z);

      if (!reduceMotion) {
        if (lavaLight) {
          lavaLight.intensity = 1.75 + Math.sin(t * 2.8) * 0.45;
        }
        for (var i = 0; i < mistSprites.length; i++) {
          var ms = mistSprites[i];
          ms.sprite.position.x = ms.baseX + Math.sin(t * ms.speed + ms.phase) * 4.5;
        }
      }

      renderer.render(scene, camera);
    } else {
      renderFallbackCanvas();
    }

    updateMarkerPositions();
    updateMinimapReticle();
    requestAnimationFrame(tick);
  }

  /* ===================== BOOTSTRAP ===================== */
  initTopBar();
  buildFloatingMarkers();
  buildMinimap();
  buildLedger();

  if (!initThreeScene()) {
    initFallbackCanvas();
  }

  syncTierClasses();
  requestAnimationFrame(tick);
})();
