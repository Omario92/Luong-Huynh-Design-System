// WorkCard.jsx — one project card: 4:5 media, title, tags.
function WorkCard({ project, onOpen }) {
  return (
    <a
      className="lh-work-card"
      href="#"
      onClick={(e) => { e.preventDefault(); onOpen(project); }}
      aria-label={project.title}
    >
      <div className="lh-work-media">
        <img src={`../../assets/work/${project.slug}.svg`} alt="" />
      </div>
      <div className="lh-work-info">
        <h3>{project.title}</h3>
        <div className="lh-tag-row">
          {project.tags.map((t) => (
            <span key={t} className="lh-tag">{t}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

// WorkGrid.jsx — grid wrapper, 3-up on desktop.
function WorkGrid({ projects, onOpen }) {
  return (
    <div className="lh-work-grid">
      {projects.map((p) => (
        <WorkCard key={p.slug} project={p} onOpen={onOpen} />
      ))}
    </div>
  );
}

window.WorkCard = WorkCard;
window.WorkGrid = WorkGrid;
