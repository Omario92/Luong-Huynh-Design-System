// Header.jsx — sticky header with logo, nav, optional CTA.
function Header({ page, onNav }) {
  const { brand, nav } = window.LH_DATA;
  return (
    <header className="lh-header" data-screen-label="Header">
      <div className="lh-container lh-header-inner">
        <a
          className="lh-logo"
          href="#"
          onClick={(e) => { e.preventDefault(); onNav("home"); }}
        >
          {brand.name}
        </a>
        <nav className="lh-nav">
          {nav.map((n) => (
            <a
              key={n.id}
              href="#"
              className={"lh-nav-link" + (page === n.id ? " is-active" : "")}
              onClick={(e) => { e.preventDefault(); onNav(n.id); }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a className="lh-availability" href="#">
          <span className="lh-availability-dot" />
          Available for Work
        </a>
      </div>
    </header>
  );
}

window.Header = Header;
