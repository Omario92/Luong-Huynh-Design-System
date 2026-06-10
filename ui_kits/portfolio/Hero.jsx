// Hero.jsx — the homepage hero: eyebrow, name, lead, meta, CTAs.
function Hero({ onNav }) {
  const { brand } = window.LH_DATA;
  return (
    <section className="lh-section lh-hero" data-screen-label="Hero">
      <div className="lh-container">
        <div className="lh-eyebrow">Digital Artist · 3D · AI · VFX</div>
        <h1 className="lh-hero-title">{brand.name}</h1>
        <p className="lh-hero-copy">{brand.tagline}</p>
        <div className="lh-meta-row">
          <span>{brand.location}</span>
          <span>{brand.year}</span>
          <span>Available for selected projects</span>
        </div>
        <div className="lh-cta-row">
          <a
            href="#"
            className="lh-button"
            onClick={(e) => { e.preventDefault(); onNav("portfolio"); }}
          >
            View Portfolio
          </a>
          <a
            href="#"
            className="lh-button lh-button-secondary"
            onClick={(e) => { e.preventDefault(); onNav("about"); }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
