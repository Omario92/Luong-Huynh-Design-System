// Shared content for the portfolio UI kit.
// Verbatim from _source/site-audit.md and _source/DESIGN.md.

window.LH_DATA = {
  brand: {
    name: "Luong Huynh",
    location: "Ho Chi Minh City",
    year: "2026",
    tagline:
      "Digital Artist crafting 3D visuals, AI-generated imagery and VFX for brands, campaigns and cinematic stories.",
    aboutBio:
      "I'm a digital artist focused on 3D visuals, AI-generated images and VFX. I collaborate with brands, agencies and production teams to create campaign-ready visuals, cinematic key visuals and experimental AI-assisted imagery.",
  },

  nav: [
    { id: "home", label: "Homepage" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
  ],

  socials: [
    { label: "Behance",   slug: "behance",   url: "#" },
    { label: "Dribbble",  slug: "dribbble",  url: "#" },
    { label: "Instagram", slug: "instagram", url: "#" },
    { label: "LinkedIn",  slug: "linkedin",  url: "#" },
  ],

  categories: [
    "All",
    "CGI",
    "3D Model",
    "AI Generated",
    "Key Visuals",
    "TVC / Film",
    "Branding",
    "Web Design",
  ],

  capabilities: [
    {
      n: "01",
      title: "3D Product & CGI Visuals",
      blurb: "Photoreal CG product, scene and packshot work for campaigns and launches.",
    },
    {
      n: "02",
      title: "AI-generated Campaign Imagery",
      blurb: "Brand-aligned AI key visuals, mood pieces and concept frames.",
    },
    {
      n: "03",
      title: "VFX, Compositing & Post-production",
      blurb: "Cleanup, compositing and finishing for TVC and short-form film.",
    },
    {
      n: "04",
      title: "Visual Direction for Brand Campaigns",
      blurb: "End-to-end art direction for campaign rollouts and key visuals.",
    },
  ],

  projects: [
    { slug: "stride-beyond",      title: "Stride Beyond",                tags: ["AI Generated", "Branding"],   year: 2025, featured: true },
    { slug: "nexora",             title: "Nexora",                       tags: ["Branding"],                    year: 2025, featured: true },
    { slug: "bt-studio-beverage", title: "BT Studio – CGI Beverage Demo", tags: ["CGI", "Branding"],            year: 2025, featured: true },
    { slug: "tvc-ovaltine",       title: "TVC Ovaltine 2015 Adaptation",  tags: ["TVC / Film"],                 year: 2024 },
    { slug: "huda-football",      title: "BT Studio – CGI Huda Football", tags: ["CGI"],                        year: 2024 },
    { slug: "cheers-victory",     title: "Cheers to Victory",            tags: ["CGI"],                         year: 2024 },
    { slug: "afc-key-visual",     title: "AFC Key Visual",               tags: ["Key Visuals"],                 year: 2024 },
    { slug: "twister-pack",       title: "Twister Pack Visual",          tags: ["3D Model"],                    year: 2023 },
    { slug: "halida-tet-2022",    title: "Halida Tet 2022 Key Visual",   tags: ["Key Visuals"],                 year: 2022 },
    { slug: "huda-carnival",      title: "Huda Beach Carnival 2023",     tags: ["Key Visuals"],                 year: 2023 },
    { slug: "circuit",            title: "Circuit",                       tags: ["AI Generated"],               year: 2024 },
    { slug: "spectral",           title: "Spectral",                      tags: ["AI Generated"],               year: 2024 },
    { slug: "astralis",           title: "Astralis",                      tags: ["AI Generated"],               year: 2025 },
  ],
};
