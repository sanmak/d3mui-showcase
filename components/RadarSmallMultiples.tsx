'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RadarSmallMultipleData } from '@/utils/mockData';

interface RadarSmallMultiplesProps {
  data: RadarSmallMultipleData[];
  width?: number;
  height?: number;
}

export default function RadarSmallMultiples({
  data,
  width = 900,
  height = 520,
}: RadarSmallMultiplesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const metrics = Object.keys(data[0].metrics);
    const cols = 3;
    const rows = Math.ceil(data.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const radius = Math.min(cellWidth, cellHeight) * 0.32;

    const maxMetric = d3.max(data.flatMap((d) => Object.values(d.metrics))) || 1;
    const rScale = d3.scaleLinear().domain([0, maxMetric]).range([0, radius]);
    const angle = d3
      .scaleLinear()
      .domain([0, metrics.length])
      .range([0, Math.PI * 2]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.name))
      .range(d3.schemeTableau10);

    data.forEach((series, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const centerX = col * cellWidth + cellWidth / 2;
      const centerY = row * cellHeight + cellHeight / 2 + 8;

      const group = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

      d3.range(1, 5).forEach((step) => {
        group
          .append('circle')
          .attr('r', (radius * step) / 4)
          .attr('fill', 'none')
          .attr('stroke', '#eceff1');
      });

      metrics.forEach((metric, metricIndex) => {
        const a = angle(metricIndex);
        const x = Math.cos(a - Math.PI / 2) * radius;
        const y = Math.sin(a - Math.PI / 2) * radius;
        group
          .append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', '#cfd8dc');
        group
          .append('text')
          .attr('x', x * 1.12)
          .attr('y', y * 1.12)
          .attr('text-anchor', 'middle')
          .style('font-size', '9px')
          .style('fill', '#546e7a')
          .text(metric);
      });

      const points = metrics.map((metric, metricIndex) => {
        const a = angle(metricIndex);
        const r = rScale(series.metrics[metric]);
        return [Math.cos(a - Math.PI / 2) * r, Math.sin(a - Math.PI / 2) * r] as [number, number];
      });

      const path = d3.line<[number, number]>().curve(d3.curveLinearClosed)(points);

      group
        .append('path')
        .attr('d', path)
        .attr('fill', color(series.name))
        .attr('fill-opacity', 0)
        .attr('stroke', color(series.name))
        .attr('stroke-width', 1.8)
        .transition()
        .duration(700)
        .attr('fill-opacity', 0.35);

      group
        .append('text')
        .attr('x', 0)
        .attr('y', -radius - 16)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#263238')
        .text(series.name);
    });
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
