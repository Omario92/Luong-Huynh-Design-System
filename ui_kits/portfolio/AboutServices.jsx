// AboutServices.jsx — the four services list (replaces "Fullstack Developer" cards).
function AboutServices() {
  const { capabilities } = window.LH_DATA;
  return (
    <div className="lh-services-grid">
      {capabilities.map((c) => (
        <div key={c.n} className="lh-service-card">
          <div className="lh-service-head">
            <span className="lh-service-num mono">{c.n}</span>
            <h3>{c.title}</h3>
          </div>
          <p>{c.blurb}</p>
        </div>
      ))}
    </div>
  );
}

window.AboutServices = AboutServices;
