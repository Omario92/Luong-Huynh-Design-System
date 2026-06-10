# Luong Huynh Design System

A design system for **Luong Huynh** — a Digital Artist based in Ho Chi Minh City specializing in **3D visuals, AI-generated imagery and VFX**. The current home is the WordPress / Elementor site at `https://luonghuynh.com`.

The system is built for **Cinematic Digital Artist Portfolio** — a premium, dark, image-led visual studio aesthetic. It is designed to be useful in two modes:

1. **Production handoff** — output specs that translate cleanly into Elementor (uses the `lh-` class prefix and the global stylesheet in `_source/luong-portfolio.css`).
2. **Throwaway prototypes / decks / mocks** — drop in `colors_and_type.css` and reuse the JSX components in `ui_kits/portfolio/` to get a brand-true look fast.

---

## Sources used

This system was assembled from the following inputs:

- **Codebase / kit:** the redesign workspace `luong-portfolio-homepage-v2` (mirrored into `_source/` for reference). Contains the source-of-truth `DESIGN.md`, the Elementor-ready stylesheet, a current-site audit, and handoff prompts.
- **GitHub repo:** [Omario92/LH-Portfolio-Website](https://github.com/Omario92/LH-Portfolio-Website) — flagged on the project but **could not be browsed** (the API returned an empty-repo response). If the repo gets seeded with real source later, re-import to lift exact component code, real project thumbnails, and any custom fonts.
- **Live site reference:** `https://luonghuynh.com/index.php/homepage/` — used for the content audit, project list, and current navigation labels.

> **If you can read this and have richer source** (real Figma file, the actual built theme, photography of finished projects), please attach it — much of the *visual* fidelity of this system currently relies on placeholders because the underlying repo is empty.

---

## Index

```
README.md                  ← you are here
SKILL.md                   ← cross-compatible skill manifest
colors_and_type.css        ← all design tokens (base + semantic)

fonts/
  NewakeFont-Demo.otf      ← brand display font (uppercase-only demo)

assets/
  logo-wordmark.svg        ← "Luong Huynh" wordmark (light on dark)
  logo-wordmark-dark.svg   ← wordmark inverted (dark on light)
  monogram.svg             ← "LH" monogram in a black tile w/ acid-lime mark
  placeholder-*.svg        ← project-thumb placeholders (4:5 ratio)

preview/                   ← cards rendered in the Design System tab
  type-*.html
  colors-*.html
  spacing-*.html
  components-*.html
  brand-*.html

ui_kits/
  portfolio/
    README.md
    index.html             ← interactive multi-screen prototype
    *.jsx                  ← individual components

_source/                   ← read-only copies of original kit files
  DESIGN.md
  luong-portfolio.css
  SKILL.md
  site-audit.md
  README.md
```

---

## Products represented

There is **one product**: the **marketing portfolio site** (WordPress + Elementor).

It has three pages today:

| Page | Purpose | Notes |
|---|---|---|
| **Homepage** | Positioning + best work | Hero → Selected Works (3) → Capabilities (4) → About teaser → Contact CTA |
| **Portfolio** | Full filterable archive | 13 projects across CGI, AI Generated, 3D Model, Key Visuals, TVC, Branding, Web Design |
| **About** | Credibility + services | Currently mis-labeled "Fullstack Developer" — the rebrand replaces it with Digital Artist / 3D / AI / VFX |

A single UI kit (`ui_kits/portfolio/`) covers all three.

---

## Content fundamentals

### Voice & tone

**Confident, modern, precise, visual-first.** Speak like a working studio that does not need to oversell — let the work do the talking. Avoid agency clichés, startup playfulness, and "developer-energy" copy (no `< />`, no `console.log`, no emoji).

### Pronoun & person

- **First person** in About copy: *"I'm a digital artist focused on..."*, *"I collaborate with brands..."*
- **Third person / proper noun** in nav and hero ("Luong Huynh").
- **Direct second person** for CTAs: *"Get in Touch"*, *"View Portfolio"*.

### Casing

- **Title Case** for nav, buttons, capability headers, page titles.
- **UPPERCASE + wide tracking** for eyebrows, tags, metadata strips, and filter pills. Tracking is heavy — `0.12em–0.16em`.
- **Sentence case** for body copy and project descriptions.

### Punctuation rhythm

- **Middle dot `·`** separates metadata: *"Ho Chi Minh City · 2026"*, *"AI Generated · Branding"*.
- **Em dash `—`** for project + category: *"Stride Beyond — AI Generated, Branding"*.
- **En dash `–`** inside project titles when the brand uses it: *"BT Studio – CGI Beverage Demo"*.
- Capability lists use plain ampersand-free phrasing: *"3D Product & CGI Visuals"*, *"VFX, Compositing & Post-production"*.

### Length

- Hero subtitle ≤ 22 words, single sentence.
- Capability card titles ≤ 6 words.
- Project descriptions (when present) are **one line**.
- About copy stays under 60 words on the homepage teaser.

### Tone examples (verbatim from the kit)

- > *"Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories."*
- > *"I'm a digital artist focused on 3D visuals, AI-generated images and VFX. I collaborate with brands, agencies and production teams to create campaign-ready visuals, cinematic key visuals and experimental AI-assisted imagery."*
- > *"Ho Chi Minh City · 2026"*
- > *"Available for selected projects in 2026"*

### Forbidden phrasing (per `_source/DESIGN.md`)

- "Fullstack Developer" as the About heading.
- Generic web-services copy (Responsive Design, eCommerce, Maintenance, Development).
- "Hello! I'm am" — the current site has a typo here that should be killed on sight.

### Emoji & micro-symbols

- **No emoji.** Anywhere. The brand is editorial / cinematic and emoji would break the register.
- **Middle dot, em dash, bullet `•`** are the only typographic ornaments used — and only the dot survives in body copy.
- No "↗" arrows in CTAs unless paired with a real `<a target="_blank">` external link.

---

## Visual foundations

### Mood

A **cinematic black room**. Imagine a gallery with the lights dimmed: the work is lit, the chrome recedes, the only color in the room is a single acid-lime mark on a label and a faint warm wash where light spills.

### Color

- **Background:** `#070707` (`--lh-bg`) base, `#101010` (`--lh-bg-soft`) for muted sections, `#151515`/`#1c1c1c` for cards (default → hover).
- **Foreground:** `#f4f0e8` warm ivory (not pure white) for headings + body. Muted ivory `#9b978f` for secondary copy and metadata.
- **Lines:** `rgba(244,240,232,0.14)` default, `0.28` on hover/active. **No hard white lines** — borders always step down from the text color.
- **Accent (primary):** `#00f0ff` neon cyan. Used **once per section, max**: primary button, eyebrow tag, single hover edge, faint outer glow. Never as a fill on a large surface.
- **Accent (cool):** `#6366f1` electric indigo. Used inside radial gradient washes, subtle glows, and as an alternate accent on hover/focus states. Never as a button fill.
- **Selection:** neon-cyan on `#070707`.

> The kit's gradient washes are **radial, not linear** — a single 24–34vw circle of accent at 6–14% alpha behind a hero or section, fading to transparent. The cyan adds glow; the indigo deepens the room. No 45° purple-to-blue gradients ever — keep washes radial.

### Type

Display is **Newake** — a tall condensed editorial face used **uppercase only** at large sizes (hero, page titles, section banners, footer CTA). It carries the cinematic / sci-fi movie-title register. Tracking sits in the **+0.10em – +0.15em** range: **+0.10em at the hero, +0.12em at h1, +0.15em at h2** — wide enough to read like a premium movie title without losing word shape.

A second display family — **Inter Tight** at weight 700 — handles **mixed-case display** roles where uppercase would feel shouty: project card titles, capability headers, About-page sentence. Same dark base, different register.

Body is **Inter** at 400/500. **JetBrains Mono** appears in tiny doses for metadata, catalog numbers, and curve labels. See `colors_and_type.css` for the full scale.

Hero type is **massive** — `clamp(64px, 14vw, 200px)`, line-height `0.86`. Body stays calm at 16–18px. Eyebrows are 11–13px Inter with `0.16em` letter-spacing.

### Spacing & layout

- **Max content width:** 1440px.
- **Gutter:** `clamp(20px, 5vw, 72px)` — generous on desktop.
- **Section rhythm:** `clamp(72px, 10vw, 160px)` vertical padding between sections.
- **Grid:** 12-column on desktop, stacked single-column on mobile. Selected works = 3 col, capabilities = 4 col, both collapse to 2 then 1.
- **Inside cards:** `clamp(18px, 2vw, 28px)` padding.

### Backgrounds

- Mostly **flat black** (`#070707`). The page lets project imagery be the only "texture."
- Section variation comes from two radial washes (acid-lime top-right, amber bottom-left) at very low alpha behind the hero and "muted" sections.
- **No repeating patterns.** **No hand-drawn illustrations.** **No grain overlay** by default. **No noise textures.**
- Full-bleed imagery is reserved for featured project spotlights — those should fill the viewport edge-to-edge.

### Corner radii

- Cards: **32px** (`--lh-radius-lg`).
- Media wrappers inside cards: **20px** (`--lh-radius-md`) on the bottom corners, 31px on top (matches outer minus border).
- Small chips / tags / buttons: **pill** (`999px`).
- Inputs: **12px** (`--lh-radius-sm`).

### Borders

- **1px hairlines** at `rgba(244,240,232,0.14)` by default.
- On hover: same line steps to `0.28` alpha. **No color shift**, only alpha.
- Capabilities grid uses a **1px gap** to fake a sharp divider between cells — this is the only time you'll see internal grid lines.

### Shadows

- **No drop shadows on cards.** The dark base means a shadow disappears; depth comes from `border` + `background` lift (`--lh-panel` → `--lh-panel-2`).
- Buttons use a `translateY(-2px)` on hover, again no shadow.
- The only "elevation" effect is a 6px lift on card hover.

### Animation

- **Curve:** `cubic-bezier(.16, 1, .3, 1)` ("ease-out-quint") for almost everything — slow start, fast settle.
- **Durations:** 0.25s for buttons/links, **0.45s for card chrome**, **0.6–0.9s for media scale and filter changes**.
- **Card hover:** card lifts 6px, border alpha bumps, inner image scales to 1.055 with a slight contrast/saturation bump (`filter: contrast(1.08) saturate(1.08)`).
- **Button hover:** translateY -2px, fill swaps from acid-lime to ivory.
- **No bouncing**, no overshoot, no spring physics. Restraint is the personality.
- Reveal: a simple fade-up on scroll. **No parallax.** **No marquees** (unless useful).
- `prefers-reduced-motion: reduce` is respected globally (durations clamp to ~0.01ms).

### Hover / press states

| Element | Hover | Press |
|---|---|---|
| Primary button | fill → ivory, lift 2px | no extra state — keep simple |
| Secondary button | bg becomes `rgba(244,240,232,0.08)`, border → ivory | — |
| Work card | lift 6px, border alpha 0.14 → 0.28, media scale 1.055, filter contrast 1.08 | — |
| Filter pill | fill → acid-lime, text → black | active = same as hover |
| Tag pill | opacity bump only | — |
| Nav link | underline appears (1px ivory) | — |

### Transparency & blur

- **No backdrop-blur** anywhere by default. The dark base is enough separation.
- Transparency is reserved for **line colors** (alpha on ivory), the **gradient washes** (very low alpha accents on the base), and the **dimmed text** state (`rgba(244,240,232,0.82)` on the hero subtitle).
- If a sticky header is added, it can be `rgba(7,7,7,0.85)` with a 1px bottom hairline — no blur.

### Layout rules

- **Sticky header is optional** — the design works either way; if used, keep it quiet (no shadow, hairline border on scroll).
- **Hero alignment is bottom-left** — title and meta anchor to the bottom of the hero area, with content above let breathe.
- **One accent per fold.** Don't repeat the acid-lime across multiple elements visible at once.

### Imagery direction

Project thumbnails should feel **cinematic and color-rich** — saturated, warm, often dark/moody (the kit lives on `#070707`, so high-key imagery pops). Aspect ratio for work cards is **4:5 (portrait)** on desktop, **16:11** on mobile. No black-and-white treatment — color is a feature of the work itself.

---

## Iconography

The brand is **icon-light by design**. There is no proprietary icon font, no Lucide pack, no Heroicons reference in `_source/`. The only "icons" in the existing site are **social glyphs**: Behance, Dribbble, Instagram, LinkedIn.

### Approach

- **Use words over icons** wherever possible. Nav items are plain text. Buttons are plain text.
- **Tags use no icons.** Filter pills use no icons.
- **One typographic mark allowed:** the middle dot `·` for separators.
- **External-link arrow `↗`** can appear at the end of a "Get in Touch" CTA — but optionally.

### When you need a real icon

Pull from **[Lucide](https://lucide.dev/) (CDN)** at stroke-width `1.5`, size `16px` inside text, `20–24px` standalone. Lime accent only on hover (`stroke: var(--lh-accent)`).

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
<i data-lucide="arrow-up-right" style="width:16px;height:16px;stroke-width:1.5"></i>
```

> **Substitution flag:** Lucide is a *standin*. The live site does not currently use it — if a brand-owned icon set exists in Figma or a final theme build, swap it in and update this section.

### Social icons

For Behance / Dribbble / Instagram / LinkedIn, use the **simple-icons** CDN — it has all four as monoline SVGs.

```html
<img src="https://cdn.simpleicons.org/behance/f4f0e8" width="20" height="20" alt="Behance"/>
```

The brand colors of the social platforms are **suppressed** — render them all in `#f4f0e8` ivory so they feel uniform inside the dark room. Hover: opacity 1 → 0.7 OR color → acid-lime.

### Logo / monogram

- **`assets/logo-wordmark.svg`** — primary wordmark in ivory on dark, set in Inter Tight 800 with `-2.4px` tracking. Use everywhere except the favicon.
- **`assets/logo-wordmark-dark.svg`** — inverted version for any light surface (rare).
- **`assets/monogram.svg`** — "LH" inside a black tile with an acid-lime accent mark. Use as the **favicon, app icon, social avatar**.

The wordmark **is the brand**. Do not lock it up with taglines, badges, or other marks.

### No emoji, no unicode-glyph "icons"

Do not substitute symbols (✨ 🎬 🔥 ✦ etc.) for missing icons. If you don't have the icon, **omit it** — most surfaces of this brand work without iconography at all.

---

## Font substitutions (flag for the user)

| Role | DESIGN.md target | This system uses | Notes |
|---|---|---|---|
| Display | Neue Haas Grotesk *or* Satoshi *or* Inter Tight *or* Space Grotesk | **Newake** (brand-owned, `fonts/NewakeFont-Demo.otf`) | Tall, condensed editorial face. The **demo file ships uppercase-only** — display roles (`h1`, `h2`, hero) apply `text-transform: uppercase`. **If a full version with lowercase glyphs is licensed, drop it into `fonts/` and the system continues to work without any other change.** |
| Sub-display | — | **Inter Tight** | Used for *mixed-case* display: project card titles, capability headers, About sentence. Newake's uppercase-only nature makes it wrong for these — Inter Tight at weight 700 with tight tracking carries that role. |
| Body | Inter *or* Satoshi *or* system-ui | **Inter** | Direct match. Google Fonts. |
| Mono accent | (not specified) | **JetBrains Mono** | Used very sparingly for project metadata / catalog numbers. |

> **Newake demo is uppercase-only.** Any heading you write in Title Case will render in caps automatically. If you need a mixed-case display sentence, use `var(--font-display-alt)` (Inter Tight) explicitly — see `.lh-about-bio` for an example.

---

## Working with the production stylesheet

If you're outputting **Elementor handoff specs**, the existing class system in `_source/luong-portfolio.css` is the contract. Highlights:

- All custom classes use the `lh-` prefix.
- Add them in Elementor's **Advanced → CSS Classes** field (no leading dot).
- See `_source/luong-portfolio.css` for the canonical list. The class map is in `_source/` as well.
- **Never target Elementor-generated IDs** — they are unstable across edits.

---

## Caveats

- **No real project imagery** is in this system — the GitHub repo `Omario92/LH-Portfolio-Website` returned empty. Thumbnails in `ui_kits/portfolio/` use placeholder SVG tiles. Drop real renders in `assets/work/` when available.
- **Newake demo is uppercase-only.** Lowercase glyphs fall back to Inter Tight. If a full version of Newake (with lowercase) gets licensed, drop the `.otf`/`.woff2` in `fonts/` overwriting the demo and the rest of the system works unchanged.
- **No real Figma context** was attached, so component behaviors (e.g. exact transitions, breakpoint specifics) reflect the CSS in `_source/` + best-judgment expansion, not a live design file.
- The current live site has known content issues (typo "Hello! I'm am", About mislabeled "Fullstack Developer", generic web-dev service cards). The system **assumes the rebranded content**, not the live content.
