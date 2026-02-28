'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { Timeline, BubbleChart, AccountTree, Map } from '@mui/icons-material';

import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import AreaChart from '@/components/AreaChart';
import ScatterPlot from '@/components/ScatterPlot';
import PieChart from '@/components/PieChart';
import TreeMap from '@/components/TreeMap';
import Sunburst from '@/components/Sunburst';
import ForceDirectedGraph from '@/components/ForceDirectedGraph';
import SankeyDiagram from '@/components/SankeyDiagram';
import Heatmap from '@/components/Heatmap';
import RadarChart from '@/components/RadarChart';
import TreeDiagram from '@/components/TreeDiagram';
import Histogram from '@/components/Histogram';
import BoxPlot from '@/components/BoxPlot';
import ViolinPlot from '@/components/ViolinPlot';
import BubbleChartViz from '@/components/BubbleChartViz';
import WaterfallChart from '@/components/WaterfallChart';
import FunnelChart from '@/components/FunnelChart';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import LollipopChart from '@/components/LollipopChart';
import CandlestickChart from '@/components/CandlestickChart';
import Streamgraph from '@/components/Streamgraph';
import ParallelCoordinates from '@/components/ParallelCoordinates';
import ChordDiagram from '@/components/ChordDiagram';
import CirclePacking from '@/components/CirclePacking';
import IcicleChart from '@/components/IcicleChart';
import DendrogramChart from '@/components/DendrogramChart';
import HexbinPlot from '@/components/HexbinPlot';
import ChoroplethMap from '@/components/ChoroplethMap';
import ProportionalSymbolMap from '@/components/ProportionalSymbolMap';
import DotDensityMap from '@/components/DotDensityMap';
import CartogramMap from '@/components/CartogramMap';
import AlluvialChart from '@/components/AlluvialChart';
import AdjacencyMatrix from '@/components/AdjacencyMatrix';
import RidgelineChart from '@/components/RidgelineChart';
import HorizonChart from '@/components/HorizonChart';
import BumpChart from '@/components/BumpChart';
import RadarSmallMultiples from '@/components/RadarSmallMultiples';
import HybridCanvasScatter from '@/components/HybridCanvasScatter';
import GroupedBarChart from '@/components/GroupedBarChart';
import StackedBarChart from '@/components/StackedBarChart';
import StackedAreaChart from '@/components/StackedAreaChart';
import WaffleChart from '@/components/WaffleChart';
import Sparklines from '@/components/Sparklines';
import SmallMultiplesGrid from '@/components/SmallMultiplesGrid';
import GanttChart from '@/components/GanttChart';
import BulletChart from '@/components/BulletChart';
import SlopeChart from '@/components/SlopeChart';
import BeeswarmPlot from '@/components/BeeswarmPlot';
import ArcDiagram from '@/components/ArcDiagram';
import MarimekkoChart from '@/components/MarimekkoChart';
import VennDiagram from '@/components/VennDiagram';
import ContourPlot from '@/components/ContourPlot';
import PolarAreaChart from '@/components/PolarAreaChart';
import PopulationPyramid from '@/components/PopulationPyramid';
import TimelineChart from '@/components/TimelineChart';
import FlowMap from '@/components/FlowMap';
import VoronoiDiagram from '@/components/VoronoiDiagram';
import RadialTree from '@/components/RadialTree';

import {
  generateBarChartData,
  generateLineChartData,
  generateAreaChartData,
  generateScatterPlotData,
  generateTreeData,
  generateNetworkData,
  generateSankeyData,
  generatePieChartData,
  generateHeatmapData,
  generateHistogramData,
  generateBoxPlotData,
  generateViolinPlotData,
  generateBubbleChartData,
  generateWaterfallData,
  generateFunnelData,
  generateCalendarHeatmapData,
  generateLollipopData,
  generateCandlestickData,
  generateStreamgraphData,
  generateParallelCoordinatesData,
  generateChordData,
  generateHexbinData,
  generateGeoRegionData,
  generateDotDensityMapData,
  generateAlluvialData,
  generateRidgelineData,
  generateHorizonData,
  generateBumpChartData,
  generateRadarSmallMultiplesData,
  generateLargeScatterData,
  generateGroupedBarData,
  generateStackedBarData,
  generateStackedAreaData,
  generateWaffleData,
  generateSparklineData,
  generateSmallMultiplesData,
  generateGanttData,
  generateBulletData,
  generateSlopeData,
  generateBeeswarmData,
  generateArcDiagramData,
  generateMarimekkoData,
  generateVennData,
  generateContourData,
  generatePolarAreaData,
  generatePyramidData,
  generateTimelineData,
  generateFlowMapData,
  generateVoronoiData,
} from '@/utils/mockData';

export default function Home() {
  const [barData, setBarData] = useState(generateBarChartData());
  const [lineData, setLineData] = useState(generateLineChartData());
  const [areaData, setAreaData] = useState(generateAreaChartData());
  const [scatterData, setScatterData] = useState(generateScatterPlotData());
  const [pieData, setPieData] = useState(generatePieChartData());
  const [treeData] = useState(generateTreeData());
  const [networkData] = useState(generateNetworkData());
  const [sankeyData] = useState(generateSankeyData());
  const [heatmapData, setHeatmapData] = useState(generateHeatmapData());
  const [radarData, setRadarData] = useState(generateBarChartData());
  const [histogramData, setHistogramData] = useState(generateHistogramData());
  const [boxPlotData, setBoxPlotData] = useState(generateBoxPlotData());
  const [violinData, setViolinData] = useState(generateViolinPlotData());
  const [bubbleData, setBubbleData] = useState(generateBubbleChartData());
  const [waterfallData, setWaterfallData] = useState(generateWaterfallData());
  const [funnelData, setFunnelData] = useState(generateFunnelData());
  const [calendarHeatmapData, setCalendarHeatmapData] = useState(generateCalendarHeatmapData());
  const [lollipopData, setLollipopData] = useState(generateLollipopData());
  const [candlestickData, setCandlestickData] = useState(generateCandlestickData());
  const [streamgraphData, setStreamgraphData] = useState(generateStreamgraphData());
  const [parallelData, setParallelData] = useState(generateParallelCoordinatesData());
  const [chordData] = useState(generateChordData());
  const [hexbinData, setHexbinData] = useState(generateHexbinData());
  const [geoRegions] = useState(generateGeoRegionData());
  const [dotDensityData] = useState(generateDotDensityMapData());
  const [alluvialData] = useState(generateAlluvialData());
  const [ridgelineData, setRidgelineData] = useState(generateRidgelineData());
  const [horizonData, setHorizonData] = useState(generateHorizonData());
  const [bumpData, setBumpData] = useState(generateBumpChartData());
  const [radarSmallData, setRadarSmallData] = useState(generateRadarSmallMultiplesData());
  const [largeScatterData, setLargeScatterData] = useState(generateLargeScatterData());
  const [groupedBarData, setGroupedBarData] = useState(generateGroupedBarData());
  const [stackedBarData, setStackedBarData] = useState(generateStackedBarData());
  const [stackedAreaData, setStackedAreaData] = useState(generateStackedAreaData());
  const [waffleData] = useState(generateWaffleData());
  const [sparklineData] = useState(generateSparklineData());
  const [smallMultiplesData] = useState(generateSmallMultiplesData());
  const [ganttData] = useState(generateGanttData());
  const [bulletData] = useState(generateBulletData());
  const [slopeData] = useState(generateSlopeData());
  const [beeswarmData] = useState(generateBeeswarmData());
  const [arcDiagramData] = useState(generateArcDiagramData());
  const [marimekkoData] = useState(generateMarimekkoData());
  const [vennData] = useState(generateVennData());
  const [contourData] = useState(generateContourData());
  const [polarAreaData] = useState(generatePolarAreaData());
  const [pyramidData] = useState(generatePyramidData());
  const [timelineData] = useState(generateTimelineData());
  const [flowMapData] = useState(generateFlowMapData());
  const [voronoiData] = useState(generateVoronoiData());

  useEffect(() => {
    setBarData(generateBarChartData());
    setLineData(generateLineChartData());
    setAreaData(generateAreaChartData());
    setScatterData(generateScatterPlotData());
    setPieData(generatePieChartData());
    setHeatmapData(generateHeatmapData());
    setRadarData(generateBarChartData());
    setHistogramData(generateHistogramData());
    setBoxPlotData(generateBoxPlotData());
    setViolinData(generateViolinPlotData());
    setBubbleData(generateBubbleChartData());
    setWaterfallData(generateWaterfallData());
    setFunnelData(generateFunnelData());
    setCalendarHeatmapData(generateCalendarHeatmapData());
    setLollipopData(generateLollipopData());
    setCandlestickData(generateCandlestickData());
    setStreamgraphData(generateStreamgraphData());
    setParallelData(generateParallelCoordinatesData());
    setHexbinData(generateHexbinData());
    setRidgelineData(generateRidgelineData());
    setHorizonData(generateHorizonData());
    setBumpData(generateBumpChartData());
    setRadarSmallData(generateRadarSmallMultiplesData());
    setLargeScatterData(generateLargeScatterData());
  }, []);

  const ChartCard = ({
    title,
    description,
    icon,
    children,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="center" sx={{ overflowX: 'auto' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );

  type GridConfig = {
    xs: number;
    md?: number;
    lg?: number;
  };

  type ChartEntry = {
    title: string;
    description: string;
    icon: React.ReactNode;
    grid: GridConfig;
    content: React.ReactNode;
  };

  type SectionEntry = {
    title: string;
    description: string;
    headerIcon: React.ReactNode;
    dividerBefore?: boolean;
    charts: ChartEntry[];
  };

  const sections: SectionEntry[] = [
    {
      title: 'Statistical Charts',
      description: 'Common charts for data analysis and business intelligence',
      headerIcon: <Timeline sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />,
      charts: [
        {
          title: 'Bar Chart',
          description: 'Compare categorical data with vertical bars. Hover to see details.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, lg: 6 },
          content: <BarChart data={barData} width={500} height={350} />,
        },
        {
          title: 'Line Chart',
          description: 'Display trends over time with smooth animations and interactive points.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, lg: 6 },
          content: <LineChart data={lineData} width={500} height={350} />,
        },
        {
          title: 'Area Chart',
          description: 'Stacked areas showing multiple data series with smooth curves.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, lg: 6 },
          content: <AreaChart data={areaData} width={500} height={350} />,
        },
        {
          title: 'Scatter Plot',
          description: 'Visualize relationships between two variables with color-coded categories.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12, lg: 6 },
          content: <ScatterPlot data={scatterData} width={500} height={350} />,
        },
        {
          title: 'Pie Chart',
          description: 'Show proportions of a whole with interactive slices.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <PieChart data={pieData} width={450} height={450} />,
        },
        {
          title: 'Donut Chart',
          description: 'Pie chart variation with a hollow center for additional information.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <PieChart data={pieData} width={450} height={450} innerRadius={80} />,
        },
        {
          title: 'Radar Chart',
          description: 'Compare multiple variables on a circular grid.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <RadarChart data={radarData} width={450} height={450} />,
        },
        {
          title: 'Heatmap',
          description: 'Visualize data density with color-coded cells and gradient legend.',
          icon: <Map color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <Heatmap data={heatmapData} width={500} height={400} />,
        },
        {
          title: 'Histogram',
          description: 'Analyze value distribution using binned frequencies.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <Histogram data={histogramData} width={500} height={350} />,
        },
        {
          title: 'Box Plot',
          description: 'Summarize distribution with quartiles, whiskers, and outliers.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <BoxPlot data={boxPlotData} width={500} height={350} />,
        },
        {
          title: 'Violin Plot',
          description: 'Compare distributions across categories with density shapes.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <ViolinPlot data={violinData} width={800} height={380} />,
        },
        {
          title: 'Bubble Chart',
          description: 'Show 3 variables with X, Y, and bubble size encoding.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <BubbleChartViz data={bubbleData} width={500} height={350} />,
        },
        {
          title: 'Waterfall Chart',
          description: 'Track cumulative positive and negative changes across stages.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12, md: 6 },
          content: <WaterfallChart data={waterfallData} width={600} height={360} />,
        },
        {
          title: 'Funnel Chart',
          description: 'Visualize stage-by-stage conversion drop-off.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <FunnelChart data={funnelData} width={800} height={380} />,
        },
        {
          title: 'Calendar Heatmap',
          description: 'Track daily activity intensity across weeks and months.',
          icon: <Map color="primary" />,
          grid: { xs: 12 },
          content: <CalendarHeatmap data={calendarHeatmapData} width={850} height={280} />,
        },
        {
          title: 'Lollipop Chart',
          description: 'Compare ranked categories with stem-and-dot markers.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <LollipopChart data={lollipopData} width={820} height={380} />,
        },
        {
          title: 'Candlestick Chart (OHLC)',
          description: 'Track open-high-low-close price movement over time.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <CandlestickChart data={candlestickData} width={850} height={400} />,
        },
        {
          title: 'Streamgraph',
          description: 'Visualize flowing composition changes across multiple time series.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <Streamgraph data={streamgraphData} width={860} height={400} />,
        },
        {
          title: 'Parallel Coordinates',
          description: 'Compare multivariate samples across multiple dimensions.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12 },
          content: <ParallelCoordinates data={parallelData} width={880} height={420} />,
        },
        {
          title: 'Chord Diagram',
          description: 'Show bidirectional relationship strengths between categories.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12 },
          content: <ChordDiagram data={chordData} width={620} height={620} />,
        },
        {
          title: 'Hexbin Plot',
          description: 'Aggregate dense scatter points into hexagonal density bins.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12 },
          content: <HexbinPlot data={hexbinData} width={820} height={390} />,
        },
        {
          title: 'Ridgeline Chart',
          description: 'Compare many category distributions as layered density ridges.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <RidgelineChart data={ridgelineData} width={900} height={430} />,
        },
        {
          title: 'Horizon Chart',
          description: 'Compact layered time-series view with positive and negative bands.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <HorizonChart data={horizonData} width={900} height={300} />,
        },
        {
          title: 'Bump Chart',
          description: 'Track ranking position changes across periods.',
          icon: <Timeline color="primary" />,
          grid: { xs: 12 },
          content: <BumpChart data={bumpData} width={900} height={400} />,
        },
        {
          title: 'Radar Small Multiples',
          description: 'Compare many radar profiles side-by-side in a compact grid.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12 },
          content: <RadarSmallMultiples data={radarSmallData} width={900} height={520} />,
        },
        {
          title: 'Hybrid SVG+Canvas Large Scatter',
          description: 'Render large point clouds with canvas while preserving SVG axes.',
          icon: <BubbleChart color="primary" />,
          grid: { xs: 12 },
          content: <HybridCanvasScatter data={largeScatterData} width={900} height={430} />,
        },
      ],
    },
    {
      title: 'Hierarchical Visualizations',
      description: 'Explore nested and hierarchical data structures',
      headerIcon: <AccountTree sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />,
      dividerBefore: true,
      charts: [
        {
          title: 'TreeMap',
          description:
            'Display hierarchical data as nested rectangles with size proportional to values.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12, lg: 6 },
          content: <TreeMap data={treeData} width={550} height={400} />,
        },
        {
          title: 'Sunburst Chart',
          description: 'Radial visualization of hierarchical data with interactive segments.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12, lg: 6 },
          content: <Sunburst data={treeData} width={500} height={500} />,
        },
        {
          title: 'Circle Packing',
          description: 'Nested circles representing hierarchical partitions by size.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12, lg: 6 },
          content: <CirclePacking data={treeData} width={520} height={520} />,
        },
        {
          title: 'Icicle Chart',
          description: 'Partitioned hierarchy layout shown as stacked rectangular layers.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12 },
          content: <IcicleChart data={treeData} width={900} height={360} />,
        },
        {
          title: 'Tree Diagram',
          description: 'Classic tree layout showing parent-child relationships.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12 },
          content: <TreeDiagram data={treeData} width={900} height={500} />,
        },
        {
          title: 'Dendrogram',
          description: 'Cluster-style hierarchical tree for leaf relationship distance patterns.',
          icon: <AccountTree color="secondary" />,
          grid: { xs: 12 },
          content: <DendrogramChart data={treeData} width={900} height={460} />,
        },
      ],
    },
    {
      title: 'Network & Flow Visualizations',
      description: 'Visualize connections, relationships, and flows between entities',
      headerIcon: <BubbleChart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />,
      dividerBefore: true,
      charts: [
        {
          title: 'Force-Directed Graph',
          description:
            'Interactive network visualization with draggable nodes and physics simulation.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: (
            <ForceDirectedGraph
              nodes={networkData.nodes}
              links={networkData.links}
              width={550}
              height={400}
            />
          ),
        },
        {
          title: 'Sankey Diagram',
          description: 'Flow diagram showing the magnitude of flows between nodes.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <SankeyDiagram data={sankeyData} width={650} height={400} />,
        },
        {
          title: 'Alluvial Chart',
          description: 'Track categorical transitions across sequential stages.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12 },
          content: <AlluvialChart data={alluvialData} width={900} height={410} />,
        },
        {
          title: 'Network Adjacency Matrix',
          description: 'Matrix view of connection intensity between network nodes.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12 },
          content: (
            <AdjacencyMatrix
              nodes={networkData.nodes}
              links={networkData.links}
              width={620}
              height={620}
            />
          ),
        },
      ],
    },
    {
      title: 'Geospatial Visualizations',
      description:
        'Map-based views for regional intensity, symbol scaling, and population density patterns',
      headerIcon: <Map sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />,
      dividerBefore: true,
      charts: [
        {
          title: 'Choropleth Map',
          description: 'Encode region-level values using sequential color intensity.',
          icon: <Map color="warning" />,
          grid: { xs: 12, lg: 6 },
          content: <ChoroplethMap data={geoRegions} width={700} height={430} />,
        },
        {
          title: 'Proportional Symbol Map',
          description: 'Compare regional magnitude with size-scaled symbols.',
          icon: <Map color="warning" />,
          grid: { xs: 12, lg: 6 },
          content: <ProportionalSymbolMap data={geoRegions} width={700} height={430} />,
        },
        {
          title: 'Dot Density Map',
          description: 'Represent regional concentration using sampled point densities.',
          icon: <Map color="warning" />,
          grid: { xs: 12 },
          content: <DotDensityMap data={dotDensityData} width={900} height={430} />,
        },
        {
          title: 'Cartogram',
          description: 'Distort region area by metric value while preserving rough geography.',
          icon: <Map color="warning" />,
          grid: { xs: 12 },
          content: <CartogramMap data={geoRegions} width={900} height={430} />,
        },
      ],
    },
    {
      title: 'New Chart Variants & Extensions',
      description:
        'Additional chart types including grouped, stacked, and specialized visualizations',
      headerIcon: <Timeline sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />,
      charts: [
        {
          title: 'Grouped Bar Chart',
          description: 'Side-by-side bars comparing multiple series across categories.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <GroupedBarChart data={groupedBarData} width={600} height={380} />,
        },
        {
          title: 'Stacked Bar Chart',
          description: 'Bars with segments showing part-to-whole composition.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <StackedBarChart data={stackedBarData} width={600} height={380} />,
        },
        {
          title: 'Stacked Area Chart',
          description: 'Cumulative area trends showing composition over time.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <StackedAreaChart data={stackedAreaData} width={600} height={380} />,
        },
        {
          title: 'Waffle Chart',
          description: 'Grid of squares for intuitive percentage visualization.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <WaffleChart data={waffleData} width={480} height={480} />,
        },
        {
          title: 'Sparklines',
          description: 'Tiny inline charts for compact trend visualization.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <Sparklines data={sparklineData} width={600} height={350} type="line" />,
        },
        {
          title: 'Small Multiples Grid',
          description: 'Trellis display of multiple small charts for comparison.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: (
            <SmallMultiplesGrid
              data={smallMultiplesData}
              width={700}
              height={550}
              chartType="line"
            />
          ),
        },
        {
          title: 'Gantt Chart',
          description: 'Project timeline with task durations and progress tracking.',
          icon: <Timeline color="success" />,
          grid: { xs: 12 },
          content: <GanttChart data={ganttData} width={900} height={380} />,
        },
        {
          title: 'Bullet Chart',
          description: 'KPI performance gauge with qualitative ranges and targets.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <BulletChart data={bulletData} width={650} height={380} />,
        },
        {
          title: 'Slope Chart',
          description: 'Before/after comparison showing ranking changes.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <SlopeChart data={slopeData} width={550} height={450} />,
        },
        {
          title: 'Beeswarm Plot',
          description: 'Force-simulated scatter plot with no overlapping points.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <BeeswarmPlot data={beeswarmData} width={650} height={380} />,
        },
        {
          title: 'Arc Diagram',
          description: 'Linear network visualization with curved connection arcs.',
          icon: <AccountTree color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <ArcDiagram data={arcDiagramData} width={750} height={380} />,
        },
        {
          title: 'Marimekko Chart',
          description: 'Two-dimensional market share with variable column widths.',
          icon: <Timeline color="success" />,
          grid: { xs: 12 },
          content: <MarimekkoChart data={marimekkoData} width={850} height={480} />,
        },
        {
          title: 'Venn Diagram',
          description: 'Set relationships with overlapping circles and intersections.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <VennDiagram data={vennData} width={550} height={480} />,
        },
        {
          title: 'Contour Plot',
          description: 'Isolines showing elevation or density patterns.',
          icon: <Map color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <ContourPlot data={contourData} width={650} height={480} />,
        },
        {
          title: 'Polar Area Chart',
          description: 'Radial chart with varying radii (Coxcomb/Nightingale Rose).',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <PolarAreaChart data={polarAreaData} width={550} height={550} />,
        },
        {
          title: 'Population Pyramid',
          description: 'Back-to-back demographic bars by age and gender.',
          icon: <Timeline color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <PopulationPyramid data={pyramidData} width={650} height={480} />,
        },
        {
          title: 'Timeline Chart',
          description: 'Event timeline with markers and date labels.',
          icon: <Timeline color="success" />,
          grid: { xs: 12 },
          content: <TimelineChart data={timelineData} width={900} height={380} />,
        },
        {
          title: 'Flow Map',
          description: 'Geographic movement visualization with curved flow lines.',
          icon: <Map color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <FlowMap data={flowMapData} width={750} height={550} />,
        },
        {
          title: 'Voronoi Diagram',
          description: 'Nearest-neighbor spatial partitioning with colored cells.',
          icon: <BubbleChart color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <VoronoiDiagram data={voronoiData} width={650} height={550} />,
        },
        {
          title: 'Radial Tree',
          description: 'Circular hierarchical layout with radial branches.',
          icon: <AccountTree color="success" />,
          grid: { xs: 12, lg: 6 },
          content: <RadialTree data={treeData} width={650} height={650} />,
        },
      ],
    },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <BubbleChart sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            D3.js & MUI5 Visualization Gallery
          </Typography>
          <Chip label="Interactive" color="secondary" size="small" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={(theme) => ({
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          })}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={(theme) => ({ color: theme.palette.common.white, fontWeight: 'bold' })}
          >
            D3.js Visualization Showcase
          </Typography>
          <Typography
            variant="h6"
            sx={(theme) => ({ color: theme.palette.common.white, opacity: 0.9 })}
          >
            A comprehensive collection of interactive data visualizations powered by D3.js and
            Material-UI 5
          </Typography>
        </Paper>

        {sections.map((section) => (
          <Box key={section.title}>
            {section.dividerBefore && <Divider sx={{ my: 6 }} />}
            <Box mb={6}>
              <Box display="flex" alignItems="center" mb={3}>
                {section.headerIcon}
                <Typography variant="h4" component="h2">
                  {section.title}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {section.description}
              </Typography>

              <Grid container spacing={3}>
                {section.charts.map((chart) => (
                  <Grid
                    key={chart.title}
                    item
                    xs={chart.grid.xs}
                    md={chart.grid.md}
                    lg={chart.grid.lg}
                  >
                    <ChartCard
                      title={chart.title}
                      description={chart.description}
                      icon={chart.icon}
                    >
                      {chart.content}
                    </ChartCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        ))}

        <Paper elevation={2} sx={{ p: 3, mt: 6, bgcolor: 'grey.100' }}>
          <Typography variant="h6" gutterBottom>
            About This Project
          </Typography>
          <Typography variant="body2" paragraph>
            This is a comprehensive showcase of <strong>60 D3.js visualizations</strong> integrated
            with Material-UI 5 in a Next.js application. All visualizations feature:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" variant="body2">
              ✨ Smooth animations and transitions
            </Typography>
            <Typography component="li" variant="body2">
              🎯 Interactive tooltips on hover
            </Typography>
            <Typography component="li" variant="body2">
              🎨 Beautiful color schemes
            </Typography>
            <Typography component="li" variant="body2">
              📱 Responsive design with MUI components
            </Typography>
            <Typography component="li" variant="body2">
              ⚡ Built with TypeScript for type safety
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
