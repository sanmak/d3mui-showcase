# D3.js & MUI5 Visualization Gallery

<div align="center">

[![GitHub License](https://img.shields.io/github/license/sanmak/d3mui-showcase)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/sanmak/d3mui-showcase)](https://github.com/sanmak/d3mui-showcase)
[![CI](https://github.com/sanmak/d3mui-showcase/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sanmak/d3mui-showcase/actions/workflows/ci.yml)
[![CodeQL](https://github.com/sanmak/d3mui-showcase/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/sanmak/d3mui-showcase/security/code-scanning)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen.svg?logo=dependabot)](https://github.com/sanmak/d3mui-showcase/network/updates)

**A comprehensive showcase of 60 interactive data visualizations built with D3.js, Material-UI 5, Next.js 16, React 19, and TypeScript.**

[Live Demo](https://sanmak.github.io/d3mui-showcase) | [Getting Started](#getting-started) | [Visualizations](#available-visualizations) | [Contributing](#contributing)

</div>

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Available Visualizations](#available-visualizations)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Statistical Charts (25)**: Bar, Line, Area, Scatter, Pie, Donut, Radar, Heatmap, Histogram, Box Plot, Violin Plot, Bubble, Waterfall, Funnel, Calendar Heatmap, Lollipop, Candlestick/OHLC, Streamgraph, Parallel Coordinates, Hexbin, Ridgeline, Horizon, Bump, Radar Small Multiples, and Hybrid SVG+Canvas Scatter
- **Chart Variants (6)**: Grouped Bar, Stacked Bar, Stacked Area, Waffle, Sparklines, Small Multiples Grid
- **Business Charts (6)**: Gantt, Bullet, Slope, Beeswarm Plot, Arc Diagram, Marimekko
- **Hierarchical Visualizations (7)**: TreeMap, Sunburst, Circle Packing, Icicle, Tree Diagram, Dendrogram, Radial Tree
- **Network & Flow Diagrams (6)**: Chord Diagram, Force-Directed Graph, Sankey, Alluvial, Adjacency Matrix, Arc Diagram
- **Geospatial & Advanced (10)**: Choropleth, Proportional Symbol, Dot Density, Cartogram, Flow Map, Venn Diagram, Contour Plot, Polar Area, Population Pyramid, Timeline, Voronoi
- **Interactive Elements**: Hover tooltips, smooth animations, and transitions
- **Modern Stack**: Next.js 16 with App Router, TypeScript, and Material-UI 5
- **Responsive Design**: Mobile-friendly layouts with MUI Grid system
- **Type-Safe**: Full TypeScript support throughout the project

## Getting Started

View the [live demo](https://sanmak.github.io/d3mui-showcase) or run locally:

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sanmak/d3mui-showcase.git
cd d3mui-showcase
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build (static export)
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Available Visualizations

### Statistical Charts

- **Bar Chart**: Compare categorical data with animated vertical bars
- **Line Chart**: Display time-series data with smooth curves
- **Area Chart**: Stacked area chart for multiple data series
- **Scatter Plot**: Visualize correlations with color-coded categories
- **Pie Chart**: Show proportions with interactive slices
- **Donut Chart**: Pie chart variant with hollow center
- **Radar Chart**: Compare multiple variables on circular grid
- **Heatmap**: Visualize data density with color-coded cells
- **Histogram**: Analyze distribution using value bins
- **Box Plot**: Show quartiles, whiskers, and outliers
- **Violin Plot**: Compare category distributions with density shapes
- **Bubble Chart**: Encode a third variable by bubble size
- **Waterfall Chart**: Track cumulative positive/negative deltas
- **Funnel Chart**: Visualize stage conversion drop-offs
- **Calendar Heatmap**: Show day-by-day intensity in a weekly grid
- **Lollipop Chart**: Compare ranked categories with stems and dots
- **Candlestick/OHLC**: Display open-high-low-close movement over time
- **Streamgraph**: Show flowing stacked composition through time
- **Parallel Coordinates**: Compare multivariate records across dimensions
- **Hexbin Plot**: Aggregate dense scatter distributions into hexagonal bins
- **Ridgeline Chart**: Compare multiple distributions in stacked ridges
- **Horizon Chart**: Compact layered positive/negative time-series view
- **Bump Chart**: Visualize rank movement over time
- **Radar Small Multiples**: Compare radar profiles across many entities
- **Hybrid SVG+Canvas Scatter**: Render large scatter sets efficiently with canvas points + SVG axes

### Chart Variants & Extensions

- **Grouped Bar Chart**: Side-by-side bars comparing multiple series
- **Stacked Bar Chart**: Bars with segments showing composition
- **Stacked Area Chart**: Cumulative area trends over time
- **Waffle Chart**: Grid of squares for percentage visualization
- **Sparklines**: Tiny inline charts (line/bar/area) for compact trends
- **Small Multiples Grid**: Trellis display of multiple small charts

### Business & Specialized Charts

- **Gantt Chart**: Project timeline with task durations and progress
- **Bullet Chart**: KPI performance gauge with qualitative ranges
- **Slope Chart**: Before/after comparison showing changes
- **Beeswarm Plot**: Force-simulated scatter with no overlaps
- **Arc Diagram**: Linear network with curved connection arcs
- **Marimekko Chart**: 2D market share with variable widths

### Hierarchical Visualizations

- **TreeMap**: Nested rectangles representing hierarchical data
- **Sunburst Chart**: Radial hierarchy visualization
- **Circle Packing**: Nested circles for hierarchical partitions
- **Icicle Chart**: Layered partition bars for hierarchy depth
- **Tree Diagram**: Classic tree layout with parent-child relationships
- **Dendrogram**: Clustered hierarchy view emphasizing branch structure
- **Radial Tree**: Circular hierarchical layout with radial branches

### Network & Flow

- **Chord Diagram**: Circular links showing relationship strength between categories
- **Force-Directed Graph**: Interactive network with draggable nodes
- **Sankey Diagram**: Flow diagram showing magnitude of connections
- **Alluvial Chart**: Visualize transitions across sequential stages
- **Network Adjacency Matrix**: Matrix-based network intensity representation

### Geospatial Visualizations

- **Choropleth Map**: Encode regional values using color intensity
- **Proportional Symbol Map**: Use circle size for regional magnitude
- **Dot Density Map**: Show population concentration with sampled dots
- **Cartogram Map**: Distort area by metric value for emphasis
- **Flow Map**: Geographic movement visualization with curved flows

### Advanced & Specialized

- **Venn Diagram**: Set relationships with overlapping circles
- **Contour Plot**: Isolines showing elevation/density patterns
- **Polar Area Chart**: Radial chart with varying radii (Coxcomb)
- **Population Pyramid**: Back-to-back demographic bars by age/gender
- **Timeline Chart**: Event timeline with markers and labels
- **Voronoi Diagram**: Nearest-neighbor spatial partitioning

## Project Structure

```
d3mui-showcase/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── ThemeRegistry.tsx   # Client-side MUI theme wrapper
│   ├── page.tsx            # Main page orchestrating all visualizations
│   └── globals.css         # Global styles
├── components/             # 60 visualization components
├── utils/
│   ├── theme.ts            # MUI theme configuration
│   └── mockData.ts         # TypeScript interfaces & data generators
├── .github/
│   ├── workflows/          # CI, GitHub Pages, CodeQL
│   └── dependabot.yml      # Automated dependency updates
└── package.json
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development (strict mode)
- **D3.js 7**: Data visualization library
- **Material-UI 5**: React component library
- **Emotion**: CSS-in-JS styling
- **d3-sankey**: Sankey diagram plugin for D3
- **d3-hexbin**: Hexagonal binning plugin for D3

## Customization

### Adding New Visualizations

1. Create a new component in `components/` following the D3 lifecycle pattern
2. Add TypeScript interface and mock data generator in `utils/mockData.ts`
3. Import and register in `app/page.tsx`
4. Update this README and `VISUALIZATIONS.md`

### Modifying Theme

Edit `utils/theme.ts` to customize colors, typography, and component styles.

### Data Sources

Currently uses mock data. To integrate real data:

1. Replace mock data generators in `utils/mockData.ts`
2. Add API calls or database connections
3. Update component props with real data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Contributions are welcome! Please read the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) before submitting changes.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [D3.js](https://d3js.org/) community for excellent documentation
- [Material-UI](https://mui.com/) team for beautiful React components
- [Next.js](https://nextjs.org/) team for the amazing framework
