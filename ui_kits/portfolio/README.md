# Luong Huynh — Portfolio UI Kit

A hi-fi recreation of the three pages of `luonghuynh.com`:

- **Homepage** — hero, selected works, capabilities, about teaser, contact CTA
- **Portfolio** — filterable grid (13 projects, 8 category filters)
- **About** — bio + services (rebranded to Digital Artist / 3D / AI / VFX)

The kit is a single `index.html` driven by `app.jsx` and a set of small JSX components. Click between pages with the header navigation; click filter pills to filter the portfolio grid. Click a work card to open a placeholder project sheet.

## Files

| File | Purpose |
|---|---|
| `index.html` | Loads React + Babel and mounts the app |
| `app.jsx` | Page router + page composition |
| `Header.jsx` | Sticky header — logo, nav, Available CTA |
| `Hero.jsx` | Homepage hero — large name slab + lead |
| `WorkCard.jsx` | Single project card (4:5 media + title + tags) |
| `WorkGrid.jsx` | Selected Works (3-up) and Portfolio (3-up grid) |
| `CapabilitiesGrid.jsx` | 4-up hairline grid |
| `AboutTeaser.jsx` | Homepage about teaser block |
| `FooterCTA.jsx` | Big "Available for Work" closer + socials |
| `FilterRow.jsx` | Portfolio category pill filter |
| `AboutServices.jsx` | About-page services list (replaces "Fullstack Developer" cards) |
| `data.js` | Project list, categories, capabilities (real content) |

## What's cut

- Real project case-study pages (only a sticky overlay "sheet" placeholder)
- Server-side filter logic (filters work entirely client-side, in-memory)
- Real photography (project thumbs are placeholder SVGs in `assets/work/`)

## How it mirrors the source

- Class naming and CSS variables exactly match `_source/luong-portfolio.css` (`lh-` prefix, `--lh-*` tokens). The rendered DOM is structurally close to what Elementor would output — the CSS file translates 1:1 to the production site.
- Content (project names, categories, capability titles, hero copy) is verbatim from `_source/DESIGN.md` and `_source/site-audit.md`.
