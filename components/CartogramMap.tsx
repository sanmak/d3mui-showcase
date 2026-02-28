'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GeoRegionData } from '@/utils/mockData';

interface CartogramMapProps {
  data: GeoRegionData[];
  width?: number;
  height?: number;
}

const toPath = (points: [number, number][]): string =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`).join(' ') +
  ' Z';

export default function CartogramMap({ data, width = 760, height = 440 }: CartogramMapProps) {
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

    const valueExtent = d3.extent(data, (d) => d.value) as [number, number];
    const distortion = d3.scaleLinear().domain(valueExtent).range([0.8, 1.45]);
    const color = d3.scaleSequential(d3.interpolateOranges).domain(valueExtent);

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

    const transformed = data.map((region) => {
      const centroidX = d3.mean(region.points, (point) => point[0]) || 0;
      const centroidY = d3.mean(region.points, (point) => point[1]) || 0;
      const factor = distortion(region.value);

      const scaledPoints = region.points.map((point) => {
        const dx = point[0] - centroidX;
        const dy = point[1] - centroidY;
        return [scaleX(centroidX + dx * factor), scaleY(centroidY + dy * factor)] as [
          number,
          number,
        ];
      });

      return {
        ...region,
        scaledPoints,
      };
    });

    g.selectAll('.cartogram-region')
      .data(transformed)
      .join('path')
      .attr('class', 'cartogram-region')
      .attr('d', (d) => toPath(d.scaledPoints))
      .attr('fill', '#ffe0b2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#e65100').attr('stroke-width', 2.5);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Distortion Value: ${d.value.toFixed(0)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((_, index) => index * 60)
      .attr('fill', (d) => color(d.value));

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
