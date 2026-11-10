# Product Designer Portfolio Website

A high-quality, editorial product-design portfolio website built with modern web standards (Semantic HTML5, CSS Custom Properties Design System, and ES Modules).

Designed in accordance with **Direction B: Contemporary Product Studio**, emphasizing disciplined layout grids, crisp typography, generous whitespace, large visual presentation frames, and transparent team attribution.

---

## 📁 Project Architecture

```
product-designer-portfolio/
├── index.html                   # Cohesive Homepage (Hero, 3 Selected Projects, Capabilities, About, Contact)
├── serve.py                     # Zero-dependency local preview server (Python 3 standard library)
├── css/
│   ├── tokens.css               # Design tokens (Typography scale, colors, spacing, hairlines, shadows)
│   ├── reset.css                # Baseline reset, box-sizing, a11y focus states, reduced motion
│   ├── components.css           # Sticky nav, buttons, chips, asymmetric cards, footer, placeholders
│   ├── home.css                 # Homepage section layouts (Hero, Work, Approach, About, Contact)
│   └── case-study.css           # Modular case study engine (Metadata matrix, sticky index, attribution split)
├── js/
│   └── main.js                  # Mobile nav drawer, intersection observer, copy-email, smooth scrolling
├── data/
│   └── projects.json            # Maintainable project definitions, roles, verified outcomes, and tags
├── work/
│   ├── yarden-jewelry.html      # Case study: Brand Realignment & Async WhatsApp Client Discovery
│   ├── beresheet-dead-sea.html  # Case study: Value Communication & PDP "Visible Results" Architecture
│   └── foldy-mat.html           # Modular case-study framework staged for upcoming project assets
└── assets/
    └── images/
        ├── yarden-cover.svg     # High-fidelity preview mockup (Dark luxury aesthetic)
        ├── beresheet-cover.svg  # High-fidelity preview mockup (PDP Visible Results module)
        ├── foldymat-cover.svg   # Structural staging preview mockup
        ├── yarden-before-after.svg # Side-by-side comparative analysis diagram
        └── beresheet-pdp-breakdown.svg # PDP drop-off zone vs. proof architecture diagram
```

---

## 🚀 Running Locally

Because this project is built entirely on modern web standards with zero package dependencies, you can preview it immediately using Python:

```bash
# Option 1: Run the dedicated preview runner
python serve.py

# Option 2: Run Python's built-in HTTP server
python -m http.server 3000
```

Open your browser and navigate to:
**`http://localhost:3000`**

---

## 🎨 Visual System & Design Highlights

- **Aesthetic**: Contemporary Product Studio with editorial typographic balance.
- **Color Discipline**: Crisp gallery canvas (`#FAFAFA`), high-contrast obsidian typography (`#0F141A`), and restrained deep cobalt accents (`#1D4ED8`).
- **Typography**: Neo-Grotesque display and body type paired with monospace metadata tags (`JetBrains Mono`).
- **Attribution Guardrails**: Every case study prominently features a dedicated **Attribution Split Card** separating individual design leadership from engineering and platform scope.
- **Evidence Integrity**: Zero fabricated metrics, fake customer personas, or synthetic charts.

---

## 🌐 Deploying to Production

You can deploy this directory to any static hosting service in seconds:

- **GitHub Pages**: Push this repository and enable Pages in repository settings pointing to `/root`.
- **Vercel / Netlify / Cloudflare Pages**: Connect your Git repository or drag-and-drop the `product-designer-portfolio` directory. Zero build command needed. Output directory is `/`.
