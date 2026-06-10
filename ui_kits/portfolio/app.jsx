// app.jsx — page-level composition + simple in-memory router.
const { useState, useEffect, useMemo } = React;

function HomePage({ onNav, onOpenProject }) {
  const { projects } = window.LH_DATA;
  const featured = projects.filter((p) => p.featured);
  return (
    <main>
      <Hero onNav={onNav} />
      <section className="lh-section" data-screen-label="Selected Works">
        <div className="lh-container">
          <div className="lh-section-header">
            <span className="lh-eyebrow">Selected Works</span>
            <h2 className="lh-section-title">Recent commissions and personal pieces.</h2>
          </div>
          <WorkGrid projects={featured} onOpen={onOpenProject} />
          <div className="lh-section-foot">
            <a
              href="#"
              className="lh-button lh-button-secondary"
              onClick={(e) => { e.preventDefault(); onNav("portfolio"); }}
            >
              See full portfolio
            </a>
          </div>
        </div>
      </section>
      <CapabilitiesGrid />
      <AboutTeaser onNav={onNav} />
      <FooterCTA />
    </main>
  );
}

function PortfolioPage({ onOpenProject }) {
  const { projects } = window.LH_DATA;
  const [active, setActive] = useState("All");
  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.tags.includes(active));
  }, [active, projects]);

  return (
    <main>
      <section className="lh-section lh-portfolio-head" data-screen-label="Portfolio header">
        <div className="lh-container">
          <span className="lh-eyebrow">Portfolio · {projects.length} projects</span>
          <h1 className="lh-page-title">Selected work across CGI, AI and VFX.</h1>
          <FilterRow active={active} onChange={setActive} />
        </div>
      </section>
      <section className="lh-section" data-screen-label="Portfolio grid">
        <div className="lh-container">
          <WorkGrid projects={filtered} onOpen={onOpenProject} />
          {filtered.length === 0 && (
            <p className="lh-empty">Nothing in this category yet.</p>
          )}
        </div>
      </section>
      <FooterCTA />
    </main>
  );
}

function AboutPage() {
  const { brand } = window.LH_DATA;
  return (
    <main>
      <section className="lh-section lh-about-hero" data-screen-label="About hero">
        <div className="lh-container">
          <span className="lh-eyebrow">About</span>
          <h1 className="lh-page-title">Digital Artist · 3D · AI · VFX</h1>
          <p className="lh-hero-copy">{brand.aboutBio}</p>
          <div className="lh-meta-row">
            <span>Based in {brand.location}</span>
            <span>{brand.year}</span>
            <span>Available for selected projects</span>
          </div>
        </div>
      </section>
      <section className="lh-section lh-section-muted" data-screen-label="Services">
        <div className="lh-container">
          <div className="lh-section-header">
            <span className="lh-eyebrow">Services</span>
            <h2 className="lh-section-title">How I collaborate.</h2>
          </div>
          <AboutServices />
        </div>
      </section>
      <FooterCTA />
    </main>
  );
}

function ProjectSheet({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;
  return (
    <div className="lh-sheet" onClick={onClose}>
      <div className="lh-sheet-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lh-sheet-close" onClick={onClose} aria-label="Close">×</button>
        <div className="lh-sheet-media">
          <img src={`../../assets/work/${project.slug}.svg`} alt="" />
        </div>
        <div className="lh-sheet-body">
          <span className="lh-eyebrow">Project · {project.year}</span>
          <h2>{project.title}</h2>
          <div className="lh-tag-row">
            {project.tags.map((t) => <span key={t} className="lh-tag">{t}</span>)}
          </div>
          <p className="lh-sheet-note">
            Case study coming soon. Full project sheets, process imagery and credits
            will live here once the production site is rebuilt.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [project, setProject] = useState(null);

  useEffect(() => {
    // scroll to top on page change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <div className="lh-site">
      <Header page={page} onNav={setPage} />
      {page === "home" && <HomePage onNav={setPage} onOpenProject={setProject} />}
      {page === "portfolio" && <PortfolioPage onOpenProject={setProject} />}
      {page === "about" && <AboutPage />}
      <ProjectSheet project={project} onClose={() => setProject(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
