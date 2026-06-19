/* ============================================================================
   gsap-scroll.js — Scroll-driven choreography for the GSAP version of the
   Luong Huynh homepage (index-gsap.html).

   This file OWNS all scroll reveals on that page. The default IntersectionObserver
   reveal in main.js is neutralised there via a CSS override (.lh-reveal stays
   visible by default), so GSAP's gsap.from() can read the natural end-state
   (opacity:1) and animate into it without the "stuck invisible" pitfall.

   Modules:
     heroFade()        — hero settles, then fades/lifts away on first scroll
     marqueeScrub()    — discipline marquee drifts with scroll progress
     revealText()      — section kickers, titles and copy rise in
     revealWorkCards() — selected-work cards wipe in with a horizontal mask
     revealApproach()  — process cards reveal sequentially (stagger)
     revealServices()  — service cards fade / slide up
     revealCTA()       — contact block glows in on entry
     progressRail()    — fixed left rail tracks page + section progress
   ========================================================================== */
(function () {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    // GSAP failed to load (offline / blocked CDN). Reveal everything so the
    // page is never left hidden, then bail.
    document.querySelectorAll('.lh-reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* prefers-reduced-motion: skip all motion, present everything immediately. */
  if (reduceMotion) {
    document.querySelectorAll('.lh-reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    progressRail(true);
    return;
  }

  /* ---------------------------------------------------------------- heroFade */
  function heroFade() {
    var hero = document.querySelector('.lh-hero');
    if (!hero) return;
    gsap.to(hero, {
      autoAlpha: 0,
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ------------------------------------------------------------ marqueeScrub */
  function marqueeScrub() {
    var marquee = document.querySelector('.lhx-marquee');
    if (!marquee) return;
    var tracks = marquee.querySelectorAll('.lhx-marquee-track');
    tracks.forEach(function (track, i) {
      gsap.to(track, {
        xPercent: i % 2 === 0 ? -12 : 12,
        ease: 'none',
        scrollTrigger: {
          trigger: marquee,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  /* -------------------------------------------------------------- revealText */
  function revealText() {
    // Standalone text reveals (kickers, titles, copy, actions) that are not
    // inside the card grids handled below.
    var nodes = gsap.utils.toArray(
      '.lh-section-head .lh-reveal, .lh-section-actions.lh-reveal, ' +
      '.lhx-clients.lh-reveal'
    );
    nodes.forEach(function (el) {
      gsap.from(el, {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
  }

  /* --------------------------------------------------------- revealWorkCards */
  function revealWorkCards() {
    var cards = gsap.utils.toArray('.lhx-works .lh-work-card');
    if (!cards.length) return;
    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          {
            autoAlpha: 0,
            y: 60,
            clipPath: 'inset(0 100% 0 0)'
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.12
          }
        );
      }
    });
  }

  /* --------------------------------------------------------- revealApproach */
  function revealApproach() {
    var cards = gsap.utils.toArray('.lhx-approach .lhx-approach-card');
    if (!cards.length) return;
    gsap.from(cards, {
      autoAlpha: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.18,
      scrollTrigger: { trigger: '.lhx-approach', start: 'top 80%', once: true }
    });
  }

  /* --------------------------------------------------------- revealServices */
  function revealServices() {
    var cards = gsap.utils.toArray('.lh-service-grid .lh-service-card');
    if (!cards.length) return;
    gsap.from(cards, {
      autoAlpha: 0,
      y: 44,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.lh-service-grid', start: 'top 82%', once: true }
    });
  }

  /* -------------------------------------------------------------- revealCTA */
  function revealCTA() {
    var cta = document.querySelector('.lh-cta');
    if (!cta) return;
    var bits = gsap.utils.toArray('.lh-cta .lh-reveal');
    var tl = gsap.timeline({
      scrollTrigger: { trigger: cta, start: 'top 78%', once: true }
    });
    tl.fromTo(cta,
      { '--cta-glow': 0 },
      { '--cta-glow': 1, duration: 1.2, ease: 'power2.out' }, 0
    ).from(bits, {
      autoAlpha: 0,
      y: 36,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12
    }, 0.1);
  }

  /* ------------------------------------------------------------ progressRail */
  function progressRail(staticOnly) {
    var rail = document.querySelector('.lhx-rail');
    if (!rail) return;
    var fill = rail.querySelector('.lhx-rail-fill');
    var dots = gsap.utils.toArray('.lhx-rail-dot');
    var sections = gsap.utils.toArray('main > section');

    if (fill && !staticOnly) {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }

    // Light up the dot matching the section currently in view.
    sections.forEach(function (section, i) {
      var dot = dots[i];
      if (!dot) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: function (self) { dot.classList.toggle('is-active', self.isActive); }
      });
    });
  }

  /* ----------------------------------------------------------------- init */
  heroFade();
  marqueeScrub();
  revealText();
  revealWorkCards();
  revealApproach();
  revealServices();
  revealCTA();
  progressRail(false);

  // Recalculate once late assets (fonts, images, particle canvas) settle.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
