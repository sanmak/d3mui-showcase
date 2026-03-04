# Requirements: Chart Heading Shareable Links

## Overview

Add shareable anchor links to every chart heading across all ~60 visualizations in the D3.js & MUI5 Visualization Gallery. Users should be able to share a direct link to any specific chart, enabling deep linking and bookmarkable navigation.

## Problem Statement

Currently, all 60 chart visualizations are rendered on a single page with no way to link directly to a specific chart. Users who want to share a particular visualization (e.g., "check out this Sankey Diagram") must share the full page URL and tell the recipient to scroll down manually. This creates a poor sharing experience and limits discoverability.

## User Stories

### US-1: Share a chart via link icon
**As a** user viewing a specific chart,
**I want to** click a link/share icon next to the chart heading,
**So that** I can copy a shareable URL that points directly to that chart.

**Acceptance Criteria:**
- A link icon (e.g., MUI `Link` or `Tag` icon) appears next to every chart title
- The icon is subtle/muted by default and becomes visible on hover over the heading area
- Clicking the icon copies the full URL (with hash fragment) to clipboard
- A brief visual confirmation (snackbar/tooltip) confirms the link was copied
- The URL format is: `<base-url>#<chart-slug>` (e.g., `https://sanmak.github.io/d3mui-showcase#bar-chart`)

### US-2: Click heading to navigate/copy
**As a** user viewing a specific chart,
**I want to** click the chart heading text itself,
**So that** the URL updates in the browser address bar with the chart's anchor.

**Acceptance Criteria:**
- Clicking the chart title updates the browser URL hash without a full page reload
- The heading text shows a pointer cursor on hover to indicate it's clickable
- Heading text remains visually consistent with current design (no underline by default)

### US-3: Open a shared link and auto-scroll
**As a** user who received a shared chart link,
**I want to** open the URL and be automatically scrolled to the specific chart,
**So that** I can see the chart immediately without manually searching.

**Acceptance Criteria:**
- On page load, if a hash fragment is present in the URL, the page scrolls to the corresponding chart
- Scrolling uses smooth behavior with a small offset to account for the sticky AppBar
- The target chart is briefly highlighted (e.g., subtle border pulse or background flash) to draw attention
- If the hash doesn't match any chart, the page loads normally at the top (no error)

### US-4: Section-level deep linking
**As a** user browsing the gallery,
**I want to** also link to entire sections (e.g., "Hierarchical Visualizations"),
**So that** I can share a category of charts, not just individual ones.

**Acceptance Criteria:**
- Section headings (h4) also get anchor IDs and link icons
- Section slugs follow the same pattern (e.g., `#statistical-charts`)
- Both section and chart anchors coexist without collision

## Functional Requirements

### FR-1: Slug Generation
- Generate URL-safe slugs from chart/section titles
- Algorithm: lowercase, replace spaces with hyphens, remove special characters (parentheses, slashes, etc.)
- Examples:
  - "Bar Chart" → `bar-chart`
  - "Candlestick Chart (OHLC)" → `candlestick-chart-ohlc`
  - "Force-Directed Graph" → `force-directed-graph`
  - "Hybrid SVG+Canvas Large Scatter" → `hybrid-svgcanvas-large-scatter`
  - "Statistical Charts" (section) → `statistical-charts`
- Slugs must be unique across all charts and sections

### FR-2: Anchor Elements
- Each chart card must have an `id` attribute matching its slug
- Each section heading must have an `id` attribute matching its slug
- IDs must be set on a wrapper element positioned so scrolling accounts for the fixed AppBar offset

### FR-3: Copy-to-Clipboard
- Use the Clipboard API (`navigator.clipboard.writeText()`)
- Construct the full URL: `window.location.origin + window.location.pathname + '#' + slug`
- Show a MUI `Snackbar` with auto-hide (2-3 seconds) confirming "Link copied to clipboard"

### FR-4: Scroll on Load
- On initial mount, check `window.location.hash`
- If a matching element ID exists, scroll to it with `scrollIntoView({ behavior: 'smooth' })`
- Apply an offset for the AppBar height (~64px)
- Add a brief highlight animation to the target chart card

### FR-5: URL Update on Click
- When a heading is clicked, update the URL hash using `window.history.replaceState()` or `window.location.hash`
- Do not trigger a full page reload

## Non-Functional Requirements

### NFR-1: Performance
- No additional network requests; all logic is client-side
- Slug generation should be computed once (memoized or static)
- No impact on initial page load time beyond minimal JS

### NFR-2: Accessibility
- Link icons must have `aria-label="Copy link to <chart name>"`
- Anchor elements should not break screen reader navigation
- Heading hierarchy (h2 for sections, h6 for charts) remains unchanged
- Focus management: after clicking link icon, focus should remain on or near the heading

### NFR-3: Responsiveness
- Link icons should be appropriately sized on mobile (touch-friendly, min 44x44px tap target)
- On small screens, the icon can be always visible (no hover-to-reveal)

### NFR-4: Browser Compatibility
- Clipboard API fallback: if `navigator.clipboard` is unavailable, fall back to `document.execCommand('copy')`
- `scrollIntoView` with smooth behavior is widely supported; no polyfill needed

## Out of Scope

- Table of contents / navigation sidebar (future enhancement)
- Search functionality for charts
- Individual chart pages / routes (this is a single-page gallery)
- Analytics tracking for shared links
- Social media sharing buttons (Open Graph / Twitter cards)

## Chart Inventory (60 charts, 5 sections)

### Statistical Charts (26 charts)
Bar Chart, Line Chart, Area Chart, Scatter Plot, Pie Chart, Donut Chart, Radar Chart, Heatmap, Histogram, Box Plot, Violin Plot, Bubble Chart, Waterfall Chart, Funnel Chart, Calendar Heatmap, Lollipop Chart, Candlestick Chart (OHLC), Streamgraph, Parallel Coordinates, Chord Diagram, Hexbin Plot, Ridgeline Chart, Horizon Chart, Bump Chart, Radar Small Multiples, Hybrid SVG+Canvas Large Scatter

### Hierarchical Visualizations (6 charts)
TreeMap, Sunburst Chart, Circle Packing, Icicle Chart, Tree Diagram, Dendrogram

### Network & Flow Visualizations (4 charts)
Force-Directed Graph, Sankey Diagram, Alluvial Chart, Network Adjacency Matrix

### Geospatial Visualizations (4 charts)
Choropleth Map, Proportional Symbol Map, Dot Density Map, Cartogram

### New Chart Variants & Extensions (20 charts)
Grouped Bar Chart, Stacked Bar Chart, Stacked Area Chart, Waffle Chart, Sparklines, Small Multiples Grid, Gantt Chart, Bullet Chart, Slope Chart, Beeswarm Plot, Arc Diagram, Marimekko Chart, Venn Diagram, Contour Plot, Polar Area Chart, Population Pyramid, Timeline Chart, Flow Map, Voronoi Diagram, Radial Tree
