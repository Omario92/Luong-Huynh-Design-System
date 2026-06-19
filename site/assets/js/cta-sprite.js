/* ──────────────────────────────────────────────────────────
   CTA SPRITE ROBOT  (used by index-c.html)
   A lightweight, no-WebGL alternative to the procedural 3D
   sentinel in main.js. The head is a 2D GRID of pre-rendered
   frames: COLS span the yaw (left→right), ROWS span the pitch
   (up→down). The cursor X picks the column and cursor Y picks
   the row, so the head tracks the mouse on both axes.
   The body and background are looping videos.

   main.js skips its own 3D build when <body data-cta-mode="sprite">,
   so the two never collide.

   To swap in real art, keep these paths/names:
     assets/cta-sprite/grid/head_r{row}_c{col}.png  (col 2-digit, e.g. _c00)
       row 0 = looking up, last row = looking down
       col 0 = looking left, last col = looking right
     assets/cta-sprite/body.webm                     (alpha loop)
     assets/cta-sprite/bg.mp4                         (opaque loop)
   …and set COLS / ROWS below to match your exported grid.
   ────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var BASE = 'assets/cta-sprite/';
  var COLS = 13;                // yaw frames   (left → right)
  var ROWS = 7;                 // pitch frames (up → down, row 0 = up)
  var GRID_DIR = BASE + 'grid/';
  var BODY_SRC = BASE + 'body.webm';
  var BG_SRC = BASE + 'bg.mp4';

  var YAW_RANGE = 0.9;    // how far across the columns the cursor can push (0..1)
  var PITCH_RANGE = 0.85; // how far across the rows the cursor can push (0..1)
  var EASE = 0.12;        // index smoothing per tick (lower = lazier)
  var IDLE_MS = 2600;     // after this long without pointer movement, auto-sweep
  var BODY_SHIFT = 16;    // px the stage parallax-shifts with the yaw
  var BODY_LIFT = 8;      // px the stage parallax-shifts with the pitch

  function headSrc(col, row) {
    var c = '' + col;
    while (c.length < 2) c = '0' + c;
    return GRID_DIR + 'head_r' + row + '_c' + c + '.png';
  }

  function buildSprite(panel) {
    if (panel.querySelector('.lh-cta-sprite')) return; // already built

    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse = window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches;

    var host = document.createElement('div');
    host.className = 'lh-cta-sprite';

    var bg = document.createElement('video');
    bg.className = 'lh-cs-bg';
    bg.muted = true; bg.loop = true; bg.autoplay = true;
    bg.setAttribute('playsinline', ''); bg.setAttribute('aria-hidden', 'true');
    bg.src = BG_SRC;

    var stage = document.createElement('div');
    stage.className = 'lh-cs-stage';

    var body = document.createElement('video');
    body.className = 'lh-cs-body';
    body.muted = true; body.loop = true; body.autoplay = true;
    body.setAttribute('playsinline', ''); body.setAttribute('aria-hidden', 'true');
    body.src = BODY_SRC;

    var head = document.createElement('img');
    head.className = 'lh-cs-head';
    head.alt = '';
    head.setAttribute('aria-hidden', 'true');
    head.decoding = 'async';

    stage.appendChild(body);
    stage.appendChild(head);
    host.appendChild(bg);
    host.appendChild(stage);
    panel.appendChild(host);

    if (!reduce) { bg.play().catch(function () {}); body.play().catch(function () {}); }

    // Preload the whole grid so swapping src is instant (cached decode).
    var frames = [];   // frames[row][col]
    for (var r = 0; r < ROWS; r++) {
      frames[r] = [];
      for (var c = 0; c < COLS; c++) {
        var im = new Image();
        im.src = headSrc(c, r);
        frames[r][c] = im;
      }
    }

    var MIDC = (COLS - 1) / 2;
    var MIDR = (ROWS - 1) / 2;
    head.src = frames[Math.round(MIDR)][Math.round(MIDC)].src;

    if (reduce) return; // static, centred head — no tracking/animation

    var tcol = MIDC, trow = MIDR;   // desired col/row
    var ccol = MIDC, crow = MIDR;   // smoothed col/row
    var shownC = -1, shownR = -1;
    var lastMove = 0;

    // Map a viewport pointer position to a target column (yaw) + row (pitch).
    // Cursor left of panel centre → looks left; above centre → looks up.
    function aim(clientX, clientY) {
      var rct = host.getBoundingClientRect();
      var cx = rct.left + rct.width / 2;
      var cy = rct.top + rct.height / 2;
      var nx = (clientX - cx) / (window.innerWidth * 0.35);
      var ny = (clientY - cy) / (window.innerHeight * 0.42);
      nx = Math.max(-1, Math.min(1, nx)) * YAW_RANGE;
      ny = Math.max(-1, Math.min(1, ny)) * PITCH_RANGE;
      tcol = MIDC + nx * MIDC;
      trow = MIDR + ny * MIDR;   // ny<0 (cursor above) → row 0 = look up
      lastMove = performance.now();
    }

    window.addEventListener('mousemove', function (e) { aim(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) aim(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function tick(t) {
      // Idle (or touch device with no active touch): gentle automatic sweep so
      // the robot stays alive and shows off the head turn.
      if (coarse || t - lastMove > IDLE_MS) {
        tcol = MIDC + Math.sin(t / 2200) * 0.7 * MIDC;
        trow = MIDR + Math.sin(t / 3300) * 0.5 * MIDR;
      }
      ccol += (tcol - ccol) * EASE;
      crow += (trow - crow) * EASE;

      var ci = Math.round(ccol);
      if (ci < 0) ci = 0; else if (ci >= COLS) ci = COLS - 1;
      var ri = Math.round(crow);
      if (ri < 0) ri = 0; else if (ri >= ROWS) ri = ROWS - 1;
      if (ci !== shownC || ri !== shownR) {
        head.src = frames[ri][ci].src; shownC = ci; shownR = ri;
      }

      // subtle parallax on both axes for a touch of depth
      var nrx = (ccol - MIDC) / MIDC; // -1..1
      var nry = (crow - MIDR) / MIDR; // -1..1
      stage.style.transform =
        'translate(calc(-50% + ' + (nrx * BODY_SHIFT) + 'px), ' + (nry * BODY_LIFT) + 'px)';

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    var panels = document.querySelectorAll('.lh-cta, .lh-footer-cta');
    panels.forEach(function (p) { buildSprite(p); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
