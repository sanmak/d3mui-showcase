'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GeoRegionData } from '@/utils/mockData';

interface ProportionalSymbolMapProps {
  data: GeoRegionData[];
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

export default function ProportionalSymbolMap({
  data,
  width = 760,
  height = 440,
}: ProportionalSymbolMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const scaleY = d3.scaleLinear().domain([0, 100]).range([0, innerHeight]);

    const radius = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.population) || 1000])
      .range([4, 28]);

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    g.selectAll('.region-outline')
      .data(data)
      .join('path')
      .attr('d', (d) => toPath(d.points, scaleX, scaleY))
      .attr('fill', '#eceff1')
      .attr('stroke', '#cfd8dc')
      .attr('stroke-width', 1.5);

    g.selectAll('.symbol')
      .data(data)
      .join('circle')
      .attr('class', 'symbol')
      .attr('cx', (d) => scaleX(d3.mean(d.points, (p) => p[0]) || 0))
      .attr('cy', (d) => scaleY(d3.mean(d.points, (p) => p[1]) || 0))
      .attr('r', 0)
      .attr('fill', '#1976d2')
      .attr('fill-opacity', 0.55)
      .attr('stroke', '#0d47a1')
      .attr('stroke-width', 1.2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill-opacity', 0.8);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Population: ${d.population.toLocaleString()}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill-opacity', 0.55);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 60)
      .attr('r', (d) => radius(d.population));

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
