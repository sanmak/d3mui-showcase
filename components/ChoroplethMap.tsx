'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GeoRegionData } from '@/utils/mockData';

interface ChoroplethMapProps {
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

export default function ChoroplethMap({ data, width = 760, height = 440 }: ChoroplethMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 80, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const scaleY = d3.scaleLinear().domain([0, 100]).range([0, innerHeight]);

    const color = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([d3.min(data, (d) => d.value) || 0, d3.max(data, (d) => d.value) || 100]);

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

    g.selectAll('.region')
      .data(data)
      .join('path')
      .attr('class', 'region')
      .attr('d', (d) => toPath(d.points, scaleX, scaleY))
      .attr('fill', '#eceff1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#263238').attr('stroke-width', 2.5);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Index: ${d.value.toFixed(0)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 50)
      .attr('fill', (d) => color(d.value));

    g.selectAll('.region-label')
      .data(data)
      .join('text')
      .attr('x', (d) => scaleX(d3.mean(d.points, (p) => p[0]) || 0))
      .attr('y', (d) => scaleY(d3.mean(d.points, (p) => p[1]) || 0))
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#263238')
      .text((d) => d.name);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
