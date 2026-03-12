# Claude Code Project Instructions

## Overview

Learn AI is an interactive, single-page React application that teaches AI concepts
from neural network basics through the Transformer architecture. The entire app
lives in a single component file (`src/LearnAI.jsx`).

## Tech Stack

- **React 18** with hooks (`useState`, `useEffect`)
- **Vite** for build toolchain
- **GitHub Actions** for CI/CD to GitHub Pages
- No external UI libraries — all styling is inline

## Architecture Rules

- **Single-component app** — all UI logic lives in `src/LearnAI.jsx`. The chapter
  content, navigation, styling, and animations are co-located in one file.
- **No external dependencies beyond React** — no UI frameworks, CSS libraries, or
  animation packages. Everything is built with inline styles and React hooks.
- **Chapter-based structure** — content is organized as an array of chapter objects.
  Each chapter has an `id`, `title`, and `part` number. New chapters should follow
  the existing numbering convention.

## Project Structure

```
learn-ai/
├── index.html              # Vite entry HTML
├── vite.config.js          # Vite config (base path: /learn-ai/)
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.jsx            # React entry point — renders <LearnAI />
│   └── LearnAI.jsx         # The entire app (chapters, UI, navigation)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions: build + deploy to Pages
├── README.md
├── LICENSE
└── CLAUDE.md               # This file
```

## Development

```bash
npm install
npm run dev          # Start dev server at localhost:5173/learn-ai/
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

## Key Design Decisions

- **Inline styles everywhere** — no CSS files or CSS-in-JS libraries. Styles are
  passed as `style={{}}` props directly on elements. This keeps everything in one
  file and avoids build-time CSS processing.
- **Dark theme** — background `#08080d`, light text. All colors are defined as
  constants at the top of the file (the `C` object).
- **Mobile-first** — the layout uses responsive sizing and the viewport meta tag
  is set for mobile devices.
- **Navigation** — Prev/Next chapter buttons fixed at the bottom of the viewport.
  Chapter state is managed via `useState` with URL hash sync.

## Adding Content

To add a new chapter:

1. Add an entry to the `chapters` array at the top of `src/LearnAI.jsx`
2. Create a corresponding component function (e.g., `Ch6_1`)
3. Add the component to the rendering switch in the main `LearnAI` function
4. Follow the existing naming convention: `Ch{part}_{section}`

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Deploys the `dist/` folder to GitHub Pages

No manual deployment steps needed.

## Commit Conventions

- Use imperative mood ("Add chapter", not "Added chapter")
- Keep subject line under 72 characters
