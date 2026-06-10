// FooterCTA.jsx — closing footer with big title, contact CTA, socials.
function FooterCTA() {
  const { socials } = window.LH_DATA;
  return (
    <section className="lh-section" data-screen-label="Footer CTA">
      <div className="lh-container">
        <div className="lh-footer-cta">
          <span className="lh-eyebrow">Contact</span>
          <h2>Available for Work in 2026.</h2>
          <div className="lh-cta-row">
            <a className="lh-button" href="mailto:hello@luonghuynh.com">Get in Touch</a>
            <a className="lh-button lh-button-secondary" href="#">View Portfolio</a>
          </div>
        </div>
        <div className="lh-footer-bottom">
          <span className="meta">© 2026 Luong Huynh · Ho Chi Minh City</span>
          <div className="lh-social-row">
            {socials.map((s) => (
              <a key={s.slug} href={s.url} className="lh-social" aria-label={s.label}>
                <img
                  src={`https://cdn.simpleicons.org/${s.slug}/f4f0e8`}
                  width="18"
                  height="18"
                  alt=""
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.FooterCTA = FooterCTA;
