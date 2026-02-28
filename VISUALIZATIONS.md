# Visualization Types Guide

This document provides detailed information about each visualization type included in this project.

## Statistical Charts

### 1. Bar Chart

**File**: `components/BarChart.tsx`

**Use Case**: Comparing categorical data, showing discrete values across categories

**Features**:

- Animated bar growth on load
- Interactive tooltips showing exact values
- Rounded corners for modern appearance
- Color highlighting on hover
- X and Y axis labels

**Best For**:

- Quarterly sales comparisons
- Category performance metrics
- Survey results
- Budget allocations

---

### 2. Line Chart

**File**: `components/LineChart.tsx`

**Use Case**: Displaying trends and changes over time

**Features**:

- Smooth curve animation with stroke-dasharray effect
- Interactive data points
- Hover tooltips with formatted dates and values
- Monotone curve interpolation for smooth lines
- Time-based X-axis formatting

**Best For**:

- Stock prices over time
- Website traffic trends
- Temperature changes
- Sales over months/years

---

### 3. Area Chart

**File**: `components/AreaChart.tsx`

**Use Case**: Showing cumulative totals or comparing multiple series over time

**Features**:

- Multiple colored data series
- Stacked areas with transparency
- Smooth curve interpolation
- Legend for series identification
- Animated entrance effects

**Best For**:

- Revenue streams over time
- Market share evolution
- Resource utilization
- Population demographics

---

### 4. Scatter Plot

**File**: `components/ScatterPlot.tsx`

**Use Case**: Visualizing relationships between two numerical variables

**Features**:

- Color-coded categories
- Interactive points with enlargement on hover
- Sequential animation entrance
- Legend for category identification
- Adjustable opacity

**Best For**:

- Correlation analysis
- Customer segmentation
- Scientific data relationships
- Performance vs. efficiency metrics

---

### 5. Pie Chart

**File**: `components/PieChart.tsx`

**Use Case**: Showing parts of a whole, percentage breakdowns

**Features**:

- Animated slice expansion from center
- Interactive slice enlargement on hover
- Percentage calculations in tooltips
- Color-coded segments
- Labels at slice centroids

**Best For**:

- Market share distribution
- Budget allocation
- Survey response breakdown
- Resource distribution

---

### 6. Donut Chart

**File**: `components/PieChart.tsx` (with `innerRadius` prop)

**Use Case**: Similar to pie chart but with space for central information

**Features**:

- All pie chart features
- Hollow center for additional text/metrics
- Better for comparing similar values
- More modern appearance

**Best For**:

- Dashboard KPIs
- Completion percentages
- Category distributions
- Mobile-friendly displays

---

### 7. Radar Chart

**File**: `components/RadarChart.tsx`

**Use Case**: Comparing multiple variables across categories

**Features**:

- Circular grid with multiple axes
- Filled polygon area
- Interactive data points
- Radial symmetry
- Gridline references

**Best For**:

- Skill assessments
- Product comparisons
- Performance evaluations
- Multi-criteria analysis

---

### 8. Heatmap

**File**: `components/Heatmap.tsx`

**Use Case**: Visualizing data density and patterns in matrix form

**Features**:

- Color gradient based on values
- Interactive cell highlighting
- Sequential animation
- Color legend with scale
- Cell-by-cell tooltips

**Best For**:

- Correlation matrices
- Calendar data
- Geographic density
- User activity patterns

---

### 9. Histogram

**File**: `components/Histogram.tsx`

**Use Case**: Understanding the frequency distribution of a continuous variable

**Features**:

- Configurable binning with D3 bin generator
- Animated bar entrance
- Hover tooltips with range and count
- Frequency-focused Y-axis

**Best For**:

- Score distribution analysis
- Transaction amount spread
- Latency distribution checks
- Detecting skewness in data

---

### 10. Box Plot

**File**: `components/BoxPlot.tsx`

**Use Case**: Summarizing distribution with quartiles, whiskers, and outliers

**Features**:

- Q1, median, and Q3 visualization
- Whiskers using IQR rule
- Outlier highlighting
- Tooltip with quartile stats

**Best For**:

- Comparing dataset spread
- Outlier detection
- Before/after experiment summaries
- SLA/latency variance reviews

---

### 11. Violin Plot

**File**: `components/ViolinPlot.tsx`

**Use Case**: Comparing category distributions with mirrored density shapes

**Features**:

- Density estimation via binned smoothing
- Category-wise mirrored violin areas
- Median marker per category
- Tooltip with quartile summary

**Best For**:

- Team performance distribution comparison
- A/B test distribution differences
- Multi-group metric spread analysis
- Statistical storytelling dashboards

---

### 12. Bubble Chart

**File**: `components/BubbleChartViz.tsx`

**Use Case**: Displaying 3-variable relationships using position and point size

**Features**:

- X and Y quantitative axis mapping
- Bubble radius encoding for third metric
- Category color grouping with legend
- Animated bubble growth and hover tooltips

**Best For**:

- Portfolio risk/return/size analysis
- Segment-level KPI comparison
- Multi-factor performance snapshots
- Marketing campaign impact maps

---

### 13. Waterfall Chart

**File**: `components/WaterfallChart.tsx`

**Use Case**: Tracking cumulative impact of positive and negative changes

**Features**:

- Stepwise cumulative bars
- Positive/negative color distinction
- Connector lines between stages
- Tooltips for change and cumulative value

**Best For**:

- Revenue bridge analysis
- Budget variance tracking
- Profit/loss decomposition
- KPI contribution storytelling

---

### 14. Funnel Chart

**File**: `components/FunnelChart.tsx`

**Use Case**: Visualizing drop-off through sequential process stages

**Features**:

- Trapezoid stage segments
- Width encoding by stage volume
- Step conversion rate tooltip
- Staggered entrance transitions

**Best For**:

- Sales pipeline tracking
- Signup conversion analysis
- Product onboarding analytics
- Support flow completion monitoring

---

### 15. Calendar Heatmap

**File**: `components/CalendarHeatmap.tsx`

**Use Case**: Showing daily intensity patterns over multiple weeks/months

**Features**:

- Day-level grid layout by week and weekday
- Sequential color scale for intensity
- Month and weekday labels
- Hover tooltips with date and value

**Best For**:

- Daily active users tracking
- Incident volume monitoring
- Commits/activity trends
- Habit or attendance visualization

---

### 16. Lollipop Chart

**File**: `components/LollipopChart.tsx`

**Use Case**: Comparing ranked categories with cleaner visual weight than bars

**Features**:

- Stem-and-dot value encoding
- Sorted category ranking
- Animated stems and markers
- Tooltip on lollipop heads

**Best For**:

- Regional performance ranking
- Product leaderboard comparison
- KPI gap analysis
- Prioritization visuals

---

### 17. Candlestick Chart (OHLC)

**File**: `components/CandlestickChart.tsx`

**Use Case**: Showing financial-style open-high-low-close movement over time

**Features**:

- Candle body and wick rendering
- Gain/loss color encoding
- OHLC tooltips per interval
- Time axis with compact date ticks

**Best For**:

- Stock/asset trend exploration
- Price volatility inspection
- Intraperiod movement analysis
- Time-windowed trading dashboards

---

### 18. Streamgraph

**File**: `components/Streamgraph.tsx`

**Use Case**: Visualizing how category composition changes over time in flowing layers

**Features**:

- Wiggle-offset stacked layout
- Smooth curved layers
- Category legend and hover highlighting
- Time-based x-axis formatting

**Best For**:

- Channel mix over time
- Resource allocation evolution
- Traffic/source composition trends
- Narrative data stories

---

### 19. Parallel Coordinates

**File**: `components/ParallelCoordinates.tsx`

**Use Case**: Comparing many records across multiple quantitative dimensions

**Features**:

- Multiple vertical axes per metric
- Polylines per record across dimensions
- Hover detail for full-record values
- Color gradient for line differentiation

**Best For**:

- Multivariate performance analysis
- Benchmark comparison across entities
- Outlier profile detection
- High-dimensional exploratory analysis

---

### 20. Chord Diagram

**File**: `components/ChordDiagram.tsx`

**Use Case**: Showing relationship strength and flow-like interactions between categories

**Features**:

- Circular grouped arcs by category
- Ribbon links proportional to connection value
- Hover details for groups and links
- Label layout around radial perimeter

**Best For**:

- Department interaction mapping
- Bidirectional dependency analysis
- Trade/traffic exchange patterns
- Inter-system communication summaries

---

## Hierarchical Visualizations

### 21. TreeMap

**File**: `components/TreeMap.tsx`

**Use Case**: Displaying hierarchical data as nested rectangles

**Features**:

- Size proportional to values
- Color-coded by parent category
- Nested structure
- Interactive hover effects
- Space-efficient layout

**Best For**:

- File system visualization
- Portfolio composition
- Budget hierarchies
- Organizational structure

---

### 22. Sunburst Chart

---

### 23. Circle Packing

**File**: `components/CirclePacking.tsx`

**Use Case**: Displaying hierarchy depth and value through nested circles

**Features**:

- Packed-circle hierarchy layout
- Depth-based coloring
- Leaf label rendering for larger nodes
- Tooltip with value and depth context

**Best For**:

- Portfolio/category decomposition
- Content taxonomy overviews
- Nested organization snapshots
- Hierarchical part-to-whole analysis

---

### 24. Icicle Chart

**File**: `components/IcicleChart.tsx`

**Use Case**: Showing hierarchical partitioning with rectangular layers by depth

**Features**:

- Partition layout with depth bands
- Width encoding by aggregated value
- Hover details for node metrics
- Readable labels on sufficiently large blocks

**Best For**:

- Resource hierarchy analysis
- Budget split by nested categories
- Tree depth comparison
- Space-efficient hierarchy navigation

---

### 25. Tree Diagram

**File**: `components/TreeDiagram.tsx`
**File**: `components/Sunburst.tsx`

**Use Case**: Radial visualization of hierarchical data

**Features**:

- Circular, space-efficient design
- Color-coded segments
- Radial depth representation
- Interactive highlighting
- Angular labels

**Best For**:

- Directory structures
- Organizational charts
- Taxonomy visualization
- Nested categories

---

**Use Case**: Traditional tree layout showing parent-child relationships

**Features**:

- Horizontal tree layout
- Animated node appearance
- Curved connecting links
- Color-coded leaf vs. parent nodes
- Interactive node tooltips

**Best For**:

- Family trees
- Decision trees
- Organizational hierarchies
- Dependency graphs

---

## Network & Flow Visualizations

### 26. Force-Directed Graph

**File**: `components/ForceDirectedGraph.tsx`

**Use Case**: Visualizing networks and relationships

**Features**:

- Physics-based layout simulation
- Draggable nodes
- Dynamic force calculation
- Color-coded node groups
- Weighted edge connections

**Best For**:

- Social networks
- Citation networks
- Computer network topology
- Relationship mapping

---

### 27. Sankey Diagram

**File**: `components/SankeyDiagram.tsx`

**Use Case**: Showing flow and magnitude between nodes

**Features**:

- Flow proportional to value
- Color-coded paths
- Multi-stage flows
- Smooth curved paths
- Node labels

**Best For**:

- Energy flow diagrams
- Budget allocation flows
- User journey analysis
- Supply chain visualization

---

### 28. Dendrogram (Cluster)

**File**: `components/DendrogramChart.tsx`

**Use Case**: Showing clustered hierarchical structure with branch distances

**Features**:

- Cluster tree layout
- Horizontal link routing
- Parent/leaf node distinction
- Node tooltip with depth details

**Best For**:

- Taxonomy branch analysis
- Organizational branch comparison
- Hierarchical clustering outcomes
- Structural dependency inspection

---

### 29. Hexbin Plot

**File**: `components/HexbinPlot.tsx`

**Use Case**: Summarizing dense point distributions through hexagonal density bins

**Features**:

- Hexagonal aggregation of 2D points
- Density-driven color encoding
- Tooltip showing bin point count
- Clearer density patterns than raw scatter in large samples

**Best For**:

- Traffic hotspot analysis
- Geo-like density approximations
- Large-scale point cloud summarization
- Correlation density exploration

---

### 30. Choropleth Map

**File**: `components/ChoroplethMap.tsx`

**Use Case**: Showing region-level intensity through color encoding

**Features**:

- Polygon region rendering
- Sequential value-to-color mapping
- Region hover tooltip with metric value
- Region labels for quick identification

**Best For**:

- Regional performance heat views
- Risk/intensity zoning
- Public metrics by area
- Location-driven dashboard KPIs

---

### 31. Proportional Symbol Map

**File**: `components/ProportionalSymbolMap.tsx`

**Use Case**: Comparing region magnitudes with circle size overlays

**Features**:

- Symbol radius scaling by measure
- Background region boundaries
- Tooltip with regional magnitude
- Smooth symbol entrance transitions

**Best For**:

- Population comparisons
- Sales volume by territory
- Capacity allocation by region
- Demand concentration summaries

---

### 32. Dot Density Map

**File**: `components/DotDensityMap.tsx`

**Use Case**: Showing concentration patterns through sampled dots within regions

**Features**:

- Polygon outlines with interior sample points
- Region-aware point generation
- Animated point reveal
- Lightweight density legend

**Best For**:

- Demographic concentration patterns
- Distribution storytelling
- Regional load visualization
- Event intensity by area

---

### 33. Cartogram

**File**: `components/CartogramMap.tsx`

**Use Case**: Emphasizing region magnitude by distorting area around geographic centroids

**Features**:

- Region scaling by metric value
- Preserved neighborhood context
- Value-based color intensity
- Distortion-aware hover tooltips

**Best For**:

- Election/population storytelling
- Revenue-weighted territory comparison
- Priority region emphasis
- Value-biased geographic summaries

---

### 34. Alluvial Chart

**File**: `components/AlluvialChart.tsx`

**Use Case**: Showing categorical transitions across multiple stages

**Features**:

- Stage-to-stage flow ribbons
- Node blocks with labels
- Width proportional to transition magnitude
- Hover details for source-target flows

**Best For**:

- User journey stage analysis
- Funnel transition diagnostics
- Segment migration patterns
- Multi-stage conversion storytelling

---

### 35. Network Adjacency Matrix

**File**: `components/AdjacencyMatrix.tsx`

**Use Case**: Viewing pairwise network connection intensity in matrix form

**Features**:

- Row/column node indexing
- Cell color by connection weight
- Symmetric edge aggregation
- Hover detail for pair strength

**Best For**:

- Dense network exploration
- Cluster/block structure inspection
- Peer interaction heat patterns
- Relationship intensity audits

---

### 36. Ridgeline Chart

**File**: `components/RidgelineChart.tsx`

**Use Case**: Comparing many category distributions as stacked density ridges

**Features**:

- Layered ridge areas per category
- Smoothed density curves
- Shared quantitative axis for comparison
- Category-aligned baselines

**Best For**:

- Multi-group score distributions
- Segment spread comparisons
- Statistical profile dashboards
- Distribution-overview analytics

---

### 37. Horizon Chart

**File**: `components/HorizonChart.tsx`

**Use Case**: Showing volatile time-series data in a compact layered band format

**Features**:

- Positive/negative layered bands
- Compact vertical footprint
- Time-axis trend readability
- Band-based intensity encoding

**Best For**:

- Monitoring dashboards with tight space
- High-frequency signal tracking
- Deviation-focused time-series
- Compact operational telemetry

---

### 38. Bump Chart

**File**: `components/BumpChart.tsx`

**Use Case**: Tracking rank changes across multiple periods

**Features**:

- Rank-position lines by category
- Labeling at trajectory endpoints
- Smoothed transitions over time
- Comparative rank movement clarity

**Best For**:

- Leaderboard movement analysis
- Competitive position tracking
- Trend-in-ranking storytelling
- Relative performance evolution

---

### 39. Radar Small Multiples

**File**: `components/RadarSmallMultiples.tsx`

**Use Case**: Comparing many radar profiles in a consistent grid layout

**Features**:

- Small-multiple radar layout
- Shared radial scaling for fairness
- Per-panel metric spokes and labels
- Entity-colored polygons for quick comparison

**Best For**:

- Cluster profile comparisons
- Team capability snapshots
- Segment scoring audits
- Multi-entity trait analysis

---

### 40. Hybrid SVG+Canvas Large Scatter

**File**: `components/HybridCanvasScatter.tsx`

**Use Case**: Rendering large point clouds efficiently while keeping crisp SVG axes

**Features**:

- Canvas-based high-volume point drawing
- SVG axis overlay for readability
- Efficient rendering for thousands of points
- Preserved chart semantics and labeling

**Best For**:

- Large telemetry point clouds
- Performance-sensitive dashboards
- Dense scatter exploration
- High-volume simulation output views

---

## Implementation Details

### Common Features Across All Visualizations

1. **Animations**: All charts use D3 transitions for smooth entrance effects
2. **Tooltips**: Interactive tooltips show detailed information on hover
3. **Responsive**: Charts adapt to container sizes
4. **Type-Safe**: Full TypeScript support with proper typing
5. **Clean-up**: Proper resource disposal on component unmount
6. **Accessibility**: Semantic SVG structure with proper attributes

### Performance Considerations

- **Efficient Rendering**: Uses D3's efficient DOM manipulation
- **Transition Optimization**: Staggered animations prevent performance issues
- **Resource Management**: Tooltips and event listeners are cleaned up
- **Data Binding**: D3's data join pattern ensures minimal DOM updates

### Customization Options

Each component accepts standard props:

- `width`: Chart width in pixels (default varies by chart)
- `height`: Chart height in pixels (default varies by chart)
- `data`: Data in the format specific to each chart type

### Color Schemes

The project uses various D3 color schemes:

- `d3.schemeCategory10` - Categorical data
- `d3.schemeSet3` - Pie charts
- `d3.interpolateYlOrRd` - Sequential data (heatmap)
- Custom primary/secondary colors from MUI theme

---

## Usage Example

```tsx
import BarChart from '@/components/BarChart';
import { generateBarChartData } from '@/utils/mockData';

function MyPage() {
  const data = generateBarChartData();

  return <BarChart data={data} width={600} height={400} />;
}
```

---

## Data Format Examples

### Bar Chart / Pie Chart Data

```typescript
[
  { label: 'Q1', value: 45 },
  { label: 'Q2', value: 67 },
  { label: 'Q3', value: 52 },
];
```

### Line Chart / Area Chart Data

```typescript
[
  { date: new Date('2024-01-01'), value: 45 },
  { date: new Date('2024-01-02'), value: 52 },
  { date: new Date('2024-01-03'), value: 48 },
];
```

### Scatter Plot Data

```typescript
[
  { x: 45, y: 67, category: 'A' },
  { x: 52, y: 73, category: 'B' },
  { x: 38, y: 55, category: 'A' },
];
```

### Tree Data (Hierarchical)

```typescript
{
  name: 'root',
  children: [
    {
      name: 'branch1',
      children: [
        { name: 'leaf1', value: 100 },
        { name: 'leaf2', value: 150 }
      ]
    }
  ]
}
```

### Network Data

```typescript
{
  nodes: [
    { id: 'A', group: 1 },
    { id: 'B', group: 1 },
    { id: 'C', group: 2 }
  ],
  links: [
    { source: 'A', target: 'B', value: 1 },
    { source: 'B', target: 'C', value: 2 }
  ]
}
```

---

## Chart Variants & Extensions

### 41. Grouped Bar Chart

**File**: `components/GroupedBarChart.tsx`

**Use Case**: Compare multiple series side-by-side across categories

**Features**:

- Multiple bars per category
- Color-coded series with legend
- Interactive tooltips for each bar
- Animated bar growth

**Best For**:

- Quarterly comparisons by product
- Regional performance metrics
- Before/after comparisons

---

### 42. Stacked Bar Chart

**File**: `components/StackedBarChart.tsx`

**Use Case**: Show composition and total values across categories

**Features**:

- Stacked segments per category
- Part-to-whole visualization
- Interactive tooltips showing segment details
- Legend for series identification

**Best For**:

- Market share breakdown
- Budget allocation
- Resource distribution

---

### 43. Stacked Area Chart

**File**: `components/StackedAreaChart.tsx`

**Use Case**: Display cumulative trends over time

**Features**:

- Multiple stacked layers
- Smooth curve transitions
- Interactive layer highlighting
- Color-coded series

**Best For**:

- Revenue streams over time
- Traffic sources evolution
- Cumulative metrics

---

### 44. Waffle Chart

**File**: `components/WaffleChart.tsx`

**Use Case**: Intuitive percentage visualization using grid squares

**Features**:

- 100-square grid representation
- Color-coded categories
- Sequential square animation
- Interactive tooltips

**Best For**:

- Survey results (agree/disagree)
- Completion percentages
- Simple proportions

---

### 45. Sparklines

**File**: `components/Sparklines.tsx`

**Use Case**: Compact inline trend visualization

**Features**:

- Line, bar, or area variants
- Minimal design without axes
- Current value and change indicators
- Multiple sparklines in grid

**Best For**:

- Dashboard KPI trends
- Table row trends
- Email/report summaries

---

### 46. Small Multiples Grid

**File**: `components/SmallMultiplesGrid.tsx`

**Use Case**: Compare patterns across multiple subsets

**Features**:

- Grid of identical chart types
- Consistent scales for comparison
- Line, area, or scatter variants
- Interactive hover on each chart

**Best For**:

- Regional comparisons
- Product performance grid
- Faceted analysis

---

## Business & Specialized Charts

### 47. Gantt Chart

**File**: `components/GanttChart.tsx`

**Use Case**: Project timeline and task scheduling

**Features**:

- Task bars with progress indicators
- Today marker line
- Duration and completion tooltips
- Timeline axis

**Best For**:

- Project management
- Resource planning
- Event scheduling

---

### 48. Bullet Chart

**File**: `components/BulletChart.tsx`

**Use Case**: KPI performance against targets

**Features**:

- Qualitative range backgrounds (bad/good/excellent)
- Current performance bar
- Target marker
- Comparison measure (optional)

**Best For**:

- Dashboard KPIs
- Goal tracking
- Performance metrics

---

### 49. Slope Chart

**File**: `components/SlopeChart.tsx`

**Use Case**: Before/after comparison and ranking changes

**Features**:

- Two-point connections
- Color-coded increases/decreases
- Change percentages in tooltips
- Directional arrows

**Best For**:

- Pre/post analysis
- Ranking changes
- Period comparisons

---

### 50. Beeswarm Plot

**File**: `components/BeeswarmPlot.tsx`

**Use Case**: Distribution visualization without overlaps

**Features**:

- Force simulation for collision avoidance
- Individual point visibility
- Color-coded categories
- Interactive tooltips

**Best For**:

- Distribution analysis
- Category comparisons
- Outlier detection

---

### 51. Arc Diagram

**File**: `components/ArcDiagram.tsx`

**Use Case**: Network visualization with linear node arrangement

**Features**:

- Nodes on horizontal line
- Curved arcs for connections
- Weight-based arc thickness
- Interactive highlighting

**Best For**:

- Sequential relationships
- Character co-occurrence
- Simple networks

---

### 52. Marimekko Chart

**File**: `components/MarimekkoChart.tsx`

**Use Case**: Two-dimensional market share analysis

**Features**:

- Variable column widths (total size)
- Stacked segments (composition)
- Percentage normalization
- Interactive tooltips

**Best For**:

- Market segmentation
- Portfolio analysis
- Two-way categorical data

---

## Advanced & Specialized Visualizations

### 53. Venn Diagram

**File**: `components/VennDiagram.tsx`

**Use Case**: Set relationships and intersections

**Features**:

- 2-3 circle overlaps
- Intersection counts
- Individual set sizes
- Interactive highlighting

**Best For**:

- Set theory illustrations
- Feature comparisons
- Audience overlaps

---

### 54. Contour Plot

**File**: `components/ContourPlot.tsx`

**Use Case**: Elevation/density visualization with isolines

**Features**:

- D3 contour generation
- Color-coded levels
- Data point overlay
- Gradient legend

**Best For**:

- Elevation maps
- Density visualization
- Scientific data

---

### 55. Polar Area Chart

**File**: `components/PolarAreaChart.tsx`

**Use Case**: Radial chart with varying radii (Coxcomb/Nightingale Rose)

**Features**:

- Equal angles, varying radii
- Radial grid lines
- Color-coded segments
- Interactive tooltips

**Best For**:

- Cyclical data
- Directional analysis
- Historical comparisons (Nightingale's original use)

---

### 56. Population Pyramid

**File**: `components/PopulationPyramid.tsx`

**Use Case**: Demographic distribution by age and gender

**Features**:

- Back-to-back horizontal bars
- Male (left) vs Female (right)
- Age group labels
- Interactive tooltips

**Best For**:

- Demographic analysis
- Age distribution
- Gender comparisons

---

### 57. Timeline Chart

**File**: `components/TimelineChart.tsx`

**Use Case**: Event visualization over time

**Features**:

- Alternating top/bottom events
- Date markers and labels
- Category-based colors
- Interactive tooltips

**Best For**:

- Project milestones
- Historical events
- Release timelines

---

### 58. Flow Map

**File**: `components/FlowMap.tsx`

**Use Case**: Geographic movement/migration visualization

**Features**:

- Curved flow lines
- Location markers
- Flow width by magnitude
- Interactive highlighting

**Best For**:

- Migration patterns
- Trade routes
- Transportation flows

---

### 59. Voronoi Diagram

**File**: `components/VoronoiDiagram.tsx`

**Use Case**: Nearest-neighbor spatial partitioning

**Features**:

- Delaunay triangulation
- Cell-based partitioning
- Color-coded by value
- Interactive cells

**Best For**:

- Spatial analysis
- Service area mapping
- Nearest facility problems

---

### 60. Radial Tree

**File**: `components/RadialTree.tsx`

**Use Case**: Circular hierarchical layout

**Features**:

- Radial branch arrangement
- Depth-based rings
- Curved links
- Interactive nodes

**Best For**:

- Large hierarchies
- Phylogenetic trees
- Organizational structures

---

## Adding New Visualizations

To add a new visualization:

1. Create a new component in `components/`
2. Follow the existing pattern with `useRef` and `useEffect`
3. Add data generator in `utils/mockData.ts`
4. Import and use in `app/page.tsx`
5. Add documentation in this file

---

## Resources

- [D3.js Documentation](https://d3js.org/)
- [D3 Gallery](https://observablehq.com/@d3/gallery)
- [Material-UI Components](https://mui.com/material-ui/)
- [Next.js Documentation](https://nextjs.org/docs)
