// Mock data generators for D3 visualizations

const SEEDED_RANDOM_INITIAL_STATE = 123456789;
let seededRandomState = SEEDED_RANDOM_INITIAL_STATE;

const seededRandom = (): number => {
  seededRandomState = (seededRandomState * 1664525 + 1013904223) >>> 0;
  return seededRandomState / 4294967296;
};

export interface BarChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  date: Date;
  value: number;
}

export interface ScatterPlotData {
  x: number;
  y: number;
  category: string;
}

export interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

export interface NetworkNode {
  id: string;
  group: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

export interface ViolinPlotData {
  category: string;
  values: number[];
}

export interface BubblePointData {
  label: string;
  x: number;
  y: number;
  size: number;
  category: string;
}

export interface WaterfallData {
  label: string;
  value: number;
}

export interface FunnelStageData {
  stage: string;
  value: number;
}

export interface CalendarHeatmapData {
  date: Date;
  value: number;
}

export interface LollipopData {
  label: string;
  value: number;
}

export interface CandlestickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface StreamgraphDataPoint {
  date: Date;
  [key: string]: Date | number;
}

export interface ParallelCoordinatesData {
  name: string;
  [key: string]: string | number;
}

export interface ChordData {
  labels: string[];
  matrix: number[][];
}

export interface HexbinPointData {
  x: number;
  y: number;
}

export interface GeoRegionData {
  id: string;
  name: string;
  points: [number, number][];
  value: number;
  population: number;
}

export interface DotDensityPoint {
  x: number;
  y: number;
  regionId: string;
}

export interface DotDensityMapData {
  regions: GeoRegionData[];
  dots: DotDensityPoint[];
}

export interface AlluvialData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

export interface RidgelineData {
  category: string;
  values: number[];
}

export interface HorizonDataPoint {
  date: Date;
  value: number;
}

export interface BumpChartSeries {
  name: string;
  points: { time: string; rank: number }[];
}

export interface RadarSmallMultipleData {
  name: string;
  metrics: Record<string, number>;
}

export interface LargeScatterPoint {
  x: number;
  y: number;
}

export interface GroupedBarData {
  category: string;
  values: { series: string; value: number }[];
}

export interface StackedBarData {
  category: string;
  values: { [key: string]: number };
}

export interface StackedAreaDataPoint {
  date: Date;
  [key: string]: Date | number;
}

export const generateBarChartData = (): BarChartData[] => {
  const categories = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
  return categories.map((label) => ({
    label,
    value: Math.floor(seededRandom() * 100) + 20,
  }));
};

export const generateLineChartData = (): LineChartData[] => {
  const data: LineChartData[] = [];
  const startDate = new Date(2024, 0, 1);
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      value: Math.floor(seededRandom() * 50) + 30 + Math.sin(i / 3) * 20,
    });
  }
  return data;
};

export const generateAreaChartData = (): LineChartData[][] => {
  const series1 = generateLineChartData();
  const series2 = generateLineChartData().map((d) => ({
    ...d,
    value: d.value * 0.8,
  }));
  const series3 = generateLineChartData().map((d) => ({
    ...d,
    value: d.value * 0.6,
  }));
  return [series1, series2, series3];
};

export const generateScatterPlotData = (): ScatterPlotData[] => {
  const categories = ['A', 'B', 'C'];
  const data: ScatterPlotData[] = [];
  categories.forEach((category) => {
    for (let i = 0; i < 30; i++) {
      data.push({
        x: seededRandom() * 100,
        y: seededRandom() * 100,
        category,
      });
    }
  });
  return data;
};

export const generateTreeData = (): TreeNode => {
  return {
    name: 'root',
    children: [
      {
        name: 'Analytics',
        children: [
          { name: 'Dashboard', value: 3800 },
          { name: 'Reports', value: 2400 },
          { name: 'Charts', value: 2900 },
        ],
      },
      {
        name: 'Products',
        children: [
          { name: 'Electronics', value: 4200 },
          { name: 'Clothing', value: 3100 },
          { name: 'Food', value: 2800 },
        ],
      },
      {
        name: 'Marketing',
        children: [
          { name: 'Social Media', value: 2200 },
          { name: 'Email', value: 1900 },
          { name: 'SEO', value: 2600 },
        ],
      },
    ],
  };
};

export const generateNetworkData = (): {
  nodes: NetworkNode[];
  links: NetworkLink[];
} => {
  const nodes: NetworkNode[] = [
    { id: 'A', group: 1 },
    { id: 'B', group: 1 },
    { id: 'C', group: 2 },
    { id: 'D', group: 2 },
    { id: 'E', group: 3 },
    { id: 'F', group: 3 },
    { id: 'G', group: 3 },
    { id: 'H', group: 4 },
  ];

  const links: NetworkLink[] = [
    { source: 'A', target: 'B', value: 1 },
    { source: 'A', target: 'C', value: 2 },
    { source: 'B', target: 'D', value: 1 },
    { source: 'C', target: 'D', value: 3 },
    { source: 'D', target: 'E', value: 2 },
    { source: 'E', target: 'F', value: 1 },
    { source: 'E', target: 'G', value: 2 },
    { source: 'F', target: 'H', value: 1 },
    { source: 'G', target: 'H', value: 1 },
  ];

  return { nodes, links };
};

export const generateSankeyData = (): SankeyData => {
  return {
    nodes: [
      { name: 'Source A' },
      { name: 'Source B' },
      { name: 'Source C' },
      { name: 'Middle 1' },
      { name: 'Middle 2' },
      { name: 'Target X' },
      { name: 'Target Y' },
    ],
    links: [
      { source: 0, target: 3, value: 20 },
      { source: 1, target: 3, value: 15 },
      { source: 1, target: 4, value: 10 },
      { source: 2, target: 4, value: 25 },
      { source: 3, target: 5, value: 30 },
      { source: 4, target: 5, value: 15 },
      { source: 4, target: 6, value: 20 },
    ],
  };
};

export const generatePieChartData = (): BarChartData[] => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  return categories.map((label) => ({
    label,
    value: Math.floor(seededRandom() * 50) + 10,
  }));
};

export const generateHeatmapData = (): number[][] => {
  const rows = 10;
  const cols = 10;
  const data: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(seededRandom() * 100);
    }
    data.push(row);
  }
  return data;
};

const generateNormalDistribution = (count: number, mean: number, stdDev: number): number[] => {
  const values: number[] = [];

  for (let i = 0; i < count; i++) {
    const u1 = 1 - seededRandom();
    const u2 = 1 - seededRandom();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    values.push(mean + z0 * stdDev);
  }

  return values;
};

export const generateHistogramData = (): number[] => {
  return generateNormalDistribution(260, 50, 15);
};

export const generateBoxPlotData = (): number[] => {
  return [...generateNormalDistribution(220, 55, 12), 10, 12, 96, 99];
};

export const generateViolinPlotData = (): ViolinPlotData[] => {
  return [
    { category: 'Team A', values: generateNormalDistribution(140, 45, 10) },
    { category: 'Team B', values: generateNormalDistribution(140, 58, 12) },
    { category: 'Team C', values: generateNormalDistribution(140, 68, 9) },
  ];
};

export const generateBubbleChartData = (): BubblePointData[] => {
  const categories = ['Enterprise', 'SMB', 'Consumer'];
  const points: BubblePointData[] = [];

  categories.forEach((category) => {
    for (let i = 0; i < 14; i++) {
      points.push({
        label: `${category} ${i + 1}`,
        x: seededRandom() * 100,
        y: seededRandom() * 100,
        size: seededRandom() * 120 + 20,
        category,
      });
    }
  });

  return points;
};

export const generateWaterfallData = (): WaterfallData[] => {
  return [
    { label: 'Starting Revenue', value: 120 },
    { label: 'New Sales', value: 45 },
    { label: 'Refunds', value: -18 },
    { label: 'Upsells', value: 30 },
    { label: 'Discounts', value: -12 },
    { label: 'Net Impact', value: 22 },
  ];
};

export const generateFunnelData = (): FunnelStageData[] => {
  return [
    { stage: 'Visitors', value: 12000 },
    { stage: 'Sign-ups', value: 4200 },
    { stage: 'Activated', value: 2500 },
    { stage: 'Trial Users', value: 1400 },
    { stage: 'Paid Users', value: 820 },
  ];
};

export const generateCalendarHeatmapData = (): CalendarHeatmapData[] => {
  const days = 140;
  const start = new Date();
  start.setDate(start.getDate() - days + 1);

  const data: CalendarHeatmapData[] = [];
  for (let index = 0; index < days; index++) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const weeklyPattern = 40 + Math.sin((index / 7) * Math.PI) * 20;
    const randomNoise = seededRandom() * 35;
    data.push({
      date,
      value: Math.max(0, Math.round(weeklyPattern + randomNoise)),
    });
  }

  return data;
};

export const generateLollipopData = (): LollipopData[] => {
  const labels = ['North', 'South', 'East', 'West', 'Central', 'Online', 'Retail', 'Partner'];
  return labels.map((label) => ({
    label,
    value: Math.floor(seededRandom() * 90) + 10,
  }));
};

export const generateCandlestickData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let previousClose = 100;

  for (let day = 0; day < 35; day++) {
    const date = new Date(2025, 0, day + 1);
    const open = previousClose + (seededRandom() * 6 - 3);
    const close = open + (seededRandom() * 8 - 4);
    const high = Math.max(open, close) + seededRandom() * 3.5;
    const low = Math.min(open, close) - seededRandom() * 3.5;

    data.push({
      date,
      open,
      high,
      low,
      close,
    });

    previousClose = close;
  }

  return data;
};

export const generateStreamgraphData = (): StreamgraphDataPoint[] => {
  const seriesNames = ['Search', 'Social', 'Email', 'Referral', 'Ads'];
  const startDate = new Date(2025, 0, 1);
  const points: StreamgraphDataPoint[] = [];

  for (let i = 0; i < 30; i++) {
    const point: StreamgraphDataPoint = {
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
    };

    seriesNames.forEach((name, index) => {
      const baseline = 20 + index * 8;
      const seasonal = Math.sin(i / (2 + index * 0.3)) * 12;
      const noise = seededRandom() * 10;
      point[name] = Math.max(2, baseline + seasonal + noise);
    });

    points.push(point);
  }

  return points;
};

export const generateParallelCoordinatesData = (): ParallelCoordinatesData[] => {
  const rows: ParallelCoordinatesData[] = [];

  for (let index = 0; index < 20; index++) {
    rows.push({
      name: `Sample ${index + 1}`,
      latency: seededRandom() * 200 + 30,
      throughput: seededRandom() * 800 + 200,
      reliability: seededRandom() * 20 + 80,
      utilization: seededRandom() * 60 + 30,
      efficiency: seededRandom() * 50 + 45,
    });
  }

  return rows;
};

export const generateChordData = (): ChordData => {
  const labels = ['Sales', 'Marketing', 'Product', 'Support', 'Finance'];

  return {
    labels,
    matrix: [
      [0, 25, 18, 12, 20],
      [22, 0, 16, 10, 14],
      [14, 11, 0, 17, 9],
      [10, 8, 20, 0, 13],
      [18, 12, 10, 9, 0],
    ],
  };
};

export const generateHexbinData = (): HexbinPointData[] => {
  const points: HexbinPointData[] = [];

  const clusterCenters = [
    { x: 25, y: 35 },
    { x: 55, y: 60 },
    { x: 75, y: 30 },
  ];

  clusterCenters.forEach((center) => {
    for (let index = 0; index < 120; index++) {
      points.push({
        x: center.x + (seededRandom() - 0.5) * 20,
        y: center.y + (seededRandom() - 0.5) * 20,
      });
    }
  });

  return points;
};

export const generateGeoRegionData = (): GeoRegionData[] => {
  return [
    {
      id: 'northwest',
      name: 'Northwest',
      points: [
        [10, 10],
        [36, 10],
        [34, 30],
        [14, 32],
      ],
      value: 72,
      population: 680,
    },
    {
      id: 'north',
      name: 'North',
      points: [
        [38, 10],
        [62, 12],
        [60, 30],
        [36, 30],
      ],
      value: 54,
      population: 530,
    },
    {
      id: 'northeast',
      name: 'Northeast',
      points: [
        [64, 12],
        [90, 14],
        [86, 34],
        [62, 30],
      ],
      value: 81,
      population: 760,
    },
    {
      id: 'west',
      name: 'West',
      points: [
        [12, 34],
        [34, 34],
        [32, 58],
        [10, 56],
      ],
      value: 48,
      population: 450,
    },
    {
      id: 'central',
      name: 'Central',
      points: [
        [36, 32],
        [62, 32],
        [60, 58],
        [34, 58],
      ],
      value: 66,
      population: 910,
    },
    {
      id: 'east',
      name: 'East',
      points: [
        [64, 34],
        [88, 36],
        [86, 58],
        [62, 58],
      ],
      value: 41,
      population: 390,
    },
    {
      id: 'southwest',
      name: 'Southwest',
      points: [
        [14, 60],
        [38, 60],
        [36, 86],
        [12, 84],
      ],
      value: 35,
      population: 320,
    },
    {
      id: 'southeast',
      name: 'Southeast',
      points: [
        [40, 60],
        [86, 60],
        [82, 86],
        [38, 86],
      ],
      value: 77,
      population: 840,
    },
  ];
};

const pointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

export const generateDotDensityMapData = (): DotDensityMapData => {
  const regions = generateGeoRegionData();
  const dots: DotDensityPoint[] = [];

  regions.forEach((region) => {
    const minX = Math.min(...region.points.map((point) => point[0]));
    const maxX = Math.max(...region.points.map((point) => point[0]));
    const minY = Math.min(...region.points.map((point) => point[1]));
    const maxY = Math.max(...region.points.map((point) => point[1]));

    const targetDots = Math.max(20, Math.round(region.population / 12));
    let created = 0;
    let attempts = 0;

    while (created < targetDots && attempts < targetDots * 20) {
      attempts += 1;
      const x = minX + seededRandom() * (maxX - minX);
      const y = minY + seededRandom() * (maxY - minY);
      if (pointInPolygon([x, y], region.points)) {
        dots.push({ x, y, regionId: region.id });
        created += 1;
      }
    }
  });

  return { regions, dots };
};

export const generateAlluvialData = (): AlluvialData => {
  return {
    nodes: [
      { name: 'Discovery: Search' },
      { name: 'Discovery: Social' },
      { name: 'Discovery: Referral' },
      { name: 'Engage: Landing' },
      { name: 'Engage: Signup' },
      { name: 'Convert: Trial' },
      { name: 'Convert: Paid' },
    ],
    links: [
      { source: 0, target: 3, value: 60 },
      { source: 1, target: 3, value: 45 },
      { source: 2, target: 3, value: 25 },
      { source: 3, target: 4, value: 95 },
      { source: 3, target: 5, value: 20 },
      { source: 4, target: 5, value: 70 },
      { source: 5, target: 6, value: 48 },
    ],
  };
};

export const generateRidgelineData = (): RidgelineData[] => {
  return [
    { category: 'Product A', values: generateNormalDistribution(180, 45, 10) },
    { category: 'Product B', values: generateNormalDistribution(180, 55, 11) },
    { category: 'Product C', values: generateNormalDistribution(180, 62, 9) },
    { category: 'Product D', values: generateNormalDistribution(180, 50, 12) },
    { category: 'Product E', values: generateNormalDistribution(180, 70, 8) },
  ];
};

export const generateHorizonData = (): HorizonDataPoint[] => {
  const start = new Date(2025, 0, 1);
  return Array.from({ length: 60 }, (_, index) => ({
    date: new Date(start.getTime() + index * 24 * 60 * 60 * 1000),
    value: Math.sin(index / 5) * 35 + Math.cos(index / 9) * 15 + (seededRandom() * 12 - 6),
  }));
};

export const generateBumpChartData = (): BumpChartSeries[] => {
  const timePoints = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'];

  return names.map((name, nameIndex) => ({
    name,
    points: timePoints.map((time, timeIndex) => ({
      time,
      rank: ((nameIndex + timeIndex + Math.floor(seededRandom() * 3)) % names.length) + 1,
    })),
  }));
};

export const generateRadarSmallMultiplesData = (): RadarSmallMultipleData[] => {
  const entities = ['Cluster A', 'Cluster B', 'Cluster C', 'Cluster D', 'Cluster E', 'Cluster F'];
  return entities.map((name) => ({
    name,
    metrics: {
      speed: seededRandom() * 60 + 40,
      quality: seededRandom() * 50 + 45,
      cost: seededRandom() * 70 + 20,
      reliability: seededRandom() * 30 + 65,
      coverage: seededRandom() * 55 + 35,
    },
  }));
};

export const generateLargeScatterData = (): LargeScatterPoint[] => {
  return Array.from({ length: 12000 }, () => ({
    x: seededRandom() * 100,
    y: seededRandom() * 100,
  }));
};

export const generateGroupedBarData = (): GroupedBarData[] => {
  const categories = ['Q1', 'Q2', 'Q3', 'Q4'];
  const series = ['Product A', 'Product B', 'Product C'];

  return categories.map((category) => ({
    category,
    values: series.map((s) => ({
      series: s,
      value: Math.floor(seededRandom() * 80) + 20,
    })),
  }));
};

export const generateStackedBarData = (): StackedBarData[] => {
  const categories = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
  const series = ['Sales', 'Marketing', 'Operations', 'Support'];

  return categories.map((category) => {
    const values: { [key: string]: number | string } = { category };
    series.forEach((s) => {
      values[s] = Math.floor(seededRandom() * 50) + 10;
    });
    return { category, values: values as { [key: string]: number } } as StackedBarData;
  });
};

export const generateStackedAreaData = (): StackedAreaDataPoint[] => {
  const seriesNames = ['Desktop', 'Mobile', 'Tablet'];
  const startDate = new Date(2025, 0, 1);
  const points: StackedAreaDataPoint[] = [];

  for (let i = 0; i < 30; i++) {
    const point: StackedAreaDataPoint = {
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
    };

    seriesNames.forEach((name, index) => {
      const baseline = 15 + index * 10;
      const trend = i * 0.5;
      const seasonal = Math.sin(i / 4) * 8;
      const noise = seededRandom() * 8;
      point[name] = Math.max(5, baseline + trend + seasonal + noise);
    });

    points.push(point);
  }

  return points;
};

export interface WaffleData {
  category: string;
  value: number;
  color?: string;
}

export const generateWaffleData = (): WaffleData[] => {
  return [
    { category: 'Completed', value: 65, color: '#4caf50' },
    { category: 'In Progress', value: 20, color: '#ff9800' },
    { category: 'Pending', value: 15, color: '#2196f3' },
  ];
};

export interface SparklineData {
  label: string;
  values: number[];
}

export const generateSparklineData = (): SparklineData[] => {
  const generateValues = () =>
    Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i / 3) * 20 + seededRandom() * 15);

  return [
    { label: 'Revenue', values: generateValues() },
    { label: 'Users', values: generateValues() },
    { label: 'Sessions', values: generateValues() },
    { label: 'Conversions', values: generateValues() },
    { label: 'Engagement', values: generateValues() },
  ];
};

export interface SmallMultipleData {
  name: string;
  values: { x: number; y: number }[];
}

export const generateSmallMultiplesData = (): SmallMultipleData[] => {
  const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];

  return regions.map((name) => ({
    name,
    values: Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: 30 + Math.sin(i / 3) * 15 + seededRandom() * 20,
    })),
  }));
};

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
}

export const generateGanttData = (): GanttTask[] => {
  const startDate = new Date(2025, 0, 1);
  return [
    {
      id: '1',
      name: 'Planning',
      start: new Date(2025, 0, 1),
      end: new Date(2025, 0, 15),
      progress: 100,
    },
    {
      id: '2',
      name: 'Design',
      start: new Date(2025, 0, 10),
      end: new Date(2025, 0, 30),
      progress: 80,
      dependencies: ['1'],
    },
    {
      id: '3',
      name: 'Development',
      start: new Date(2025, 0, 25),
      end: new Date(2025, 2, 10),
      progress: 45,
      dependencies: ['2'],
    },
    {
      id: '4',
      name: 'Testing',
      start: new Date(2025, 2, 1),
      end: new Date(2025, 2, 20),
      progress: 30,
      dependencies: ['3'],
    },
    {
      id: '5',
      name: 'Deployment',
      start: new Date(2025, 2, 15),
      end: new Date(2025, 2, 25),
      progress: 0,
      dependencies: ['4'],
    },
  ];
};

export interface BulletData {
  title: string;
  subtitle?: string;
  ranges: number[];
  measures: number[];
  markers: number[];
}

export const generateBulletData = (): BulletData[] => {
  return [
    {
      title: 'Revenue',
      subtitle: 'US$ (thousands)',
      ranges: [150, 225, 300],
      measures: [220, 270],
      markers: [250],
    },
    {
      title: 'Profit',
      subtitle: '%',
      ranges: [20, 25, 30],
      measures: [23, 26],
      markers: [27],
    },
    {
      title: 'Satisfaction',
      subtitle: 'out of 5',
      ranges: [3.5, 4.0, 4.5],
      measures: [4.2],
      markers: [4.3],
    },
    {
      title: 'Market Share',
      subtitle: '%',
      ranges: [15, 25, 35],
      measures: [28, 30],
      markers: [32],
    },
  ];
};

export interface SlopeData {
  label: string;
  start: number;
  end: number;
}

export const generateSlopeData = (): SlopeData[] => {
  return [
    { label: 'Product A', start: 85, end: 92 },
    { label: 'Product B', start: 72, end: 68 },
    { label: 'Product C', start: 90, end: 95 },
    { label: 'Product D', start: 65, end: 78 },
    { label: 'Product E', start: 78, end: 75 },
    { label: 'Product F', start: 60, end: 82 },
  ];
};

export interface BeeswarmData {
  category: string;
  values: number[];
}

export const generateBeeswarmData = (): BeeswarmData[] => {
  return [
    {
      category: 'Group A',
      values: generateNormalDistribution(50, 50, 10),
    },
    {
      category: 'Group B',
      values: generateNormalDistribution(50, 65, 12),
    },
    {
      category: 'Group C',
      values: generateNormalDistribution(50, 55, 8),
    },
  ];
};

export interface ArcNode {
  id: string;
  label: string;
}

export interface ArcLink {
  source: string;
  target: string;
  value?: number;
}

export interface ArcDiagramData {
  nodes: ArcNode[];
  links: ArcLink[];
}

export const generateArcDiagramData = (): ArcDiagramData => {
  return {
    nodes: [
      { id: 'A', label: 'Alpha' },
      { id: 'B', label: 'Beta' },
      { id: 'C', label: 'Gamma' },
      { id: 'D', label: 'Delta' },
      { id: 'E', label: 'Epsilon' },
      { id: 'F', label: 'Zeta' },
    ],
    links: [
      { source: 'A', target: 'B', value: 3 },
      { source: 'A', target: 'D', value: 5 },
      { source: 'B', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 4 },
      { source: 'D', target: 'E', value: 3 },
      { source: 'E', target: 'F', value: 2 },
      { source: 'B', target: 'F', value: 4 },
    ],
  };
};

export interface MarimekkoData {
  category: string;
  segments: { name: string; value: number }[];
}

export const generateMarimekkoData = (): MarimekkoData[] => {
  return [
    {
      category: 'Region A',
      segments: [
        { name: 'Product X', value: 45 },
        { name: 'Product Y', value: 30 },
        { name: 'Product Z', value: 25 },
      ],
    },
    {
      category: 'Region B',
      segments: [
        { name: 'Product X', value: 30 },
        { name: 'Product Y', value: 50 },
        { name: 'Product Z', value: 20 },
      ],
    },
    {
      category: 'Region C',
      segments: [
        { name: 'Product X', value: 35 },
        { name: 'Product Y', value: 25 },
        { name: 'Product Z', value: 40 },
      ],
    },
    {
      category: 'Region D',
      segments: [
        { name: 'Product X', value: 50 },
        { name: 'Product Y', value: 35 },
        { name: 'Product Z', value: 15 },
      ],
    },
  ];
};

export interface VennSet {
  id: string;
  label: string;
  size: number;
}

export interface VennIntersection {
  sets: string[];
  size: number;
}

export interface VennDiagramData {
  sets: VennSet[];
  intersections: VennIntersection[];
}

export const generateVennData = (): VennDiagramData => {
  return {
    sets: [
      { id: 'A', label: 'Set A', size: 45 },
      { id: 'B', label: 'Set B', size: 38 },
      { id: 'C', label: 'Set C', size: 42 },
    ],
    intersections: [
      { sets: ['A', 'B'], size: 15 },
      { sets: ['B', 'C'], size: 12 },
      { sets: ['A', 'C'], size: 10 },
      { sets: ['A', 'B', 'C'], size: 5 },
    ],
  };
};

export interface ContourPoint {
  x: number;
  y: number;
  value: number;
}

export const generateContourData = (): ContourPoint[] => {
  const points: ContourPoint[] = [];
  const clusters = [
    { cx: 30, cy: 30, intensity: 80 },
    { cx: 70, cy: 60, intensity: 90 },
    { cx: 50, cy: 80, intensity: 70 },
  ];

  clusters.forEach((cluster) => {
    for (let i = 0; i < 30; i++) {
      const angle = seededRandom() * 2 * Math.PI;
      const radius = seededRandom() * 15;
      points.push({
        x: cluster.cx + radius * Math.cos(angle),
        y: cluster.cy + radius * Math.sin(angle),
        value: cluster.intensity - radius * 2 + seededRandom() * 10,
      });
    }
  });

  return points;
};

export interface PolarAreaData {
  label: string;
  value: number;
}

export const generatePolarAreaData = (): PolarAreaData[] => {
  return [
    { label: 'Q1', value: 65 },
    { label: 'Q2', value: 48 },
    { label: 'Q3', value: 72 },
    { label: 'Q4', value: 55 },
    { label: 'Q5', value: 80 },
    { label: 'Q6', value: 42 },
    { label: 'Q7', value: 58 },
    { label: 'Q8', value: 68 },
  ];
};

export interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}

export const generatePyramidData = (): PyramidData[] => {
  return [
    { ageGroup: '0-10', male: 8200, female: 7800 },
    { ageGroup: '11-20', male: 9500, female: 9100 },
    { ageGroup: '21-30', male: 11200, female: 10800 },
    { ageGroup: '31-40', male: 10500, female: 10200 },
    { ageGroup: '41-50', male: 9800, female: 9600 },
    { ageGroup: '51-60', male: 7500, female: 7800 },
    { ageGroup: '61-70', male: 5200, female: 5800 },
    { ageGroup: '71+', male: 3100, female: 3800 },
  ];
};

export interface TimelineEvent {
  id: string;
  label: string;
  date: Date;
  description?: string;
  category?: string;
}

export const generateTimelineData = (): TimelineEvent[] => {
  return [
    {
      id: '1',
      label: 'Project Kickoff',
      date: new Date(2025, 0, 5),
      description: 'Initial planning meeting',
      category: 'milestone',
    },
    {
      id: '2',
      label: 'Design Complete',
      date: new Date(2025, 1, 10),
      description: 'UI/UX designs approved',
      category: 'milestone',
    },
    {
      id: '3',
      label: 'Beta Release',
      date: new Date(2025, 2, 15),
      description: 'First beta version released',
      category: 'release',
    },
    {
      id: '4',
      label: 'User Testing',
      date: new Date(2025, 2, 25),
      description: 'Feedback collection phase',
      category: 'milestone',
    },
    {
      id: '5',
      label: 'Launch',
      date: new Date(2025, 3, 10),
      description: 'Official product launch',
      category: 'release',
    },
  ];
};

export interface FlowLocation {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface FlowConnection {
  source: string;
  target: string;
  value: number;
}

export interface FlowMapData {
  locations: FlowLocation[];
  flows: FlowConnection[];
}

export const generateFlowMapData = (): FlowMapData => {
  return {
    locations: [
      { id: 'NYC', name: 'New York', x: 75, y: 40 },
      { id: 'LA', name: 'Los Angeles', x: 15, y: 50 },
      { id: 'CHI', name: 'Chicago', x: 60, y: 35 },
      { id: 'HOU', name: 'Houston', x: 50, y: 70 },
      { id: 'MIA', name: 'Miami', x: 80, y: 75 },
    ],
    flows: [
      { source: 'NYC', target: 'LA', value: 45 },
      { source: 'NYC', target: 'CHI', value: 30 },
      { source: 'CHI', target: 'HOU', value: 25 },
      { source: 'LA', target: 'HOU', value: 20 },
      { source: 'HOU', target: 'MIA', value: 35 },
      { source: 'NYC', target: 'MIA', value: 40 },
    ],
  };
};

export interface VoronoiPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

export const generateVoronoiData = (): VoronoiPoint[] => {
  return Array.from({ length: 25 }, (_, i) => ({
    x: seededRandom() * 100,
    y: seededRandom() * 100,
    label: `P${i + 1}`,
    value: seededRandom() * 100,
  }));
};
