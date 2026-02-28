# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page D3.js visualization gallery built with Next.js 16 App Router, React 19, TypeScript (strict), D3.js 7, and MUI 5. Contains ~60 interactive chart components with no backend — all data is local mock data.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Dev server on localhost:3000
npm run build      # Production build (static export to out/)
npm run lint       # ESLint (flat config, eslint.config.mjs)
npm run type-check # TypeScript type checking
npm run format     # Format code with Prettier
npm run format:check # Check formatting without writing
```

There is no test suite. Quality is validated via `npm run lint` + `npm run type-check` + `npm run build` + manual browser check.

## Repository

- **Homepage**: https://sanmak.github.io/d3mui-showcase
- **GitHub**: https://github.com/sanmak/d3mui-showcase
- Conventional commits enforced via commitlint (feat, fix, docs, style, refactor, chore, ci)
- Pre-commit hooks: lint-staged (ESLint + Prettier)

## Architecture

- **app/layout.tsx** — Server component. Root layout with metadata.
- **app/ThemeRegistry.tsx** — Client component. Wraps MUI ThemeProvider + CssBaseline. Keep `createTheme()` out of server components.
- **app/page.tsx** — Client component (~800 lines). Orchestration layer: imports all chart components, generates mock data via `useState`, renders charts through a `sections` metadata array into `ChartCard` wrappers.
- **components/** — ~60 self-contained visualization components (all client components).
- **utils/mockData.ts** — TypeScript interfaces + seeded data generator functions for all chart types.
- **utils/theme.ts** — MUI theme configuration (light mode, primary #1976d2).

**Data flow:** `utils/mockData.ts` generators → `app/page.tsx` state → component props (one-way).

## Component Conventions

Every visualization component follows this pattern:

1. `'use client'` directive
2. Accept `data`, `width`, `height` props with sensible defaults
3. Maintain an element ref (`svgRef`, sometimes canvas refs)
4. Inside `useEffect`: guard for missing ref/data, clear previous render with `d3.select(ref).selectAll('*').remove()`, rebuild chart imperatively with D3
5. Cleanup tooltips (appended to `body`) in effect cleanup return
6. Export as default function component

D3 interop uses targeted `as any` casts for hierarchy/layout nodes (TreeMap, Sunburst, Sankey, CirclePacking). Do not refactor these away unless you verify type-safe replacements.

## Adding a New Visualization

1. Add TypeScript interface + data generator in `utils/mockData.ts`
2. Create component in `components/` following the D3 lifecycle pattern above
3. Register in `app/page.tsx`: import component, add state/init, add `sections[].charts[]` entry
4. Update `README.md` and `VISUALIZATIONS.md` counts/lists

## Key Constraints

- MUI is v5 (not v7) — Grid uses v5 `container`/`item` API
- Path alias `@/*` maps to project root (tsconfig.json)
- D3 plugins: `d3-sankey` and `d3-hexbin` are separate packages
- TypeScript strict mode is enabled
