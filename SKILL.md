---
name: luong-portfolio-design
description: Use this skill to generate well-branded interfaces and assets for the Luong Huynh portfolio brand — a Cinematic Digital Artist portfolio (3D / AI-generated / VFX), based in Ho Chi Minh City. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping and production.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code (the WordPress / Elementor site), copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **Brand essence**: Premium, dark, cinematic visual-artist portfolio. Black room aesthetic with warm ivory text and a sparing acid-lime accent.
- **Positioning**: "Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories."
- **Type**: `Newake` display (uppercase, brand-owned in `fonts/`), `Inter Tight` for mixed-case display, `Inter` body, `JetBrains Mono` for meta accents.
- **Color**: `#070707` bg, `#f4f0e8` text, `#00f0ff` neon-cyan accent (use sparingly, glow + buttons), `#6366f1` electric indigo (cool wash / gradient).
- **Tokens**: see `colors_and_type.css` (base + semantic vars).
- **Components**: see `ui_kits/portfolio/` for hi-fi recreations.
- **Production CSS**: see `_source/luong-portfolio.css` — the Elementor-ready stylesheet using the `lh-` class prefix. If working on the live WordPress site, output specs that map onto these classes.

## Output formats

- For visual artifacts → static HTML files using tokens from `colors_and_type.css` and components copied from `ui_kits/portfolio/`.
- For production handoff → reference `_source/luong-portfolio.css` and `_source/DESIGN.md`; provide Elementor class mappings using the `lh-` prefix.
