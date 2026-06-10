// AboutTeaser.jsx — short about block used on homepage; deep version lives on About page.
function AboutTeaser({ onNav }) {
  const { brand } = window.LH_DATA;
  return (
    <section className="lh-section" data-screen-label="About teaser">
      <div className="lh-container lh-about-teaser">
        <span className="lh-eyebrow">About</span>
        <p className="lh-about-bio">{brand.aboutBio}</p>
        <a
          className="lh-button lh-button-secondary"
          href="#"
          onClick={(e) => { e.preventDefault(); onNav("about"); }}
        >
          More about Luong
        </a>
      </div>
    </section>
  );
}

window.AboutTeaser = AboutTeaser;
