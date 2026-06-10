# DESIGN.md — Luong Huynh Portfolio

## Brand essence

Luong Huynh is a Digital Artist specializing in 3D visuals, AI-generated imagery and VFX.

The website should feel like a cinematic visual archive: premium, dark, immersive, image-led and technically refined.

## Primary direction

**Cinematic Digital Artist Portfolio**

Keywords:

- cinematic
- digital craft
- 3D / CGI
- AI-generated imagery
- VFX
- premium black room
- editorial gallery
- brand campaign visuals
- motion-ready

## Tone

Confident, modern, precise, visual-first. Avoid generic agency language. Avoid overly playful startup aesthetics.

## Color tokens

```css
:root {
  --lh-bg: #070707;
  --lh-bg-soft: #101010;
  --lh-panel: #151515;
  --lh-panel-2: #1c1c1c;
  --lh-text: #f4f0e8;
  --lh-muted: #9b978f;
  --lh-line: rgba(244, 240, 232, 0.14);
  --lh-accent: #d7ff3f;
  --lh-accent-warm: #ffb84d;
}
```

## Typography

Use a strong modern sans-serif system. If custom fonts are available, use:

- Display: Neue Haas Grotesk / Satoshi / Inter Tight / Space Grotesk
- Body: Inter / Satoshi / system-ui

Fallback:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Type behavior:

- Hero title should be very large, preferably 80–140px desktop.
- Body copy should stay calm and readable.
- Use uppercase micro-labels for categories and metadata.

## Layout principles

- Max-width: 1440px
- Content width: 88–92vw
- Use 12-column grid on desktop.
- Use stacked single-column layout on mobile.
- Keep section rhythm spacious: 96–160px desktop vertical spacing.
- Let images breathe.

## Components

### Header

Minimal sticky or static header. Keep it quiet.

Items:

- Luong Huynh
- Homepage
- Portfolio
- About
- Optional CTA: Available for Work

### Hero

Hero should immediately communicate:

- name
- discipline
- location/year
- strongest visual

Suggested copy:

```txt
Luong Huynh
Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories.
Ho Chi Minh City · 2026
```

### Project cards

Project cards are media-first.

States:

- Default: image/video thumbnail, subtle border, title and tags below
- Hover: image scales slightly, contrast lifts, cursor feels premium

Card content:

- Thumbnail
- Title
- Tags
- Optional one-line description

### Tags

Small uppercase pills with border.

Examples:

- AI Generated
- Branding
- CGI
- 3D Model
- Key Visuals
- TVC

### CTA

Simple, editorial CTA. Avoid loud gradients.

Recommended CTAs:

- View Portfolio
- Get in Touch
- Available for Work

## Motion

Use restrained motion only:

- fade-up reveal
- image scale on hover
- slow marquee only if useful
- no excessive parallax

Respect reduced motion.

## Elementor class strategy

Use these classes consistently:

```txt
lh-site
lh-section
lh-section-dark
lh-section-muted
lh-container
lh-eyebrow
lh-hero
lh-hero-title
lh-hero-copy
lh-meta-row
lh-work-grid
lh-work-card
lh-work-media
lh-work-info
lh-tag-row
lh-tag
lh-button
lh-button-secondary
lh-capabilities
lh-capability-card
lh-footer-cta
```

## Do not do

- Do not keep the About heading as `Fullstack Developer` unless the site intentionally pivots to web development.
- Do not use generic service cards like eCommerce or Maintenance for this visual-artist portfolio.
- Do not overload the homepage with too many projects.
- Do not make decorative effects compete with the portfolio images.
- Do not rely on unstable Elementor IDs in CSS.
