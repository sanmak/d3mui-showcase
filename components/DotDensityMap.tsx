'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DotDensityMapData } from '@/utils/mockData';

interface DotDensityMapProps {
  data: DotDensityMapData;
  width?: number;
  height?: number;
}

const toPath = (
  points: [number, number][],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number
): string => {
  return (
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${scaleX(point[0])},${scaleY(point[1])}`)
      .join(' ') + ' Z'
  );
};

export default function DotDensityMap({ data, width = 760, height = 440 }: DotDensityMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.regions.length) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const scaleY = d3.scaleLinear().domain([0, 100]).range([0, innerHeight]);

    g.selectAll('.region-outline')
      .data(data.regions)
      .join('path')
      .attr('d', (d) => toPath(d.points, scaleX, scaleY))
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#cfd8dc')
      .attr('stroke-width', 1.5);

    g.selectAll('.density-dot')
      .data(data.dots)
      .join('circle')
      .attr('class', 'density-dot')
      .attr('cx', (d) => scaleX(d.x))
      .attr('cy', (d) => scaleY(d.y))
      .attr('r', 0)
      .attr('fill', '#6a1b9a')
      .attr('fill-opacity', 0.65)
      .transition()
      .duration(650)
      .delay((_, index) => index * 1.5)
      .attr('r', 1.6);

    const legend = g
      .append('g')
      .attr('transform', `translate(${innerWidth - 180},${innerHeight - 40})`);
    legend
      .append('circle')
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('r', 2)
      .attr('fill', '#6a1b9a')
      .attr('fill-opacity', 0.65);
    legend
      .append('text')
      .attr('x', 16)
      .attr('y', 10)
      .style('font-size', '12px')
      .style('fill', '#37474f')
      .text('Each dot ≈ population sample');
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
