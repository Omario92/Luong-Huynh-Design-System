/* @ds-bundle: {"format":3,"namespace":"LuongHuynhDesignSystem_019e31","components":[],"sourceHashes":{"site/assets/js/main.js":"1f7e7a716f97","ui_kits/portfolio/AboutServices.jsx":"dfd65507d033","ui_kits/portfolio/AboutTeaser.jsx":"3ae70ced2599","ui_kits/portfolio/CapabilitiesGrid.jsx":"19586b28e44d","ui_kits/portfolio/FilterRow.jsx":"fbd6fd757b7f","ui_kits/portfolio/FooterCTA.jsx":"180b22b38305","ui_kits/portfolio/Header.jsx":"2b8cb72d2267","ui_kits/portfolio/Hero.jsx":"131bff64ea14","ui_kits/portfolio/WorkGrid.jsx":"519142ebee2b","ui_kits/portfolio/app.jsx":"c725671b4864","ui_kits/portfolio/data.js":"5e9b6822e1fa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LuongHuynhDesignSystem_019e31 = window.LuongHuynhDesignSystem_019e31 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// site/assets/js/main.js
try { (() => {
(() => {
  // --- Page Transitions ---
  const page = document.querySelector('.lh-page');
  if (page) {
    // Add transition styling dynamically (progressive enhancement)
    page.classList.add('lh-page-transition');

    // Trigger entrance transition in next frame
    requestAnimationFrame(() => {
      page.classList.add('is-loaded');
    });

    // Intercept click events on links for exit transition
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      // Skip special keys (Ctrl/Cmd click, middle click, shift click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button && e.button === 1) {
        return;
      }

      // Check if external, hash link, mailto/tel, or download asset
      const isExternal = href.startsWith('http://') || href.startsWith('https://') || link.target === '_blank';
      const isSpecial = href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');
      const isAttachment = href.endsWith('.pdf') || href.endsWith('.zip');
      if (!isExternal && !isSpecial && !isAttachment) {
        e.preventDefault();

        // Remove open state from menu if open
        const menu = document.querySelector('[data-menu]');
        if (menu && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          const toggle = document.querySelector('[data-menu-toggle]');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
        page.classList.remove('is-loaded');
        page.classList.add('is-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 400); // Wait for transition to complete
      }
    });

    // Restore from BFcache (Back/Forward Cache)
    window.addEventListener('pageshow', e => {
      if (e.persisted) {
        page.classList.remove('is-exiting');
        page.classList.add('is-loaded');
      }
    });
  }
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if (current === '' && href === 'index.html' || href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- Line-by-Line Heading Reveal ---
  const lineRevealTargets = document.querySelectorAll('.lh-hero-title, .lh-detail-title, .lh-section-title, .lh-cta h2, .lh-line-reveal');
  function splitLines(heading) {
    let originalHtml = heading.dataset.originalHtml;
    if (!originalHtml) {
      originalHtml = heading.innerHTML;
      heading.dataset.originalHtml = originalHtml;
    }

    // Set aria-label to clean text content for accessibility
    if (!heading.getAttribute('aria-label')) {
      const cleanText = heading.textContent.trim().replace(/\s+/g, ' ');
      heading.setAttribute('aria-label', cleanText);
    }

    // Split by <br> to preserve explicit breaks
    const blocks = originalHtml.split(/<br\b[^>]*>/gi);

    // Render words in helper spans to measure natural offsetTop of each word
    heading.innerHTML = blocks.map(block => {
      const text = block.replace(/<[^>]*>/g, '').trim();
      const words = text.split(/\s+/).filter(w => w.length > 0);
      return `<span class="lh-temp-block" style="display:block;">${words.map(w => `<span class="lh-temp-word" style="display:inline-block;">${w}</span>`).join(' ')}</span>`;
    }).join('');
    const tempSpans = heading.querySelectorAll('.lh-temp-word');
    const lines = [];
    let currentLine = [];
    let lastTop = -1;
    tempSpans.forEach(span => {
      const top = span.offsetTop;
      if (lastTop !== -1 && top > lastTop + 5) {
        lines.push(currentLine);
        currentLine = [];
      }
      currentLine.push(span.textContent);
      lastTop = top;
    });
    if (currentLine.length) {
      lines.push(currentLine);
    }

    // Reconstruct with aria-hidden wrapping visual elements
    heading.innerHTML = `<span aria-hidden="true" style="display: block;">${lines.map((lineWords, lineIndex) => {
      const lineText = lineWords.join(' ');
      // Stagger delay increased to 0.15s per line for better pacing
      return `<span class="lh-reveal-line"><span class="lh-reveal-line-inner" style="transition-delay: ${lineIndex * 0.15}s;">${lineText}</span></span>`;
    }).join('\n')}</span>`;
  }

  // Pre-split and remove global reveal class to prevent duplicate observer triggers
  lineRevealTargets.forEach(heading => {
    heading.classList.remove('lh-reveal');
    heading.classList.add('lh-line-reveal');
    splitLines(heading);
  });

  // Dedicated Intersection Observer for line-by-line reveal headings
  if (lineRevealTargets.length && 'IntersectionObserver' in window) {
    const lineObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Settled delay (150ms) lets scroll animation settle before transition starts
          setTimeout(() => {
            e.target.classList.add('is-visible');
          }, 150);
          lineObserver.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -12% 0px' // triggers when element is 12% above viewport bottom
    });
    lineRevealTargets.forEach(el => lineObserver.observe(el));
  } else {
    lineRevealTargets.forEach(el => el.classList.add('is-visible'));
  }
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      lineRevealTargets.forEach(heading => {
        const wasVisible = heading.classList.contains('is-visible');
        if (wasVisible) {
          heading.classList.add('no-transition');
        }
        splitLines(heading);
        if (wasVisible) {
          heading.classList.add('is-visible');
          void heading.offsetHeight; // force reflow
          heading.classList.remove('no-transition');
        }
      });
    }, 250);
  });

  // Re-split headings once the brand font is ready and after full load, so the
  // measure-based line breaks are correct even if the first pass ran before
  // layout/fonts settled (common inside embedded preview iframes).
  function reflowHeadings() {
    lineRevealTargets.forEach(heading => {
      const wasVisible = heading.classList.contains('is-visible');
      heading.classList.add('no-transition');
      splitLines(heading);
      if (wasVisible) heading.classList.add('is-visible');
      void heading.offsetHeight;
      heading.classList.remove('no-transition');
    });
  }
  if (lineRevealTargets.length) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => reflowHeadings());
    }
    window.addEventListener('load', () => setTimeout(reflowHeadings, 60));
  }
  const revealEls = document.querySelectorAll('.lh-reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.1
    });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // NOTE: The portfolio filtering engine (multi-select, URL-hash sync, staggered
  // reveal, and the cinematic "no results" state) now lives in a page-scoped
  // <script> inside portfolio.html — it is the only page with a filter bar.
  // The old single-select handler was removed here to avoid double-binding.

  // --- Particle Portrait Canvas ---
  const canvas = document.getElementById('lh-particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const imageSrc = canvas.dataset.image;
    let particles = [];
    let width = 0;
    let height = 0;
    const mouse = {
      x: null,
      y: null,
      radius: 80
    };
    const margin = 0.02; // 2% padding inside canvas
    // Twinkle: gentle, out-of-phase brightness oscillation so the portrait
    // shimmers like city lights seen from above — softly fading on and off.
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let twinkleT = 0;
    let drawW = 0,
      drawH = 0,
      offsetX = 0,
      offsetY = 0;
    const imgRatio = 1; // 1:1 square image aspect ratio

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Maintain aspect ratio box fit (contain) - align to bottom-right exactly
      const canvasRatio = width / height;
      if (canvasRatio > imgRatio) {
        drawH = height;
        drawW = drawH * imgRatio;
      } else {
        drawW = width;
        drawH = drawW / imgRatio;
      }
      offsetX = width - drawW;
      offsetY = height - drawH;

      // Re-map target positions when resizing
      if (particles.length) {
        particles.forEach(p => {
          p.targetX = offsetX + p.relTargetX * drawW;
          p.targetY = offsetY + p.relTargetY * drawH;
        });
      }
    }
    class Particle {
      constructor(x, y, targetX, targetY, color) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 0.8 + 0.8;
        this.speed = Math.random() * 0.05 + 0.03;
        this.friction = Math.random() * 0.15 + 0.82;
        this.twinkle = false;
        this.rgb = null;
        this.baseAlpha = 1;
        this.twinkleMin = 0.5;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.32 + Math.random() * 1.45;
      }
      update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        let forceX = dx * this.speed;
        let forceY = dy * this.speed;
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = this.x - mouse.x;
          const mdy = this.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < mouse.radius) {
            const push = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(mdy, mdx);
            forceX += Math.cos(angle) * push * 6;
            forceY += Math.sin(angle) * push * 6;
          }
        }
        this.vx = (this.vx + forceX) * this.friction;
        this.vy = (this.vy + forceY) * this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }
      draw() {
        if (this.rgb === null && this.color) {
          const m = this.color.match(/rgba?\(([^)]+)\)/);
          if (m) {
            const parts = m[1].split(',').map(s => s.trim());
            this.rgb = parts.slice(0, 3).join(', ');
            this.baseAlpha = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
            // Bright ivory particles = the "city lights" → twinkle; dark shadow
            // dots stay mostly steady with only a few faint flickers.
            const isLight = parseInt(parts[0], 10) > 120;
            this.twinkle = isLight ? true : Math.random() < 0.22;
            this.twinkleMin = isLight ? 0.16 + Math.random() * 0.32 : 0.74;
          }
        }
        let fill = this.color;
        if (this.twinkle && this.rgb && !reduceMotion) {
          const osc = 0.5 + 0.5 * Math.sin(twinkleT * this.twinkleSpeed + this.twinklePhase);
          const factor = this.twinkleMin + (1 - this.twinkleMin) * osc;
          fill = `rgba(${this.rgb}, ${this.baseAlpha * factor})`;
        }
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      resize();
      try {
        const offscreen = document.createElement('canvas');
        const octx = offscreen.getContext('2d');
        const detail = 140; // Optimal grid resolution for detail and performance
        offscreen.width = detail;
        offscreen.height = detail;
        octx.drawImage(img, 0, 0, detail, detail);
        const imgData = octx.getImageData(0, 0, detail, detail);
        const data = imgData.data;

        // Flood fill (BFS) from borders to detect outer white background
        const visited = new Uint8Array(detail * detail);
        const queue = [];
        function isWhite(px, py) {
          const idx = (py * detail + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          return r > 200 && g > 200 && b > 200;
        }

        // Seed flood fill from outer boundaries
        for (let x = 0; x < detail; x++) {
          if (isWhite(x, 0)) {
            const idx = x;
            if (visited[idx] === 0) {
              visited[idx] = 1;
              queue.push([x, 0]);
            }
          }
          if (x < 10 || x > detail - 10) {
            if (isWhite(x, detail - 1)) {
              const idx = (detail - 1) * detail + x;
              if (visited[idx] === 0) {
                visited[idx] = 1;
                queue.push([x, detail - 1]);
              }
            }
          }
        }
        for (let y = 0; y < detail; y++) {
          if (isWhite(0, y)) {
            const idx = y * detail;
            if (visited[idx] === 0) {
              visited[idx] = 1;
              queue.push([0, y]);
            }
          }
          if (isWhite(detail - 1, y)) {
            const idx = y * detail + (detail - 1);
            if (visited[idx] === 0) {
              visited[idx] = 1;
              queue.push([detail - 1, y]);
            }
          }
        }

        // Process BFS
        while (queue.length > 0) {
          const [qx, qy] = queue.shift();
          const neighbors = [[qx + 1, qy], [qx - 1, qy], [qx, qy + 1], [qx, qy - 1]];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < detail && ny >= 0 && ny < detail) {
              const nidx = ny * detail + nx;
              if (visited[nidx] === 0 && isWhite(nx, ny)) {
                visited[nidx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }

        // Build particles for the portrait silhouette (excluding outer background)
        for (let y = 0; y < detail; y++) {
          for (let x = 0; x < detail; x++) {
            const idx = y * detail + x;
            if (visited[idx] === 1) {
              continue; // Skip outer background
            }
            const pixelIndex = idx * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            const targetX = offsetX + x / detail * drawW;
            const targetY = offsetY + y / detail * drawH;

            // Detect halftone dots (blue pixels)
            const isBlueDot = r < 140 && b > 100 && b > r + 25;
            let color;
            let pSize = Math.random() * 1.0 + 0.8;
            if (isBlueDot) {
              // Shadows (halftone dots) -> Dark navy/black particles
              const alpha = Math.random() * 0.15 + 0.8; // High opacity to mask background glow
              color = `rgba(10, 15, 25, ${alpha})`;
              pSize = Math.random() * 1.2 + 1.2; // Slightly larger for shadow dot depth
            } else {
              // Highlights (skin) -> Cream/ivory particles
              const alpha = Math.random() * 0.45 + 0.45;
              color = `rgba(244, 240, 232, ${alpha})`;
              pSize = Math.random() * 0.8 + 0.8;
            }
            const p = new Particle(targetX, targetY, targetX, targetY, color);
            p.size = pSize;
            p.relTargetX = x / detail;
            p.relTargetY = y / detail;
            particles.push(p);
          }
        }
      } catch (err) {
        console.warn('Canvas particle portrait: Image pixels not readable. Using fallback.', err);
        const detail = 20;
        for (let y = 0; y < detail; y++) {
          for (let x = 0; x < detail; x++) {
            const dx = x - detail / 2;
            const dy = y - detail / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < detail / 2.5) {
              const targetX = offsetX + x / detail * drawW;
              const targetY = offsetY + y / detail * drawH;
              const alpha = Math.random() * 0.45 + 0.45;
              const color = `rgba(244, 240, 232, ${alpha})`; // Ivory fallback

              const p = new Particle(targetX, targetY, targetX, targetY, color);
              p.relTargetX = x / detail;
              p.relTargetY = y / detail;
              particles.push(p);
            }
          }
        }
      }

      // Track mouse position relative to canvas
      canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      // Track touch position for mobile responsiveness
      canvas.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.touches[0].clientX - rect.left;
          mouse.y = e.touches[0].clientY - rect.top;
        }
      }, {
        passive: true
      });
      canvas.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
      });
      window.addEventListener('resize', resize);
      function animate() {
        ctx.clearRect(0, 0, width, height);
        twinkleT = performance.now() / 1000;

        // Draw a soft ambient teal-cyan glow behind the particle portrait
        if (drawW > 0 && drawH > 0) {
          const cx = offsetX + drawW / 2;
          const cy = offsetY + drawH / 2;
          const r = Math.max(drawW, drawH) * 0.65;
          const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r);
          grad.addColorStop(0, 'rgba(0, 240, 255, 0.16)'); // cyan core
          grad.addColorStop(0.4, 'rgba(0, 150, 136, 0.08)'); // teal mid
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fade

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        requestAnimationFrame(animate);
      }
      animate();
    };
  }
  // --- Work Card Parallax Effect ---
  const workGrids = document.querySelectorAll('.lh-work-grid');
  if (workGrids.length) {
    function initCardParallax() {
      workGrids.forEach(grid => {
        const cards = Array.from(grid.querySelectorAll('.lh-work-card'));
        if (!cards.length) return;

        // Find unique offsetLeft values to detect columns
        const lefts = new Set();
        cards.forEach(card => lefts.add(card.offsetLeft));
        const sortedLefts = Array.from(lefts).sort((a, b) => a - b);
        const cols = sortedLefts.length;
        cards.forEach(card => {
          const colIdx = sortedLefts.indexOf(card.offsetLeft);
          let factor = 0;
          if (cols === 3) {
            // Left column rises slower (lags), center is normal, right column rises faster
            if (colIdx === 0) factor = -0.1;else if (colIdx === 1) factor = 0;else if (colIdx === 2) factor = 0.1;
          } else if (cols === 2) {
            if (colIdx === 0) factor = -0.07;else if (colIdx === 1) factor = 0.07;
          } else {
            factor = 0; // 1 column (mobile) -> no parallax
          }
          card.dataset.parallaxFactor = factor;
        });
      });
    }
    function updateCardParallax() {
      const cards = document.querySelectorAll('.lh-work-card.is-visible');
      const viewportCenter = window.innerHeight / 2;
      cards.forEach(card => {
        const factor = parseFloat(card.dataset.parallaxFactor || 0);
        if (factor === 0) {
          card.style.transform = '';
          return;
        }
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = cardCenter - viewportCenter;
        const isHovered = card.matches(':hover');
        const hoverOffset = isHovered ? -6 : 0;

        // Continuous parallax across the entire screen, aligning exactly at the viewport center
        const translateY = distance * factor + hoverOffset;
        card.style.transform = `translateY(${translateY}px)`;
      });
    }

    // Initialize parallax factors
    initCardParallax();

    // Attach mouse event listeners to trigger smooth hover animations
    const allParallaxCards = document.querySelectorAll('.lh-work-card');
    allParallaxCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        updateCardParallax();
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        updateCardParallax();
      });
    });

    // Re-initialize factors on window resize (since layout column structure can change)
    window.addEventListener('resize', () => {
      setTimeout(() => {
        initCardParallax();
        updateCardParallax();
      }, 150);
    });

    // Run parallax update on scroll using requestAnimationFrame throttling for performance
    let isScrollingParallax = false;
    window.addEventListener('scroll', () => {
      if (!isScrollingParallax) {
        window.requestAnimationFrame(() => {
          allParallaxCards.forEach(card => {
            // Disable transition during active scroll-linked updates to prevent lag
            card.style.transition = 'none';
          });
          updateCardParallax();
          isScrollingParallax = false;
        });
        isScrollingParallax = true;
      }
    }, {
      passive: true
    });

    // Also run initial update to position items correctly if page is loaded scrolled down
    setTimeout(updateCardParallax, 200);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/assets/js/main.js", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/AboutServices.jsx
try { (() => {
// AboutServices.jsx — the four services list (replaces "Fullstack Developer" cards).
function AboutServices() {
  const {
    capabilities
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("div", {
    className: "lh-services-grid"
  }, capabilities.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.n,
    className: "lh-service-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-service-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-service-num mono"
  }, c.n), /*#__PURE__*/React.createElement("h3", null, c.title)), /*#__PURE__*/React.createElement("p", null, c.blurb))));
}
window.AboutServices = AboutServices;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/AboutServices.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/AboutTeaser.jsx
try { (() => {
// AboutTeaser.jsx — short about block used on homepage; deep version lives on About page.
function AboutTeaser({
  onNav
}) {
  const {
    brand
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("section", {
    className: "lh-section",
    "data-screen-label": "About teaser"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container lh-about-teaser"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "About"), /*#__PURE__*/React.createElement("p", {
    className: "lh-about-bio"
  }, brand.aboutBio), /*#__PURE__*/React.createElement("a", {
    className: "lh-button lh-button-secondary",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav("about");
    }
  }, "More about Luong")));
}
window.AboutTeaser = AboutTeaser;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/AboutTeaser.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/CapabilitiesGrid.jsx
try { (() => {
// CapabilitiesGrid.jsx — the 4-up hairline grid on the homepage.
function CapabilitiesGrid() {
  const {
    capabilities
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("section", {
    className: "lh-section lh-section-muted",
    "data-screen-label": "Capabilities"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-section-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Capabilities"), /*#__PURE__*/React.createElement("h2", {
    className: "lh-section-title"
  }, "What I work on")), /*#__PURE__*/React.createElement("div", {
    className: "lh-capabilities"
  }, capabilities.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.n,
    className: "lh-capability-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-capability-num mono"
  }, c.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, c.title), /*#__PURE__*/React.createElement("p", null, c.blurb)))))));
}
window.CapabilitiesGrid = CapabilitiesGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/CapabilitiesGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/FilterRow.jsx
try { (() => {
// FilterRow.jsx — portfolio category filter (single-select pills).
function FilterRow({
  active,
  onChange
}) {
  const {
    categories
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("div", {
    className: "lh-filter-row",
    role: "tablist"
  }, categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    type: "button",
    role: "tab",
    "aria-selected": active === c,
    className: "lh-filter-pill" + (active === c ? " is-active" : ""),
    onClick: () => onChange(c)
  }, c)));
}
window.FilterRow = FilterRow;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/FilterRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/FooterCTA.jsx
try { (() => {
// FooterCTA.jsx — closing footer with big title, contact CTA, socials.
function FooterCTA() {
  const {
    socials
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("section", {
    className: "lh-section",
    "data-screen-label": "Footer CTA"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-footer-cta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Contact"), /*#__PURE__*/React.createElement("h2", null, "Available for Work in 2026."), /*#__PURE__*/React.createElement("div", {
    className: "lh-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "lh-button",
    href: "mailto:hello@luonghuynh.com"
  }, "Get in Touch"), /*#__PURE__*/React.createElement("a", {
    className: "lh-button lh-button-secondary",
    href: "#"
  }, "View Portfolio"))), /*#__PURE__*/React.createElement("div", {
    className: "lh-footer-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "\xA9 2026 Luong Huynh \xB7 Ho Chi Minh City"), /*#__PURE__*/React.createElement("div", {
    className: "lh-social-row"
  }, socials.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.slug,
    href: s.url,
    className: "lh-social",
    "aria-label": s.label
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://cdn.simpleicons.org/${s.slug}/f4f0e8`,
    width: "18",
    height: "18",
    alt: ""
  })))))));
}
window.FooterCTA = FooterCTA;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/FooterCTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Header.jsx
try { (() => {
// Header.jsx — sticky header with logo, nav, optional CTA.
function Header({
  page,
  onNav
}) {
  const {
    brand,
    nav
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("header", {
    className: "lh-header",
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container lh-header-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "lh-logo",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav("home");
    }
  }, brand.name), /*#__PURE__*/React.createElement("nav", {
    className: "lh-nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: "#",
    className: "lh-nav-link" + (page === n.id ? " is-active" : ""),
    onClick: e => {
      e.preventDefault();
      onNav(n.id);
    }
  }, n.label))), /*#__PURE__*/React.createElement("a", {
    className: "lh-availability",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-availability-dot"
  }), "Available for Work")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Hero.jsx
try { (() => {
// Hero.jsx — the homepage hero: eyebrow, name, lead, meta, CTAs.
function Hero({
  onNav
}) {
  const {
    brand
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("section", {
    className: "lh-section lh-hero",
    "data-screen-label": "Hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-eyebrow"
  }, "Digital Artist \xB7 3D \xB7 AI \xB7 VFX"), /*#__PURE__*/React.createElement("h1", {
    className: "lh-hero-title"
  }, brand.name), /*#__PURE__*/React.createElement("p", {
    className: "lh-hero-copy"
  }, brand.tagline), /*#__PURE__*/React.createElement("div", {
    className: "lh-meta-row"
  }, /*#__PURE__*/React.createElement("span", null, brand.location), /*#__PURE__*/React.createElement("span", null, brand.year), /*#__PURE__*/React.createElement("span", null, "Available for selected projects")), /*#__PURE__*/React.createElement("div", {
    className: "lh-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "lh-button",
    onClick: e => {
      e.preventDefault();
      onNav("portfolio");
    }
  }, "View Portfolio"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "lh-button lh-button-secondary",
    onClick: e => {
      e.preventDefault();
      onNav("about");
    }
  }, "Get in Touch"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/WorkGrid.jsx
try { (() => {
// WorkCard.jsx — one project card: 4:5 media, title, tags.
function WorkCard({
  project,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: "lh-work-card",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen(project);
    },
    "aria-label": project.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-work-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: `../../assets/work/${project.slug}.svg`,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "lh-work-info"
  }, /*#__PURE__*/React.createElement("h3", null, project.title), /*#__PURE__*/React.createElement("div", {
    className: "lh-tag-row"
  }, project.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "lh-tag"
  }, t)))));
}

// WorkGrid.jsx — grid wrapper, 3-up on desktop.
function WorkGrid({
  projects,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lh-work-grid"
  }, projects.map(p => /*#__PURE__*/React.createElement(WorkCard, {
    key: p.slug,
    project: p,
    onOpen: onOpen
  })));
}
window.WorkCard = WorkCard;
window.WorkGrid = WorkGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/WorkGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/app.jsx
try { (() => {
// app.jsx — page-level composition + simple in-memory router.
const {
  useState,
  useEffect,
  useMemo
} = React;
function HomePage({
  onNav,
  onOpenProject
}) {
  const {
    projects
  } = window.LH_DATA;
  const featured = projects.filter(p => p.featured);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    className: "lh-section",
    "data-screen-label": "Selected Works"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-section-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Selected Works"), /*#__PURE__*/React.createElement("h2", {
    className: "lh-section-title"
  }, "Recent commissions and personal pieces.")), /*#__PURE__*/React.createElement(WorkGrid, {
    projects: featured,
    onOpen: onOpenProject
  }), /*#__PURE__*/React.createElement("div", {
    className: "lh-section-foot"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "lh-button lh-button-secondary",
    onClick: e => {
      e.preventDefault();
      onNav("portfolio");
    }
  }, "See full portfolio")))), /*#__PURE__*/React.createElement(CapabilitiesGrid, null), /*#__PURE__*/React.createElement(AboutTeaser, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(FooterCTA, null));
}
function PortfolioPage({
  onOpenProject
}) {
  const {
    projects
  } = window.LH_DATA;
  const [active, setActive] = useState("All");
  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter(p => p.tags.includes(active));
  }, [active, projects]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "lh-section lh-portfolio-head",
    "data-screen-label": "Portfolio header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Portfolio \xB7 ", projects.length, " projects"), /*#__PURE__*/React.createElement("h1", {
    className: "lh-page-title"
  }, "Selected work across CGI, AI and VFX."), /*#__PURE__*/React.createElement(FilterRow, {
    active: active,
    onChange: setActive
  }))), /*#__PURE__*/React.createElement("section", {
    className: "lh-section",
    "data-screen-label": "Portfolio grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement(WorkGrid, {
    projects: filtered,
    onOpen: onOpenProject
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "lh-empty"
  }, "Nothing in this category yet."))), /*#__PURE__*/React.createElement(FooterCTA, null));
}
function AboutPage() {
  const {
    brand
  } = window.LH_DATA;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "lh-section lh-about-hero",
    "data-screen-label": "About hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "About"), /*#__PURE__*/React.createElement("h1", {
    className: "lh-page-title"
  }, "Digital Artist \xB7 3D \xB7 AI \xB7 VFX"), /*#__PURE__*/React.createElement("p", {
    className: "lh-hero-copy"
  }, brand.aboutBio), /*#__PURE__*/React.createElement("div", {
    className: "lh-meta-row"
  }, /*#__PURE__*/React.createElement("span", null, "Based in ", brand.location), /*#__PURE__*/React.createElement("span", null, brand.year), /*#__PURE__*/React.createElement("span", null, "Available for selected projects")))), /*#__PURE__*/React.createElement("section", {
    className: "lh-section lh-section-muted",
    "data-screen-label": "Services"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-section-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Services"), /*#__PURE__*/React.createElement("h2", {
    className: "lh-section-title"
  }, "How I collaborate.")), /*#__PURE__*/React.createElement(AboutServices, null))), /*#__PURE__*/React.createElement(FooterCTA, null));
}
function ProjectSheet({
  project,
  onClose
}) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!project) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lh-sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "lh-sheet-inner",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "lh-sheet-close",
    onClick: onClose,
    "aria-label": "Close"
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    className: "lh-sheet-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: `../../assets/work/${project.slug}.svg`,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "lh-sheet-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lh-eyebrow"
  }, "Project \xB7 ", project.year), /*#__PURE__*/React.createElement("h2", null, project.title), /*#__PURE__*/React.createElement("div", {
    className: "lh-tag-row"
  }, project.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "lh-tag"
  }, t))), /*#__PURE__*/React.createElement("p", {
    className: "lh-sheet-note"
  }, "Case study coming soon. Full project sheets, process imagery and credits will live here once the production site is rebuilt."))));
}
function App() {
  const [page, setPage] = useState("home");
  const [project, setProject] = useState(null);
  useEffect(() => {
    // scroll to top on page change
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [page]);
  return /*#__PURE__*/React.createElement("div", {
    className: "lh-site"
  }, /*#__PURE__*/React.createElement(Header, {
    page: page,
    onNav: setPage
  }), page === "home" && /*#__PURE__*/React.createElement(HomePage, {
    onNav: setPage,
    onOpenProject: setProject
  }), page === "portfolio" && /*#__PURE__*/React.createElement(PortfolioPage, {
    onOpenProject: setProject
  }), page === "about" && /*#__PURE__*/React.createElement(AboutPage, null), /*#__PURE__*/React.createElement(ProjectSheet, {
    project: project,
    onClose: () => setProject(null)
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/data.js
try { (() => {
// Shared content for the portfolio UI kit.
// Verbatim from _source/site-audit.md and _source/DESIGN.md.

window.LH_DATA = {
  brand: {
    name: "Luong Huynh",
    location: "Ho Chi Minh City",
    year: "2026",
    tagline: "Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories.",
    aboutBio: "I'm a digital artist focused on 3D visuals, AI-generated images and VFX. I collaborate with brands, agencies and production teams to create campaign-ready visuals, cinematic key visuals and experimental AI-assisted imagery."
  },
  nav: [{
    id: "home",
    label: "Homepage"
  }, {
    id: "portfolio",
    label: "Portfolio"
  }, {
    id: "about",
    label: "About"
  }],
  socials: [{
    label: "Behance",
    slug: "behance",
    url: "#"
  }, {
    label: "Dribbble",
    slug: "dribbble",
    url: "#"
  }, {
    label: "Instagram",
    slug: "instagram",
    url: "#"
  }, {
    label: "LinkedIn",
    slug: "linkedin",
    url: "#"
  }],
  categories: ["All", "CGI", "3D Model", "AI Generated", "Key Visuals", "TVC / Film", "Branding", "Web Design"],
  capabilities: [{
    n: "01",
    title: "3D Product & CGI Visuals",
    blurb: "Photoreal CG product, scene and packshot work for campaigns and launches."
  }, {
    n: "02",
    title: "AI-generated Campaign Imagery",
    blurb: "Brand-aligned AI key visuals, mood pieces and concept frames."
  }, {
    n: "03",
    title: "VFX, Compositing & Post-production",
    blurb: "Cleanup, compositing and finishing for TVC and short-form film."
  }, {
    n: "04",
    title: "Visual Direction for Brand Campaigns",
    blurb: "End-to-end art direction for campaign rollouts and key visuals."
  }],
  projects: [{
    slug: "stride-beyond",
    title: "Stride Beyond",
    tags: ["AI Generated", "Branding"],
    year: 2025,
    featured: true
  }, {
    slug: "nexora",
    title: "Nexora",
    tags: ["Branding"],
    year: 2025,
    featured: true
  }, {
    slug: "bt-studio-beverage",
    title: "BT Studio – CGI Beverage Demo",
    tags: ["CGI", "Branding"],
    year: 2025,
    featured: true
  }, {
    slug: "tvc-ovaltine",
    title: "TVC Ovaltine 2015 Adaptation",
    tags: ["TVC / Film"],
    year: 2024
  }, {
    slug: "huda-football",
    title: "BT Studio – CGI Huda Football",
    tags: ["CGI"],
    year: 2024
  }, {
    slug: "cheers-victory",
    title: "Cheers to Victory",
    tags: ["CGI"],
    year: 2024
  }, {
    slug: "afc-key-visual",
    title: "AFC Key Visual",
    tags: ["Key Visuals"],
    year: 2024
  }, {
    slug: "twister-pack",
    title: "Twister Pack Visual",
    tags: ["3D Model"],
    year: 2023
  }, {
    slug: "halida-tet-2022",
    title: "Halida Tet 2022 Key Visual",
    tags: ["Key Visuals"],
    year: 2022
  }, {
    slug: "huda-carnival",
    title: "Huda Beach Carnival 2023",
    tags: ["Key Visuals"],
    year: 2023
  }, {
    slug: "circuit",
    title: "Circuit",
    tags: ["AI Generated"],
    year: 2024
  }, {
    slug: "spectral",
    title: "Spectral",
    tags: ["AI Generated"],
    year: 2024
  }, {
    slug: "astralis",
    title: "Astralis",
    tags: ["AI Generated"],
    year: 2025
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/data.js", error: String((e && e.message) || e) }); }

})();
