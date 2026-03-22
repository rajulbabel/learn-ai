---
paths:
  - "src/__tests__/**"
  - "src/**/*.test.*"
---

# Test Rules

- **TDD is mandatory** - write/update tests BEFORE writing/updating code. No exceptions.
- **Coverage must not decrease** - current targets: 100% lines, 97.7%+ branches.
- **Test file organization**:
  - config.test.js: Config data integrity
  - lookup.test.js: Every config component exists as exported function
  - components.test.jsx: ErrorBoundary, Box, T, Reveal, SubBtn, Tag
  - nav-persistence.test.js: saveNav/loadNav
  - sections.test.jsx: All chapter functions at every sub level with interaction coverage
- **Run after changes**: `npm run test` then `npx vitest run --coverage`
