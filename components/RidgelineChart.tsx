'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RidgelineData } from '@/utils/mockData';

interface RidgelineChartProps {
  data: RidgelineData[];
  width?: number;
  height?: number;
}

export default function RidgelineChart({ data, width = 860, height = 460 }: RidgelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 30, right: 30, bottom: 40, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const categories = data.map((d) => d.category);
    const allValues = data.flatMap((d) => d.values);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(allValues) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3.scaleBand().domain(categories).range([0, innerHeight]).padding(0.25);
    const ridgeHeight = y.bandwidth();

    const color = d3.scaleOrdinal<string>().domain(categories).range(d3.schemeTableau10);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => d.y)
      .curve(d3.curveCatmullRom);

    const area = d3
      .area<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y0(ridgeHeight)
      .y1((d) => d.y)
      .curve(d3.curveCatmullRom);

    data.forEach((series) => {
      const histogram = d3
        .bin<number, number>()
        .domain(x.domain() as [number, number])
        .thresholds(26)(series.values);

      const density = histogram.map((bin) => ({
        x: ((bin.x0 ?? 0) + (bin.x1 ?? 0)) / 2,
        y: ridgeHeight - (bin.length / (d3.max(histogram, (h) => h.length) || 1)) * ridgeHeight,
      }));

      const group = g.append('g').attr('transform', `translate(0,${y(series.category) || 0})`);

      group
        .append('path')
        .datum(density)
        .attr('d', area)
        .attr('fill', color(series.category))
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 0.55);

      group
        .append('path')
        .datum(density)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', color(series.category))
        .attr('stroke-width', 1.8)
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 0.95);
    });

    g.append('g').call(d3.axisLeft(y));
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
