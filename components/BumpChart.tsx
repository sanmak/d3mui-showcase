'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BumpChartSeries } from '@/utils/mockData';

interface BumpChartProps {
  data: BumpChartSeries[];
  width?: number;
  height?: number;
}

export default function BumpChart({ data, width = 860, height = 420 }: BumpChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 30, right: 80, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const times = data[0].points.map((p) => p.time);
    const maxRank = d3.max(data.flatMap((series) => series.points.map((point) => point.rank))) || 1;

    const x = d3.scalePoint().domain(times).range([0, innerWidth]).padding(0.2);
    const y = d3.scaleLinear().domain([1, maxRank]).range([0, innerHeight]);
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((series) => series.name))
      .range(d3.schemeTableau10);

    const line = d3
      .line<{ time: string; rank: number }>()
      .x((d) => x(d.time) || 0)
      .y((d) => y(d.rank))
      .curve(d3.curveMonotoneX);

    data.forEach((series, index) => {
      g.append('path')
        .datum(series.points)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', color(series.name))
        .attr('stroke-width', 3)
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .delay(index * 80)
        .attr('opacity', 0.9);

      const lastPoint = series.points[series.points.length - 1];
      g.append('text')
        .attr('x', (x(lastPoint.time) || 0) + 8)
        .attr('y', y(lastPoint.rank) + 4)
        .style('font-size', '11px')
        .style('fill', color(series.name))
        .text(series.name);
    });

    g.append('g').call(
      d3
        .axisLeft(y)
        .ticks(maxRank)
        .tickFormat((d) => `#${d}`)
    );
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
