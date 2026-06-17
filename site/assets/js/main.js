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

  // --- Autoplay card videos on hover ---
  function initCardHoverVideos() {
    const cards = document.querySelectorAll('.lh-work-card');
    cards.forEach(card => {
      const video = card.querySelector('.lh-work-media video');
      if (!video) return;

      // Ambient loops (autoplay attribute) are the card's only media — they
      // are not part of the hover dissolve. Drive them by viewport instead:
      // recovers from autoplay being blocked in background tabs, and stops
      // offscreen playback.
      if (video.hasAttribute('autoplay')) {
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(entries => {
            entries.forEach(e => {
              if (e.isIntersecting) video.play().catch(() => {});
              else video.pause();
            });
          }, { threshold: 0.1 }).observe(video);
        }
        return;
      }

      // Start video paused by default, since we control it via hover JS
      video.pause();

      let leaveTimeout = null;
      let isHovering = false;

      // The CSS dissolve is gated on .is-video-playing: only swap the still
      // for the video once it really has frames, so preload="none" buffering
      // never flashes black under the thumbnail.
      video.addEventListener('playing', () => {
        if (isHovering) card.classList.add('is-video-playing');
      });

      card.addEventListener('mouseenter', () => {
        isHovering = true;
        if (leaveTimeout) {
          clearTimeout(leaveTimeout);
          leaveTimeout = null;
        }
        video.play().catch(err => {
          console.warn('Card video play prevented:', err);
        });
      });

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        card.classList.remove('is-video-playing'); // dissolve back to the still
        if (leaveTimeout) clearTimeout(leaveTimeout);
        leaveTimeout = setTimeout(() => {
          video.pause();
          video.currentTime = 0;
        }, 1150); // keep playing under the 1.1s dissolve back to the still
      });
    });
  }

  // --- Scroll Zoom Cover Video on Case Study page ---
  function initScrollZoomVideo() {
    const sections = document.querySelectorAll('.lh-scroll-zoom-section');
    if (!sections.length) return;

    function handleScroll() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY || window.pageYOffset;

      sections.forEach(section => {
        const wrapper = section.querySelector('.lh-scroll-zoom-wrapper');
        if (!wrapper) return;

        const video = wrapper.querySelector('video');

        // Disable scaling on mobile devices (width <= 768px)
        if (viewportWidth <= 768) {
          wrapper.style.width = '';
          wrapper.style.borderRadius = 'var(--lh-radius-lg)';
          if (video) video.style.transform = 'none';
          return;
        }

        // Calculate position of the section relative to document
        const rect = section.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;

        const startScroll = elementTop - viewportHeight;
        const endScroll = elementTop - 80; // Stop expanding when top reaches header sticky bar (80px)

        let progress = (scrollTop - startScroll) / (endScroll - startScroll);
        progress = Math.max(0, Math.min(1, progress));

        // Calculate initial layout container width
        const gutter = 24; // standard --lh-gutter is 24px
        const maxContainer = 1440; // standard --lh-max is 1440px
        const initialWidth = Math.min(viewportWidth - (gutter * 2), maxContainer);

        // Wrapper expands horizontally, naturally pushing content below down without clipping
        const currentWidth = initialWidth + progress * (viewportWidth - initialWidth);
        const initialRadius = 16; // matching var(--lh-radius-lg) default of 16px
        const currentRadius = (1 - progress) * initialRadius;

        wrapper.style.width = `${currentWidth.toFixed(2)}px`;
        wrapper.style.borderRadius = `${currentRadius.toFixed(2)}px`;

        // Apply subtle 3D parallax zoom out on the video inside the wrapper
        if (video) {
          const videoScale = 1.15 - progress * 0.15; // Zoom out from 1.15x to 1x
          video.style.transform = `translate3d(0px, 0px, 0px) scale(${videoScale.toFixed(5)})`;
        }
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Run initially
  }

  // --- CTA Cinematic 3D Object (procedural sentinel that tracks the cursor) ---
  // Injected into every .lh-cta / .lh-footer-cta panel so the whole site picks
  // it up from one place. Three.js is lazy-loaded from a CDN only when a CTA is
  // actually present and motion is allowed.
  // three r147 is the last release that still ships the classic UMD
  // examples/js loaders, so GLTFLoader can attach to the global THREE
  // without an ES-module import map.
  const THREE_VER = '0.147.0';
  const MODEL_URL = 'assets/models/robot.glb';
  let _threePromise = null;
  function loadThree() {
    if (window.THREE && window.THREE.GLTFLoader) return Promise.resolve(window.THREE);
    if (_threePromise) return _threePromise;
    const inject = (src) => new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
    const ex = `https://cdn.jsdelivr.net/npm/three@${THREE_VER}/examples/js/`;
    _threePromise = inject(`https://cdn.jsdelivr.net/npm/three@${THREE_VER}/build/three.min.js`)
      .then(() => {
        if (!window.THREE) throw new Error('THREE missing');
        return Promise.all([
          inject(ex + 'loaders/GLTFLoader.js'),
          // RoomEnvironment gives the PBR materials something to reflect — the
          // single biggest upgrade to how "cinematic" the model reads.
          inject(ex + 'environments/RoomEnvironment.js'),
        ]);
      })
      .then(() => {
        if (!window.THREE.GLTFLoader) throw new Error('GLTFLoader missing');
        return window.THREE;
      });
    return _threePromise;
  }

  // Radial-gradient sprite texture for additive glows (eye + antenna tip).
  function makeGlowTexture(THREE, rgb) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(' + rgb + ',1)');
    grad.addColorStop(0.25, 'rgba(' + rgb + ',0.55)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.Texture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function buildSentinel(THREE, cta, coarse) {
    if (cta.querySelector('.lh-cta-object')) return; // already built

    const host = document.createElement('div');
    host.className = 'lh-cta-object';
    host.setAttribute('aria-hidden', 'true');
    cta.appendChild(host);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      host.remove();
      return;
    }
    const ACCENT = 0x00f0ff;
    let w = host.clientWidth || 1;
    let h = host.clientHeight || 1;
    // transparent buffer: the CSS left-mask fades the scene into the CTA gradient
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0.6, 0.45, 9.2);
    camera.lookAt(0, 0.35, 0);

    // --- barely-there image-based lighting: a trace of reflection so the
    // plastic/metal isn't pure black. envMapIntensity is dialed right down. ---
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.RoomEnvironment();
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    envScene.dispose && envScene.dispose();

    // ── LIGHTING RIG ──────────────────────────────────────────────────────
    // Cinematic three-zone setup: a strong WARM back/rim that separates the
    // robot from the haze, a soft COOL key from front-left, and a cyan ACCENT
    // rim that ties into the brand glow. Ambient stays near-zero so the rims do
    // the storytelling and highlights stay crisp.
    scene.add(new THREE.AmbientLight(0x0a1018, 0.06));

    // KEY — soft, cool, front-left. Gentle fill that shapes the face/chest.
    const key = new THREE.DirectionalLight(0x6A5ACD, 0.15);
    key.position.set(-7, 2.5, 2.5);
    scene.add(key);

    // WARM BACKLIGHT (hero) — amber, high and behind-right, throws the bright
    // rim onto the head/shoulders.
    const backRim = new THREE.DirectionalLight(0xffa24d, 0.6);
    backRim.position.set(3.5, 4.5, -6);
    scene.add(backRim);
    // a warm point tucked behind the robot for a soft glow on its back
    const backGlow = new THREE.PointLight(0xff8a3a, 1.0, 9, 2);
    backGlow.position.set(0.6, 1.4, -3.2);
    scene.add(backGlow);

    // CYAN ACCENT rim — grazes the left edge, brand-coloured.
    const rim = new THREE.DirectionalLight(ACCENT, 1.35);
    rim.position.set(-6, 2.2, -4.5);
    scene.add(rim);

    // tiny cyan spill from the face so the eyes glow reads on nearby surfaces
    const eyePoint = new THREE.PointLight(ACCENT, 0.25, 5, 2);
    eyePoint.position.set(0, 1.25, 1.4);
    scene.add(eyePoint);

    // SHADOW caster — dim cool light from above whose real job is a soft
    // contact shadow on the platform (PCFSoft + large radius = not hard-edged).
    const shadowLight = new THREE.DirectionalLight(0xbcd4e6, 0.15);
    shadowLight.position.set(0, 10, -3);
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.set(2048, 2048);
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 20;
    shadowLight.shadow.camera.left = -4;
    shadowLight.shadow.camera.right = 4;
    shadowLight.shadow.camera.top = 4;
    shadowLight.shadow.camera.bottom = -4;
    shadowLight.shadow.bias = -0.0006;
    shadowLight.shadow.radius = 6;
    scene.add(shadowLight);

    // --- bot root group: the loaded glb lives here; it floats + turns ---
    const PODIUM_TOP = -1.64;            // world-Y of the podium's top surface
    const bot = new THREE.Group();
    scene.add(bot);

    let model = null;        // the loaded gltf.scene
    let headNode = null;     // the "head" node (turns toward the pointer)
    const glowMats = [];     // emissive materials we pulse (eyes / accents)

    const loader = new THREE.GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
      model = gltf.scene;

      // Collect emissive materials so we can pulse the glow. The emissive
      // is gated by an emission map, so only the eyes/accents light up.
      // r147's loader ignores KHR_materials_emissive_strength, so bump it.
      const seenMats = new Set();           // 16 meshes share one material — touch it once
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.frustumCulled = false;
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m || seenMats.has(m)) return;
          seenMats.add(m);
          m.envMapIntensity = 0.12;            // dim IBL — keep the scene dark
          if (m.emissive && (m.emissive.r + m.emissive.g + m.emissive.b) > 0.01) {
            m.emissiveIntensity = 2.2;
            m.toneMapped = false;
            glowMats.push(m);
          }
        });
      });

      // Auto-fit: scale to a target height, centre on X/Z, rest the feet on
      // the podium so the model works regardless of its authored units.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const s = 3.4 / (size.y || 1);
      model.scale.setScalar(s);
      model.position.set(-center.x * s, -box.min.y * s + PODIUM_TOP, -center.z * s);
      bot.add(model);

      headNode = model.getObjectByName('head');
      if (headNode) headNode.userData.q0 = headNode.quaternion.clone();

      resize();
    }, undefined, () => { host.classList.add('lh-cta-object--nomodel'); });

    // ===== PLATFORM / PODIUM =====
    const podium = new THREE.Group();
    podium.position.set(0, -1.78, 0);
    scene.add(podium);
    // beveled disk via a lathed cross-section (chamfered top edge). Colour is
    // ~40% darker than before; the cyan rim ring stays bright on top of it.
    const podProfile = [
      [0.00, -0.12], [1.55, -0.12],   // bottom: centre → outer corner
      [1.50, 0.12],                   // near-straight side up to just below the top
      [1.48, 0.14],                   // tiny ~2px chamfer that catches the rim light
      [1.30, 0.14], [0.00, 0.14],     // flat top: outer → centre
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    const disk = new THREE.Mesh(
      new THREE.LatheGeometry(podProfile, 72),
      // glossier top → subtle reflections of the ring + robot; envMap lifted
      new THREE.MeshStandardMaterial({ color: 0x080b0f, metalness: 0.7, roughness: 0.28, envMapIntensity: 0.6 })
    );
    disk.receiveShadow = true;                  // catches the robot's contact shadow
    podium.add(disk);
    // bright cyan ring — the glowing light strip on the platform rim.
    const podRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.022, 12, 120),
      new THREE.MeshStandardMaterial({ color: 0xd6ffff, emissive: 0x9ffcff, emissiveIntensity: 1.6, roughness: 0.3 })
    );
    podRing.rotation.x = Math.PI / 2;
    podRing.position.y = 0.142;
    podium.add(podRing);
    // faint wide halo just outside the ring for a soft falloff on the disk
    const podHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.30, 1.46, 96),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
    );
    podHalo.rotation.x = -Math.PI / 2;
    podHalo.position.y = 0.145;
    podium.add(podHalo);

    // --- orbiting hairline arc behind the bot ---
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.011, 8, 120),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.0, transparent: true, opacity: 0.55 })
    );
    orbit.rotation.set(1.2, 0.3, 0);
    orbit.position.set(0, 0.6, -1.2);
    scene.add(orbit);

    // --- floating low-poly shapes: teal, semi-transparent, faint glow ---
    // Two shared materials keep draw setup cheap. "edge" ones glow a touch more
    // so Bloom rims them; all are translucent and fade into the fog with depth.
    const triMat = new THREE.MeshStandardMaterial({
      color: 0x1b3038, metalness: 0.3, roughness: 0.5, flatShading: true,
      emissive: 0x123038, emissiveIntensity: 0.5, transparent: true, opacity: 0.45,
    });
    const triEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x214049, metalness: 0.2, roughness: 0.55, flatShading: true,
      emissive: ACCENT, emissiveIntensity: 0.6, transparent: true, opacity: 0.55,
    });
    const tris = [];
    const TRI_DEFS = [
      // [x, y, z, size, edge?]
      [-3.4, 1.8, -3.5, 0.55, false], [3.6, 2.2, -4.0, 0.7, true],
      [-2.6, -1.4, -3.0, 0.42, false], [3.0, -0.6, -3.2, 0.5, false],
      [-4.0, 0.2, -5.0, 0.9, true], [4.4, 1.0, -5.5, 0.8, false],
      [1.8, 2.8, -4.5, 0.4, false], [-1.6, 2.6, -4.2, 0.38, true],
      [2.4, -1.8, -4.0, 0.6, false], [-3.0, -0.2, -2.6, 0.34, false],
      [-4.6, 2.6, -6.0, 0.5, true], [4.0, -1.6, -5.2, 0.45, false],
    ];
    TRI_DEFS.forEach((d) => {
      const geo = Math.random() < 0.5 ? new THREE.TetrahedronGeometry(d[3]) : new THREE.OctahedronGeometry(d[3]);
      const m = new THREE.Mesh(geo, d[4] ? triEdgeMat : triMat);
      m.position.set(d[0], d[1], d[2]);
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      m.userData = {
        rs: (Math.random() - 0.5) * 0.4,            // rotation speed
        rs2: (Math.random() - 0.5) * 0.3,
        fa: Math.random() * Math.PI * 2,            // float phase
        fs: 0.25 + Math.random() * 0.35,            // float speed
        fy: d[1], amp: 0.15 + Math.random() * 0.25, // float anchor + amplitude
      };
      scene.add(m);
      tris.push(m);
    });

    // --- floating dust ---
    const dustN = 90;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 7;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xf4f0e8, size: 0.03, transparent: true, opacity: 0.5, depthWrite: false }));
    scene.add(dust);

    // --- pointer state (viewport-global so the head "watches the room") ---
    const ptr = { x: 0, y: 0, t: -9999 };
    let rect = host.getBoundingClientRect();
    const refreshRect = () => { rect = host.getBoundingClientRect(); };
    if (!coarse) {
      window.addEventListener('pointermove', (e) => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        ptr.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5)));
        ptr.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5)));
        ptr.t = performance.now();
      }, { passive: true });
    }

    function resize() {
      w = host.clientWidth || 1;
      h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      refreshRect();
    }
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', refreshRect, { passive: true });
    // The CTA panel's height shifts as fonts/layout settle, so a one-off size
    // read leaves the canvas buffer stretched. Keep it locked to the host box.
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);

    const clock = new THREE.Clock();
    let running = false, rafId = 0;
    const MAX_YAW = 0.6, MAX_PITCH = 0.35;
    const BASE_YAW = THREE.MathUtils.degToRad(-30);  // resting three-quarter turn (to the left)
    let curYaw = 0, curPitch = 0;        // smoothed look state
    // reused for the head's look rotation. The "head" node has a baked 90°
    // X-rotation (Blender Z-up export), so its local axes are NOT world axes —
    // we pre-multiply a world-space delta onto the base quaternion instead of
    // using rotateY/rotateX, which would tilt/roll the head instead of yaw it.
    const _lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    const _lookQuat = new THREE.Quaternion();

    function frame() {
      if (!running) return;
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // target look direction — follow cursor, or idle-sweep when pointer rests
      let ty, tp;
      const idle = coarse || (performance.now() - ptr.t > 2600);
      if (idle) {
        ty = Math.sin(t * 0.45) * 0.42;
        tp = Math.sin(t * 0.31) * 0.12;
      } else {
        ty = ptr.x * MAX_YAW;
        tp = ptr.y * MAX_PITCH;
      }
      curYaw += (ty - curYaw) * 0.07;
      curPitch += (tp - curPitch) * 0.07;

      // the head node turns toward the pointer; the whole body adds a subtle
      // counter-turn so the motion reads even if the head pivot sits at origin
      if (headNode && headNode.userData.q0) {
        // world-space yaw/pitch, applied on top of the node's baked orientation
        _lookEuler.set(curPitch * 0.5, curYaw * 0.6, 0);
        _lookQuat.setFromEuler(_lookEuler);
        headNode.quaternion.copy(_lookQuat).multiply(headNode.userData.q0);
      }
      bot.rotation.y = BASE_YAW + curYaw * 0.35;     // rest at a 30° three-quarter pose
      bot.rotation.x = curPitch * 0.18;

      // planted on the podium — no float

      const flick = Math.sin(t * 2.4);
      const pulse = 1.9 + flick * 0.6;
      for (let i = 0; i < glowMats.length; i++) glowMats[i].emissiveIntensity = pulse;
      eyePoint.intensity = 0.25 + flick * 0.08;        // faint face-glow spill breathes

      // drift + slow-tumble the background triangles
      for (let i = 0; i < tris.length; i++) {
        const m = tris[i], u = m.userData;
        m.rotation.x += dt * u.rs;
        m.rotation.y += dt * u.rs2;
        m.position.y = u.fy + Math.sin(t * u.fs + u.fa) * u.amp;
      }

      podRing.rotation.z += dt * 0.2;
      orbit.rotation.z += dt * 0.18;
      dust.rotation.y += dt * 0.02;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; clock.getDelta(); rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(rafId); }

    // only render while the CTA is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.05 }).observe(host);
    } else {
      start();
    }
    resize();
  }

  // --- Credibility stat counters: count up from 0 when scrolled into view ---
  function initStatCounters() {
    const groups = document.querySelectorAll('.lh-stats');
    if (!groups.length) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function run(el) {
      const target = parseFloat(el.dataset.countTo) || 0;
      if (reduce) { el.textContent = String(target); return; }
      const dur = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = String(Math.round(target * ease(p)));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      }
      el.textContent = '0';
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('[data-count-to]').forEach(run);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.35 });
      groups.forEach((g) => io.observe(g));
    } else {
      groups.forEach((g) => g.querySelectorAll('[data-count-to]').forEach(run));
    }
  }

  // --- Selected Frames reel strip: clone track for a seamless marquee loop ---
  function initReelStrips() {
    const reels = document.querySelectorAll('[data-reel]');
    if (!reels.length) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reels.forEach(reel => {
      const track = reel.querySelector('.lh-reel-track');
      if (!track) return;
      // Reduced motion: leave it as a native horizontal scroll (no auto-loop).
      if (reduce) return;

      const originals = Array.prototype.slice.call(track.children);
      if (!originals.length) return;

      // Duplicate the set so translateX(-50%) lands exactly on the seam.
      originals.forEach(node => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');           // keep clones out of tab order
        track.appendChild(clone);
      });

      // Speed scales with the number of frames so the pace feels constant.
      const dur = Math.max(28, originals.length * 7);
      reel.style.setProperty('--lh-reel-dur', dur + 's');
      reel.classList.add('is-animated');
    });
  }

  function initCtaObjects() {
    const ctas = document.querySelectorAll('.lh-cta, .lh-footer-cta');
    if (!ctas.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    loadThree()
      .then((THREE) => { ctas.forEach((cta) => buildSentinel(THREE, cta, coarse)); })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCustomCursor();
      initCardHoverVideos();
      initScrollZoomVideo();
      initStatCounters();
      initReelStrips();
      initCtaObjects();
    });
  } else {
    initCustomCursor();
    initCardHoverVideos();
    initScrollZoomVideo();
    initStatCounters();
    initReelStrips();
    initCtaObjects();
  }
})();
