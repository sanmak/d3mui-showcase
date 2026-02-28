# Copilot instructions for d3-js-mui5

## Big picture

- This is a single-page visualization gallery built with Next.js App Router + React 19 + TypeScript + D3 + MUI 5.
- The root page [app/page.tsx](app/page.tsx) is the orchestration layer: it imports all chart components, generates mock datasets, and renders charts via a `sections` metadata array.
- There is no backend/API layer; all data is local mock data from [utils/mockData.ts](utils/mockData.ts).

## Architecture and data flow

- Global app shell and metadata live in [app/layout.tsx](app/layout.tsx).
- MUI setup is intentionally isolated to client-side [app/ThemeRegistry.tsx](app/ThemeRegistry.tsx). Keep `createTheme()` usage out of server components.
- Visual components are self-contained under [components/](components/) and are rendered as children of reusable `ChartCard` in [app/page.tsx](app/page.tsx#L210).
- Data flow is one-way: generator functions in [utils/mockData.ts](utils/mockData.ts) -> page-level state in [app/page.tsx](app/page.tsx) -> chart props.

## Component conventions (important)

- Every visualization component is a client component (`'use client'`) and uses D3 imperatively inside `useEffect()`.
- Standard rendering pattern (see [components/BarChart.tsx](components/BarChart.tsx), [components/ScatterPlot.tsx](components/ScatterPlot.tsx)):
  - keep an element ref (`svgRef`, sometimes canvas + svg refs)
  - guard for missing ref/data
  - clear previous render with `d3.select(ref).selectAll('*').remove()`
  - rebuild chart from scratch
  - cleanup transient DOM artifacts (tooltips appended to `body`) in effect cleanup
- Most charts accept `data`, `width`, `height` props with defaults; preserve this API shape when extending components.
- TypeScript is strict ([tsconfig.json](tsconfig.json)), but D3 interop sometimes uses targeted `as any` casts (example: [components/SankeyDiagram.tsx](components/SankeyDiagram.tsx)). Do not refactor these casts away unless you verify type-safe replacements.

## Project-specific workflow

- Install and run: `npm install`, `npm run dev`.
- Quality/build checks: `npm run lint`, `npm run build`.
- There is no dedicated test suite in this repo currently; rely on lint + production build + manual browser validation.

## Adding or changing a visualization

- Add/update generator types + data builders in [utils/mockData.ts](utils/mockData.ts).
- Implement/update component in [components/](components/) following the existing D3 lifecycle pattern.
- Register the chart in [app/page.tsx](app/page.tsx): import component, add state/init if needed, and add a `sections[].charts[]` entry.
- Keep list/documentation synchronized when counts change: [README.md](README.md), [VISUALIZATIONS.md](VISUALIZATIONS.md).

## Dependencies and compatibility constraints

- UI library is MUI v5 (not v7); grid usage follows v5 `container`/`item` API in [app/page.tsx](app/page.tsx#L770).
- Path alias `@/*` is enabled in [tsconfig.json](tsconfig.json#L27).
- Key visualization plugins include `d3-sankey` and `d3-hexbin` from [package.json](package.json).
