/**
 * ============================================================================
 * PORTFOLIO DATA — WORLD'S EDGE MOUNTAINS (TOTAL WAR: WARHAMMER III)
 * ============================================================================
 *
 * HOW TO EDIT OR EXPAND YOUR PORTFOLIO:
 * 1. Zoomed-out Regions = `provinces` array below.
 *    - Each province represents a major category (e.g. App Coding & Software,
 *      Algorithmic Trading & Finance, Research Papers, Instagram, etc.).
 * 2. Cities / Holds = `cities` array inside each province.
 *    - Shown when you click & zoom into a province. Each city is a project
 *      or subsection.
 * 3. Construction Options = `constructionOptions` array inside each city.
 *    - Shown in the bottom Total War Settlement Construction Panel when a city
 *      is selected. Clicking any building slot / construction option displays
 *      its detailed breakdown, building effects, tech unlocks, and links.
 *
 * TIP: Ready-to-enable templates for "Research Papers" (Rib Peaks) and
 * "Instagram & Media" (Eastern Badlands) are included at the bottom of this
 * file — simply uncomment and move them into `provinces` whenever needed!
 */

window.PORTFOLIO_DATA = {
  identity: {
    name: "Sasha Guriev",
    handle: "minmize",
    factionTitle: "Karaz Ankor · Applied-AI & Systems Guild",
    lordTitle: "Builder at the Model–Product Line",
    email: "sasha.guriev.ca@gmail.com",
    github: "https://github.com/minmize",
    tagline:
      "Native Android apps, quantitative attention models, and real-time 3D computer-vision pipelines — forged end to end across the World's Edge Mountains."
  },

  hudStats: [
    { label: "Shipped Systems", value: "5", delta: "+100% E2E", icon: "coin" },
    { label: "Provinces Held", value: "3", delta: "7 Holds", icon: "hold" },
    { label: "Offline Readiness", value: "100%", delta: "Untainted", icon: "rune" }
  ],

  provinces: [
    /* ========================================================================
     * 1. CENTER — THE SILVER ROAD (Thorgrim's Starting Province)
     *    Category: App Coding & Software
     * ======================================================================== */
    {
      id: "silver-road",
      category: "App Coding & Software",
      loreName: "The Silver Road",
      subtitle: "Android SDK · 3D Computer Vision · Browser Tools",
      faction: "Karaz-a-Karak",
      color: "#2f74cc",
      accent: "#6fb1ff",
      climate: "High Alpine Pass",
      untainted: "100% Deterministic Fallbacks",
      windsOfMagic: "Kotlin · Python · Three.js · Vanilla JS",
      summary:
        "The central stronghold corridor of the World's Edge Mountains where Thorgrim Grudgebearer holds court. Houses three shipped software applications spanning on-device Android neural network training, real-time 3D pose coaching, and zero-dependency specification tooling.",
      center: { x: 0, z: -7 },
      camera: { pos: { x: -10, y: 46, z: 40 }, lookAt: { x: 1, y: 5, z: -8 } },
      border: [
        [-36, -24], [-10, -27], [16, -24], [36, -12],
        [37, 13], [16, 18], [-12, 14], [-35, 4]
      ],
      cities: [
        {
          id: "karaz-a-karak",
          holdName: "Karaz-a-Karak",
          title: "NeuralNetworkBuilder",
          isCapital: true,
          tier: "V",
          tierLabel: "Province Capital · Major Engineering Hold",
          terrain: "Everpeak Mountain Citadel",
          tagline: "Build, train, and understand neural networks entirely on-device.",
          repoPath: "NeuralNetworkApp/",
          repoUrl: "https://github.com/minmize",
          coords: { x: -18, z: -10 },
          stack: ["Kotlin", "Encog 3.4", "Apache Commons Math3", "Material 3", "OpenCSV", "Coroutines"],
          constructionOptions: [
            {
              id: "nn-citadel",
              slotType: "Main Settlement Chain",
              tier: "V",
              icon: "citadel",
              buildingName: "Everpeak Computing Citadel",
              topic: "End-to-End Mobile Pipeline",
              cost: "API 36",
              turns: "Shipped",
              description:
                "An Android application that walks the complete machine-learning lifecycle — interactive conceptual tutorials, custom layer and activation architecture design, CSV dataset ingestion, live training execution, and diagnostic evaluation — without ever leaving the phone.",
              effects: [
                ["Full 5-stage workflow:", "Interactive tutorials → architecture builder → dataset loader → local trainer → statistical evaluation."],
                ["Zero cloud dependency:", "Every forward pass, gradient update, and validation check executes directly on the handset."],
                ["Material 3 interface:", "Clean, native Android ergonomics designed for iterative experimentation on mobile screens."]
              ],
              unlocks: ["Kotlin", "Material 3", "Android SDK"]
            },
            {
              id: "nn-foundry",
              slotType: "Engineering Guild",
              tier: "IV",
              icon: "forge",
              buildingName: "Encog Matrix Foundry",
              topic: "On-Device Training Engine",
              cost: "0 Server Calls",
              turns: "Coroutines",
              description:
                "Backed by the Encog 3.4 neural network framework paired with Apache Commons Math3 for regression and classification statistics. Heavy training loops run asynchronously via Kotlin Coroutines against an expanded Android large-heap configuration.",
              effects: [
                ["On-device backpropagation:", "Trains multi-layer perceptrons locally against user-supplied tabular datasets."],
                ["Non-blocking telemetry:", "Kotlin Coroutines stream epoch loss curves to the UI thread without frame drops."],
                ["Statistical rigor:", "Apache Commons Math3 computes error distributions and evaluation metrics post-training."]
              ],
              unlocks: ["Encog 3.4", "Apache Commons Math3", "Kotlin Coroutines"]
            },
            {
              id: "nn-vault",
              slotType: "Infrastructure",
              tier: "III",
              icon: "gate",
              buildingName: "Scoped Vault of Valaya",
              topic: "Permissionless SAF Data I/O",
              cost: "0 Permissions",
              turns: "SAF URI",
              description:
                "Requests zero broad runtime storage permissions in its AndroidManifest. Users open arbitrary CSV files through Android's Storage Access Framework (SAF), granting temporary per-file URI access parsed cleanly via OpenCSV.",
              effects: [
                ["Privacy-first I/O:", "No READ_EXTERNAL_STORAGE prompt; scoped URI grants isolate access to the chosen file."],
                ["Resilient CSV ingestion:", "OpenCSV handles header inspection, column type inference, and malformed row reporting."],
                ["Store-compliant packaging:", "Hardened with R8 shrinking and modern Android target-SDK compliance."]
              ],
              unlocks: ["Storage Access Framework", "OpenCSV", "R8"]
            }
          ]
        },
        {
          id: "pillars-of-grungni",
          holdName: "The Pillars of Grungni",
          title: "Movement Correction",
          isCapital: false,
          tier: "IV",
          tierLabel: "Runic Optics Stronghold",
          terrain: "Glacial Valley Hold",
          tagline: "Real-time posture analysis with 3D lifting and time-stamped coaching.",
          repoPath: "Movement_Correction/",
          repoUrl: "https://github.com/minmize",
          coords: { x: 2, z: -9 },
          stack: ["Python", "FastAPI", "YOLO11 Pose", "Three.js", "Anthropic Claude", "NumPy"],
          constructionOptions: [
            {
              id: "mc-optics",
              slotType: "Main Settlement Chain",
              tier: "IV",
              icon: "gyro",
              buildingName: "Grungni Pose Observatory",
              topic: "Webcam → YOLO11 → 3D Lifting",
              cost: "17 Keypoints",
              turns: "Real-Time",
              description:
                "A full-stack computer-vision web application that captures a short webcam movement clip, executes YOLO11 pose estimation for 17 anatomical keypoints per frame, lifts 2D image coordinates into 3D space, and computes six biomechanical posture metrics across a frame-accurate timeline.",
              effects: [
                ["2D-to-3D reconstruction:", "Converts monocular webcam video into full 3D skeletal joint trajectories."],
                ["Six biomechanical metrics:", "Tracks joint angles, symmetry, trunk lean, and per-frame stability curves."],
                ["FastAPI backend:", "Low-latency Python inference pipeline coordinating video decoding, pose lifting, and scoring."]
              ],
              unlocks: ["Python", "FastAPI", "YOLO11 Pose", "NumPy"]
            },
            {
              id: "mc-ghost",
              slotType: "Landmark Building",
              tier: "IV",
              icon: "rune",
              buildingName: "Hall of Ancestor Ghosts",
              topic: "Interactive Three.js Ghost Comparison",
              cost: "WebGL 3D",
              turns: "60 FPS",
              description:
                "Renders reconstructed poses inside an interactive Three.js 3D viewport where users can orbit, scrub frames, save an ideal rep as a reference benchmark, and overlay a translucent 'ghost' skeleton against new recordings to visually diagnose form drift.",
              effects: [
                ["Reference & ghost overlay:", "Superimposes a translucent benchmark skeleton directly over new attempts in 3D."],
                ["Frame-by-frame scrubbing:", "Synchronizes the 3D viewport with timeline anomaly markers and coaching timestamps."],
                ["Spatial inspection:", "Orbit and zoom around any joint angle impossible to judge from a flat 2D mirror."]
              ],
              unlocks: ["Three.js", "3D Skeleton Viewer", "Timeline Sync"]
            },
            {
              id: "mc-advisor",
              slotType: "Defense & Garrison",
              tier: "III",
              icon: "shield",
              buildingName: "Ironbreaker Coaching Bastion",
              topic: "Claude Advisor + Offline Fallback",
              cost: "Offline-Ready",
              turns: "JSON Cues",
              description:
                "Feeds quantitative posture timelines to Anthropic Claude to synthesize structured JSON corrective cues anchored to exact timestamps — backed by a deterministic rule-based coaching engine so the application remains 100% functional offline or without an API key.",
              effects: [
                ["Time-stamped coaching:", "Pinpoints exact seconds where posture deviates and prescribes concrete adjustments."],
                ["Deterministic fallback:", "Rule-based biomechanical advisor guarantees zero dead ends when offline."],
                ["Structured schema:", "Strict JSON validation keeps AI responses consistent with the timeline UI."]
              ],
              unlocks: ["Anthropic Claude", "Structured JSON", "Rule-Based Fallback"]
            }
          ]
        },
        {
          id: "mount-squighorn",
          holdName: "Mount Squighorn",
          title: "GameSpecBuilder",
          isCapital: false,
          tier: "III",
          tierLabel: "Eastern Pass Outpost",
          terrain: "High Ridge Watchpost",
          tagline: "Turn a vague game idea into a precise, build-ready LLM specification.",
          repoPath: "GameSpecBuilder/",
          repoUrl: "https://github.com/minmize",
          coords: { x: 17, z: 3 },
          stack: ["HTML5", "CSS3", "Vanilla JavaScript", "localStorage"],
          constructionOptions: [
            {
              id: "gs-scribe",
              slotType: "Main Settlement Chain",
              tier: "III",
              icon: "scroll",
              buildingName: "Runescribe's Blueprint Hall",
              topic: "Live Split-Pane Prompt Compiler",
              cost: "0 Deps",
              turns: "Instant",
              description:
                "A single-page developer tool that transforms loose game concepts into rigorous, build-ready engineering specifications for LLM code generation. As you fill structured sections — concept, stack, core loop, controls, entities, look & feel, and acceptance criteria — the compiled specification updates live.",
              effects: [
                ["Real-time compilation:", "Right-hand output pane re-renders structured Markdown/prompt architecture on every keystroke."],
                ["Spec-strength meter:", "Continuously scores specification completeness and flags ambiguous or missing sections."],
                ["Copy-ready output:", "Produces deterministic, implementation-ready prompts tailored for autonomous coding agents."]
              ],
              unlocks: ["HTML5", "CSS3", "Vanilla JavaScript"]
            },
            {
              id: "gs-presets",
              slotType: "Guild Archive",
              tier: "III",
              icon: "anvil",
              buildingName: "Six-Clan Genre Vault",
              topic: "Genre Presets & Zero-Build Persistence",
              cost: "1 File",
              turns: "Persistent",
              description:
                "Includes six curated genre presets that populate every architectural field for rapid prototyping, paired with automatic localStorage persistence inside a single self-contained HTML file requiring zero build tools, bundlers, or network calls.",
              effects: [
                ["Six genre templates:", "One-click starter blueprints demonstrate high-signal entity and mechanic specs."],
                ["Automatic persistence:", "Draft state survives tab closes and refreshes seamlessly via localStorage."],
                ["Portable single-file build:", "Runs anywhere directly from disk or static hosting with zero external dependencies."]
              ],
              unlocks: ["localStorage", "Single-File Architecture", "Genre Presets"]
            }
          ]
        }
      ]
    },

    /* ========================================================================
     * 2. SOUTH — DEATH PASS & EIGHT PEAKS (Karag Dron down to Karak Eight Peaks)
     *    Category: Algorithmic Trading & Finance
     * ======================================================================== */
    {
      id: "eight-peaks",
      category: "Algorithmic Trading & Finance",
      loreName: "Death Pass & Eight Peaks",
      subtitle: "Attention Forecasting · Market Analysis · Quantitative Drills",
      faction: "Clan Angrund · Oathgold Mint",
      color: "#2a9d74",
      accent: "#6be5b9",
      climate: "Volcanic Pass & Eight-Peak Caldera",
      untainted: "100% Out-of-Sample Disciplined",
      windsOfMagic: "PyTorch · Transformers · Polygon API · Kotlin",
      summary:
        "Stretching south across the molten magma fissures of Karag Dron to Vala-Azrilungol — Karak Eight Peaks, Queen of the Silver Depths. Dedicated to quantitative market forecasting, multi-horizon attention models, and calibrated historical trading drills.",
      center: { x: -12, z: 41 },
      camera: { pos: { x: -19, y: 48, z: 98 }, lookAt: { x: -8, y: 4, z: 48 } },
      border: [
        [-34, 18], [16, 21], [30, 38], [24, 74],
        [-4, 82], [-34, 73], [-39, 44]
      ],
      cities: [
        {
          id: "karak-eight-peaks",
          holdName: "Karak Eight Peaks",
          title: "Stock Predictor",
          isCapital: true,
          tier: "V",
          tierLabel: "Eight-Peaked Citadel · Quantitative Capital",
          terrain: "Ringed Eight-Peak Valley",
          tagline: "An attention network that forecasts US equity moves across six horizons.",
          repoPath: "Stock_Predictor/",
          repoUrl: "https://github.com/minmize",
          coords: { x: -5, z: 59 },
          stack: ["Python", "PyTorch", "Transformer Encoder", "Massive / Polygon API", "Anthropic Claude", "NumPy"],
          constructionOptions: [
            {
              id: "sp-citadel",
              slotType: "Main Settlement Chain",
              tier: "V",
              icon: "citadel",
              buildingName: "Vault of the Eight Horizons",
              topic: "Multi-Horizon Transformer Forecaster",
              cost: "6 Horizons",
              turns: "1D → 6M",
              description:
                "A Python CLI training and inference system built around an attention-based PyTorch Transformer encoder that simultaneously predicts US stock price movements across six distinct time horizons — spanning next-day action out to six-month structural trends.",
              effects: [
                ["Six simultaneous horizons:", "Jointly forecasts 1-day, multi-day, multi-week, and 6-month forward return trajectories."],
                ["Universal cross-ticker weights:", "Encodes sector identity as a scalar input so one unified weight file serves every symbol."],
                ["Temporal self-attention:", "Captures multi-scale regime interactions across rolling historical lookback windows."]
              ],
              unlocks: ["PyTorch", "Transformer Encoder", "Multi-Horizon Head"]
            },
            {
              id: "sp-refinery",
              slotType: "Resource Extraction",
              tier: "IV",
              icon: "mine",
              buildingName: "Deep-Vein Indicator Refinery",
              topic: "27 Engineered Technicals + Polygon Data",
              cost: "27 Features",
              turns: "Daily Bars",
              description:
                "Ingests historical OHLCV bars and corporate fundamentals from the Massive (formerly Polygon) REST API and computes 27 daily technical, volatility, volume, and momentum indicators into normalized tensor pipelines.",
              effects: [
                ["27 daily indicators:", "Combines trend, momentum, volatility, relative volume, and fundamental ratios per bar."],
                ["Automated market ingestion:", "Fetches and caches clean split-adjusted OHLCV and fundamental series via REST API."],
                ["Leak-free preprocessing:", "Strict chronological scaling prevents look-ahead contamination during training."]
              ],
              unlocks: ["Massive / Polygon API", "27 Technical Indicators", "NumPy"]
            },
            {
              id: "sp-oracle",
              slotType: "Arcane / Guild",
              tier: "III",
              icon: "scroll",
              buildingName: "Oathgold Sentiment Relay",
              topic: "Optional Claude News Scoring",
              cost: "--no-sentiment",
              turns: "Modular",
              description:
                "Augments quantitative market tensors with news sentiment scored by Anthropic Claude, while supporting a clean --no-sentiment CLI flag so researchers can run purely quantitative price-and-fundamental forecasts with zero LLM latency or API cost.",
              effects: [
                ["Hybrid signal fusion:", "Blends LLM-scored news catalysts with 27 hard technical and fundamental features."],
                ["Deterministic --no-sentiment flag:", "Bypasses the LLM stage cleanly when pure quantitative execution is desired."],
                ["CLI workflow:", "Single-command training, evaluation, and multi-horizon ticker inference."]
              ],
              unlocks: ["Anthropic Claude", "Python CLI", "Hybrid Quant + NLP"]
            }
          ]
        },
        {
          id: "karag-dron",
          holdName: "Karag Dron",
          title: "MarketMind",
          isCapital: false,
          tier: "IV",
          tierLabel: "Volcanic Forge & Trading Academy",
          terrain: "Magma-Riven Mountain Peak",
          tagline: "Learn market analysis, then test your read on frozen real history.",
          repoPath: "Financial App/",
          repoUrl: "https://github.com/minmize",
          coords: { x: -11, z: 35 },
          stack: ["Kotlin", "Material 3", "MPAndroidChart", "Gson", "ViewBinding", "Min SDK 26 / Target 36"],
          constructionOptions: [
            {
              id: "mm-academy",
              slotType: "Main Settlement Chain",
              tier: "IV",
              icon: "book",
              buildingName: "High Guild Academy of Coin",
              topic: "Seven Visual Market-Analysis Modules",
              cost: "7 Modules",
              turns: "Quizzed",
              description:
                "The first half of MarketMind: seven picture-forward Android learning modules — one dedicated to each major market analysis methodology — where every technical or fundamental term includes a concrete worked numeric example and ends in a mastery quiz.",
              effects: [
                ["Seven structured methodologies:", "Visual lessons demystify chart structure, indicators, and market mechanics step by step."],
                ["Worked numeric examples:", "Every key definition shows real numbers rather than abstract textbook prose."],
                ["Progressive mastery gate:", "Completing module quizzes unlocks historical scenarios inside the Prediction Lab."]
              ],
              unlocks: ["Kotlin", "Material 3", "Gson"]
            },
            {
              id: "mm-lab",
              slotType: "Landmark Building",
              tier: "IV",
              icon: "chart",
              buildingName: "Reckoning Chart Chamber",
              topic: "3-Axis Historical Prediction Lab",
              cost: "~24 Drills/Method",
              turns: "3-Axis Score",
              description:
                "Freezes real documented historical market setups (alongside ~24 practice drills per method) at a pivotal decision point on interactive MPAndroidChart canvases. You call the next move's direction, magnitude, and time window — then watch history unfold and get scored on all three.",
              effects: [
                ["Three-axis scoring:", "Grades Direction, Magnitude, and Time Window independently — not a coin-flip up/down bet."],
                ["Interactive reveal charts:", "MPAndroidChart renders the frozen setup and animates the true historical resolution."],
                ["Google Play API 36 ready:", "Engineered with ViewBinding and modern Android SDK 26–36 standards."]
              ],
              unlocks: ["MPAndroidChart", "ViewBinding", "Target SDK 36"]
            }
          ]
        }
      ]
    },

    /* ========================================================================
     * 3. NORTH — NORTHERN WORLD'S EDGE (Karak Ungor & Karak Kadrin)
     *    Category: Guild Chronicle (About, Skills & Contact)
     * ======================================================================== */
    {
      id: "northern-holds",
      category: "About, Arsenal & Contact",
      loreName: "Karak Ungor & Peak Pass",
      subtitle: "Engineering Philosophy · Full Tech Stack · Direct Diplomacy",
      faction: "High King's Engineers Guild",
      color: "#c8963e",
      accent: "#ffd27d",
      climate: "Frostbitten Northern Peaks",
      untainted: "100% End-to-End Ownership",
      windsOfMagic: "Applied AI · Native Android · Computer Vision",
      summary:
        "The northern watchtowers of the Karaz Ankor rising toward Karak Ungor (Red Eye Mountain) and Karak Kadrin. Holds the Great Book of Engineering Craft, full technical arsenal across languages and ML frameworks, and direct envoy channels.",
      center: { x: 15, z: -47 },
      camera: { pos: { x: -2, y: 47, z: -5 }, lookAt: { x: 12, y: 6, z: -50 } },
      border: [
        [-22, -74], [28, -76], [40, -54], [32, -30],
        [4, -29], [-24, -36], [-28, -56]
      ],
      cities: [
        {
          id: "karak-ungor",
          holdName: "Karak Ungor",
          title: "Who I Am & How I Work",
          isCapital: true,
          tier: "V",
          tierLabel: "Northern Citadel · Red Eye Mountain",
          terrain: "Snow-Crowned Northern Bastion",
          tagline: "Self-directed engineer building where machine learning meets usable product.",
          repoPath: "github.com/minmize",
          repoUrl: "https://github.com/minmize",
          coords: { x: 18, z: -59 },
          stack: ["End-to-End Systems", "Offline-First", "Applied ML", "Native Mobile", "Living Docs"],
          constructionOptions: [
            {
              id: "ab-throne",
              slotType: "Main Settlement Chain",
              tier: "V",
              icon: "crown",
              buildingName: "Throne of the Model–Product Line",
              topic: "Who I Am",
              cost: "3 Surfaces",
              turns: "End-to-End",
              description:
                "I'm Sasha Guriev (@minmize), a self-directed engineer working where machine learning meets product. I take ideas from a rough sketch to something a person can actually use — designing the architecture, training the models, and crafting the interface that fronts them.",
              effects: [
                ["Three execution surfaces:", "Native Android applications, Python ML & vision backends, and interactive browser tools."],
                ["Full-stack ownership:", "I build the model, the data pipeline, and the user interface — never just one isolated slice."],
                ["Production polish:", "Clean build pipelines and honest fallbacks matter just as much as the result on screen."]
              ],
              unlocks: ["Android", "Python ML", "Interactive Web"]
            },
            {
              id: "ab-oaths",
              slotType: "Great Book Monument",
              tier: "IV",
              icon: "book",
              buildingName: "Great Book of Engineering Oaths",
              topic: "How I Build Software",
              cost: "0 Dead Ends",
              turns: "Documented",
              description:
                "Every system in this portfolio follows four non-negotiable Dwarfen engineering rules: own the stack end to end, guarantee deterministic offline fallbacks when external APIs fail, maintain living architecture docs, and ship to real platform targets.",
              effects: [
                ["Offline-first by default:", "Every LLM advisor carries a deterministic rule-based fallback or CLI bypass flag."],
                ["Documented as I go:", "Every repository carries a living PROJECT_STRUCTURE.md so architecture stays legible."],
                ["Real platform standards:", "Android apps target Google Play API 36; web tools run cleanly without fragile build chains."]
              ],
              unlocks: ["Deterministic Fallbacks", "Living Docs", "API 36 Standards"]
            }
          ]
        },
        {
          id: "karak-kadrin",
          holdName: "Karak Kadrin",
          title: "Skills & Diplomacy (Contact)",
          isCapital: false,
          tier: "IV",
          tierLabel: "Peak Pass Fortress · Guild Arsenal",
          terrain: "High Mountain Pass",
          tagline: "Languages, ML/vision frameworks, and direct channels for collaboration.",
          repoPath: "mailto:sasha.guriev.ca@gmail.com",
          repoUrl: "mailto:sasha.guriev.ca@gmail.com",
          coords: { x: 3, z: -43 },
          stack: ["Kotlin", "Python", "JavaScript", "PyTorch", "YOLO11", "Three.js", "FastAPI", "Claude API"],
          constructionOptions: [
            {
              id: "sk-arsenal",
              slotType: "Engineering Armory",
              tier: "IV",
              icon: "anvil",
              buildingName: "Master Runesmith's Arsenal",
              topic: "Languages, Mobile, ML & Vision Stack",
              cost: "6 Domains",
              turns: "Battle-Tested",
              description:
                "The core tools I reach for across mobile development, quantitative machine learning, real-time 3D computer vision, and structured LLM integration.",
              effects: [
                ["Languages & Mobile:", "Kotlin, Python, JavaScript, Java · Android SDK, Material 3, ViewBinding, MPAndroidChart, R8."],
                ["ML & Computer Vision:", "PyTorch, Transformers / Attention, Encog, Feature Engineering, NumPy · YOLO11 Pose, 2D→3D Lifting, Three.js."],
                ["LLM & Web Systems:", "Anthropic Claude API, Structured JSON, Rule-Based Fallbacks · FastAPI, Vanilla JS, Single-File Apps."]
              ],
              unlocks: ["Kotlin", "Python", "PyTorch", "YOLO11 Pose", "Three.js", "FastAPI"]
            },
            {
              id: "sk-envoy",
              slotType: "Diplomatic Embassy",
              tier: "IV",
              icon: "envoy",
              buildingName: "High Pass Envoy Chamber",
              topic: "Contact & Collaboration",
              cost: "Open",
              turns: "Fast Reply",
              description:
                "Open to engineering roles, research implementation, and collaboration across applied AI, quantitative tooling, native mobile, and computer vision. Email is the fastest courier across the mountains.",
              effects: [
                ["Direct Courier (Email):", "sasha.guriev.ca@gmail.com — fastest response for roles and technical discussions."],
                ["Code Repositories (GitHub):", "github.com/minmize — full source trees and living architecture docs."],
                ["Focus Areas:", "Applied AI / ML engineering, mobile product engineering, and 3D computer vision."]
              ],
              unlocks: ["sasha.guriev.ca@gmail.com", "github.com/minmize"],
              links: [
                { label: "Email Sasha →", url: "mailto:sasha.guriev.ca@gmail.com" },
                { label: "GitHub (@minmize) ↗", url: "https://github.com/minmize", external: true }
              ]
            }
          ]
        }
      ]
    }
  ],

  /* Scenic Warhammer landmarks rendered subtly on the 3D mountain range for lore immersion */
  landmarks: [
    { name: "Varenka Hills", coords: { x: -45, z: 7 }, note: "Western Foothills" },
    { name: "Mount Gunbad", coords: { x: 32, z: -26 }, note: "Rib Peaks Brightstone Mine" },
    { name: "Black Crag", coords: { x: -27, z: 47 }, note: "Death Pass Gorge" }
  ],

  /* Underway / mountain road waypoints connecting the holds from Karak Ungor down to Karak Eight Peaks */
  underwayRoutes: [
    [[18, -59], [11, -51], [3, -43], [-7, -26], [-18, -10]],
    [[-18, -10], [-8, -10], [2, -9], [10, -3], [17, 3]],
    [[2, -9], [-4, 12], [-11, 35], [-8, 48], [-5, 59]]
  ]

  /* ==========================================================================
   * READY-TO-ENABLE PROVINCE TEMPLATES (Uncomment & paste into `provinces` above!)
   * ==========================================================================
   *
   * // TEMPLATE A: RESEARCH PAPERS (Rib Peaks — Mount Gunbad & Grom Peak)
   * {
   *   id: "rib-peaks",
   *   category: "Research Papers",
   *   loreName: "Rib Peaks",
   *   subtitle: "Preprints · Empirical Studies · Technical Whitepapers",
   *   faction: "Loremasters of Gunbad",
   *   color: "#8b5cf6",
   *   accent: "#c4b5fd",
   *   climate: "High Brightstone Ridges",
   *   untainted: "Peer-Reviewed & Reproducible",
   *   windsOfMagic: "LaTeX · PyTorch · Empirical Benchmarks",
   *   summary: "Published papers, preprints, and formal ablations.",
   *   center: { x: 31, z: -26 },
   *   camera: { pos: { x: 20, y: 44, z: 16 }, lookAt: { x: 31, y: 6, z: -26 } },
   *   border: [[18, -38], [44, -38], [46, -15], [20, -15]],
   *   cities: [
   *     {
   *       id: "mount-gunbad",
   *       holdName: "Mount Gunbad",
   *       title: "Paper Title #1",
   *       isCapital: true,
   *       tier: "IV",
   *       tierLabel: "Research Hold",
   *       terrain: "Brightstone Peak",
   *       tagline: "One-line thesis of your paper.",
   *       repoPath: "papers/paper-1.pdf",
   *       repoUrl: "https://arxiv.org/",
   *       coords: { x: 32, z: -26 },
   *       stack: ["PyTorch", "Attention", "Benchmarks"],
   *       constructionOptions: [
   *         {
   *           id: "p1-abstract",
   *           slotType: "Main Settlement Chain",
   *           tier: "IV",
   *           icon: "scroll",
   *           buildingName: "Loremaster's Abstract",
   *           topic: "Abstract & Problem Statement",
   *           cost: "PDF",
   *           turns: "2026",
   *           description: "Detailed abstract and methodology description here...",
   *           effects: [["Key Finding:", "Describe quantitative result or ablation."]],
   *           unlocks: ["arXiv", "Code"]
   *         }
   *       ]
   *     }
   *   ]
   * },
   *
   * // TEMPLATE B: INSTAGRAM & MEDIA (Eastern Badlands — Valaya's Sorrow)
   * {
   *   id: "eastern-badlands",
   *   category: "Instagram & Media",
   *   loreName: "Eastern Badlands",
   *   subtitle: "Build Logs · Reels · Visual Chronicles",
   *   faction: "Chroniclers of Valaya",
   *   color: "#d95b5b",
   *   accent: "#fca5a5",
   *   climate: "Sunlit Canyonlands",
   *   untainted: "100% Original Media",
   *   windsOfMagic: "Reels · Photography · Devlogs",
   *   summary: "Short-form build logs, visual experiments, and photography.",
   *   center: { x: 22, z: 48 },
   *   camera: { pos: { x: 12, y: 44, z: 90 }, lookAt: { x: 22, y: 4, z: 48 } },
   *   border: [[12, 30], [42, 32], [42, 68], [14, 68]],
   *   cities: []
   * }
   */
};
