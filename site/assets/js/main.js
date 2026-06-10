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
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip special keys (Ctrl/Cmd click, middle click, shift click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || (e.button && e.button === 1)) {
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
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        page.classList.remove('is-exiting');
        page.classList.add('is-loaded');
      }
    });
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if ((current === '' && href === 'index.html') || href === current) {
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
    heading.innerHTML = `<span aria-hidden="true" style="display: block;">${
      lines.map((lineWords, lineIndex) => {
        const lineText = lineWords.join(' ');
        // Stagger delay increased to 0.15s per line for better pacing
        return `<span class="lh-reveal-line"><span class="lh-reveal-line-inner" style="transition-delay: ${lineIndex * 0.15}s;">${lineText}</span></span>`;
      }).join('\n')
    }</span>`;
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
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // --- Particle Portrait Canvas ---
  const canvas = document.getElementById('lh-particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const imageSrc = canvas.dataset.image;

    let particles = [];
    let width = 0;
    let height = 0;
    const mouse = { x: null, y: null, radius: 80 };
    const margin = 0.02; // 2% padding inside canvas
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let twinkleT = 0;

    let drawW = 0, drawH = 0, offsetX = 0, offsetY = 0;
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
        this.twinkle = false; this.rgb = null; this.baseAlpha = 1; this.twinkleMin = 0.5;
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
            this.twinkle = isLight ? true : (Math.random() < 0.22);
            this.twinkleMin = isLight ? (0.16 + Math.random() * 0.32) : 0.74;
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
            if (visited[idx] === 0) { visited[idx] = 1; queue.push([x, 0]); }
          }
          if (x < 10 || x > detail - 10) {
            if (isWhite(x, detail - 1)) {
              const idx = (detail - 1) * detail + x;
              if (visited[idx] === 0) { visited[idx] = 1; queue.push([x, detail - 1]); }
            }
          }
        }
        for (let y = 0; y < detail; y++) {
          if (isWhite(0, y)) {
            const idx = y * detail;
            if (visited[idx] === 0) { visited[idx] = 1; queue.push([0, y]); }
          }
          if (isWhite(detail - 1, y)) {
            const idx = y * detail + (detail - 1);
            if (visited[idx] === 0) { visited[idx] = 1; queue.push([detail - 1, y]); }
          }
        }

        // Process BFS
        while (queue.length > 0) {
          const [qx, qy] = queue.shift();
          const neighbors = [
            [qx + 1, qy],
            [qx - 1, qy],
            [qx, qy + 1],
            [qx, qy - 1]
          ];
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

            const targetX = offsetX + (x / detail) * drawW;
            const targetY = offsetY + (y / detail) * drawH;

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
              const targetX = offsetX + (x / detail) * drawW;
              const targetY = offsetY + (y / detail) * drawH;
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
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      // Track touch position for mobile responsiveness
      canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.touches[0].clientX - rect.left;
          mouse.y = e.touches[0].clientY - rect.top;
        }
      }, { passive: true });

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
          grad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');  // cyan core
          grad.addColorStop(0.4, 'rgba(0, 150, 136, 0.08)'); // teal mid
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');          // fade
          
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
            if (colIdx === 0) factor = -0.1;
            else if (colIdx === 1) factor = 0;
            else if (colIdx === 2) factor = 0.1;
          } else if (cols === 2) {
            if (colIdx === 0) factor = -0.07;
            else if (colIdx === 1) factor = 0.07;
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
    }, { passive: true });

    // Also run initial update to position items correctly if page is loaded scrolled down
    setTimeout(updateCardParallax, 200);
  }

  // --- Custom Interactive Cinematic Cursor ---
  function initCustomCursor() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouch || prefersReducedMotion) return;

    const cursorEl = document.createElement('div');
    cursorEl.className = 'lh-cursor';
    cursorEl.innerHTML = `
      <div class="lh-cursor-dot" data-cursor-dot></div>
      <div class="lh-cursor-ring" data-cursor-ring>
        <span class="lh-cursor-text" data-cursor-text>View</span>
      </div>
    `;
    document.body.appendChild(cursorEl);

    const dot = cursorEl.querySelector('[data-cursor-dot]');
    const ring = cursorEl.querySelector('[data-cursor-ring]');
    const text = cursorEl.querySelector('[data-cursor-text]');

    let mouseX = -100;
    let mouseY = -100;
    
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;

    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        cursorEl.classList.add('lh-cursor--active');
        document.body.classList.add('lh-has-custom-cursor');
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorEl.classList.remove('lh-cursor--active');
      document.body.classList.remove('lh-has-custom-cursor');
    });

    function updatePhysics() {
      if (isVisible) {
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      requestAnimationFrame(updatePhysics);
    }
    
    requestAnimationFrame(updatePhysics);

    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target) return;

      const card = target.closest('.lh-work-card');
      const interactive = target.closest('a, button, .lh-filter-btn, [role="button"], input[type="submit"], input[type="button"]');

      if (card) {
        cursorEl.className = 'lh-cursor lh-cursor--active lh-cursor--hovering-card';
        text.textContent = 'View';
      } else if (interactive) {
        cursorEl.className = 'lh-cursor lh-cursor--active lh-cursor--hovering-link';
      } else {
        cursorEl.className = 'lh-cursor lh-cursor--active';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor);
  } else {
    initCustomCursor();
  }
})();
