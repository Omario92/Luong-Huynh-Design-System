// CapabilitiesGrid.jsx — the 4-up hairline grid on the homepage.
function CapabilitiesGrid() {
  const { capabilities } = window.LH_DATA;
  return (
    <section className="lh-section lh-section-muted" data-screen-label="Capabilities">
      <div className="lh-container">
        <div className="lh-section-header">
          <span className="lh-eyebrow">Capabilities</span>
          <h2 className="lh-section-title">What I work on</h2>
        </div>
        <div className="lh-capabilities">
          {capabilities.map((c) => (
            <div key={c.n} className="lh-capability-card">
              <span className="lh-capability-num mono">{c.n}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.CapabilitiesGrid = CapabilitiesGrid;
