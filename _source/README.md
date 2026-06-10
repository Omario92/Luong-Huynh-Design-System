# Luong Huynh Portfolio Redesign Kit — Homepage v2

This kit is aligned to the actual page at `https://luonghuynh.com/index.php/homepage/` and the current WordPress/Elementor site structure.

## Current content audit

### Homepage

Current public structure:

- Brand/navigation: Luong Huynh, Homepage, Portfolio, About
- Hero copy: `Hello! I'm am`, `Luong Huynh`, `Digital Artist specializing in 3D, AI-generated Art, and VFX`
- Metadata: Ho Chi Minh, 2026
- Featured works on homepage:
  - Stride Beyond — AI Generated, Branding
  - Nexora — Branding
  - BT Studio – CGI Beverage Demo — Branding
- Footer CTA: Available for Work, Get in Touch
- Social links: Behance, Dribbble, Instagram, LinkedIn

### Portfolio

Current portfolio filters:

- All
- 3D Model
- AI Generated
- Branding
- CGI
- Feature
- Film
- Key Visuals
- TVC
- Web Design

Current project list:

- TVC Ovaltine 2015 Adaptation
- BT Studio – CGI Huda Football
- Stride Beyond
- Cheers to Victory
- AFC Key Visual
- Twister Pack Visual
- Halida Tet 2022 Key Visual
- Huda Beach Carnival 2023
- Circuit
- Spectral
- Nexora
- Astralis
- BT Studio – CGI Beverage Demo

### About page issue

The About page currently has a mismatch: the heading says `Fullstack Developer`, while the body says 3D visuals, AI-generated images and VFX. The service cards also mention web-development services such as Responsive Design, eCommerce, Maintenance and Development. For this portfolio, these should be replaced with Digital Artist / VFX / CGI services.

Recommended replacement service cards:

1. 3D Product & CGI Visuals
2. AI-generated Campaign Imagery
3. VFX, Compositing & Post-production
4. Visual Direction for Brand Campaigns

## Redesign direction

Recommended direction: **Cinematic Digital Artist Portfolio**.

Why this fits:

- The current positioning is not a web developer portfolio; it is a visual-art portfolio for 3D, AI art and VFX.
- The work is image/video-heavy, so the layout should prioritize media over text.
- The site should feel like a premium visual studio: dark, minimal, cinematic, high contrast, large typography, strong image reveal.

## Suggested site architecture

### 1. Homepage

Purpose: fast positioning + best works.

Sections:

1. Header
2. Cinematic hero
3. Selected Works
4. Capabilities strip
5. Featured project spotlight
6. About teaser
7. Contact CTA

Suggested hero copy:

```txt
Luong Huynh
Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories.
Ho Chi Minh City · Available for selected projects in 2026
```

### 2. Portfolio

Purpose: full project archive.

Use the current filter taxonomy but clean labels:

- All
- CGI
- 3D Product
- AI Generated
- Key Visuals
- TVC / Film
- Branding
- Web Design

Each card should contain:

- Project image/video thumbnail
- Project title
- Category tags
- Short one-line context
- Optional year/client

### 3. About

Purpose: credibility and service clarity.

Replace generic web-development copy with:

```txt
I’m a digital artist focused on 3D visuals, AI-generated images and VFX. I collaborate with brands, agencies and production teams to create campaign-ready visuals, cinematic key visuals and experimental AI-assisted imagery.
```

## Elementor implementation strategy

Use Elementor visual controls for layout, spacing and responsive behavior. Use the CSS file in this kit only for global look, reusable classes and effects.

Add CSS here:

- Elementor Pro: Site Settings → Custom CSS
- Elementor Free: Appearance → Customize → Additional CSS, child theme `style.css`, or a custom CSS plugin

Use these class names in Elementor Advanced → CSS Classes. Do not include the dot when entering classes.

Core classes:

- `lh-site`
- `lh-section`
- `lh-section-dark`
- `lh-section-muted`
- `lh-container`
- `lh-eyebrow`
- `lh-hero`
- `lh-hero-title`
- `lh-hero-copy`
- `lh-meta-row`
- `lh-work-grid`
- `lh-work-card`
- `lh-work-media`
- `lh-work-info`
- `lh-tag-row`
- `lh-tag`
- `lh-button`
- `lh-button-secondary`
- `lh-capabilities`
- `lh-capability-card`
- `lh-footer-cta`

## How to use with Claude Design

1. Upload `DESIGN.md` to Claude Design.
2. Upload screenshots or exported images from the existing homepage, portfolio and about pages.
3. Use `prompts/claude-design-homepage.md` to generate the first design direction.
4. Ask Claude Design to generate 3 directions, then choose one.
5. Use `prompts/elementor-handoff.md` to convert the selected design into Elementor sections, classes and CSS.
6. Paste `css/luong-portfolio.css` into Elementor global CSS.
7. Build the layout using Elementor Containers and apply the class names above.

## Files

- `SKILL.md` — reusable Claude Skill instructions for this portfolio redesign workflow
- `DESIGN.md` — design-system source of truth for Claude Design
- `css/luong-portfolio.css` — Elementor-friendly CSS stylesheet
- `prompts/claude-design-homepage.md` — design prompt for Claude Design
- `prompts/elementor-handoff.md` — prompt to convert design into Elementor implementation specs
- `elementor/class-map.md` — class mapping for each section/widget
- `references/current-site-audit.md` — audit based on the current site pages
