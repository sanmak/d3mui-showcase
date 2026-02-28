'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface SmallMultipleData {
  name: string;
  values: { x: number; y: number }[];
}

interface SmallMultiplesGridProps {
  data: SmallMultipleData[];
  width?: number;
  height?: number;
  columns?: number;
  chartType?: 'line' | 'area' | 'scatter';
}

export default function SmallMultiplesGrid({
  data,
  width = 800,
  height = 600,
  columns = 3,
  chartType = 'line',
}: SmallMultiplesGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 30, right: 10, bottom: 30, left: 40 };
    const padding = 20;
    const rows = Math.ceil(data.length / columns);

    const cellWidth = (width - padding * (columns + 1)) / columns;
    const cellHeight = (height - padding * (rows + 1)) / rows;

    const innerWidth = cellWidth - margin.left - margin.right;
    const innerHeight = cellHeight - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    // Find global domains for consistent scales
    const allXValues = data.flatMap((d) => d.values.map((v) => v.x));
    const allYValues = data.flatMap((d) => d.values.map((v) => v.y));

    const xDomain = [d3.min(allXValues) || 0, d3.max(allXValues) || 100];
    const yDomain = [d3.min(allYValues) || 0, d3.max(allYValues) || 100];

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Create each small multiple
    data.forEach((d, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const xPos = padding + col * (cellWidth + padding);
      const yPos = padding + row * (cellHeight + padding);

      const g = svg
        .append('g')
        .attr('transform', `translate(${xPos + margin.left},${yPos + margin.top})`);

      // Scales
      const x = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
      const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);

      // Background
      g.append('rect')
        .attr('x', -margin.left)
        .attr('y', -margin.top)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', '#f9f9f9')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('rx', 4);

      // Title
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text(d.name);

      if (chartType === 'line') {
        // Line chart
        const line = d3
          .line<{ x: number; y: number }>()
          .x((point) => x(point.x))
          .y((point) => y(point.y))
          .curve(d3.curveMonotoneX);

        const path = g
          .append('path')
          .datum(d.values)
          .attr('fill', 'none')
          .attr('stroke', '#1976d2')
          .attr('stroke-width', 2)
          .attr('d', line);

        const pathLength = (path.node() as SVGPathElement).getTotalLength();

        path
          .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(800)
          .delay(i * 100)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
      } else if (chartType === 'area') {
        // Area chart
        const area = d3
          .area<{ x: number; y: number }>()
          .x((point) => x(point.x))
          .y0(innerHeight)
          .y1((point) => y(point.y))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(d.values)
          .attr('fill', '#1976d2')
          .attr('fill-opacity', 0.6)
          .attr('d', area)
          .style('clip-path', 'inset(0 100% 0 0)')
          .transition()
          .duration(800)
          .delay(i * 100)
          .style('clip-path', 'inset(0 0% 0 0)');
      } else if (chartType === 'scatter') {
        // Scatter plot
        g.selectAll('circle')
          .data(d.values)
          .join('circle')
          .attr('cx', (point) => x(point.x))
          .attr('cy', (point) => y(point.y))
          .attr('r', 0)
          .attr('fill', '#1976d2')
          .attr('opacity', 0.7)
          .transition()
          .duration(600)
          .delay((_, j) => i * 100 + j * 20)
          .attr('r', 3);
      }

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(3).tickSize(-innerHeight).tickFormat(d3.format('.0f')))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g.selectAll('.tick line').attr('stroke', '#ddd').attr('stroke-dasharray', '2,2')
        );

      g.append('g')
        .call(d3.axisLeft(y).ticks(3).tickSize(-innerWidth).tickFormat(d3.format('.0f')))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g.selectAll('.tick line').attr('stroke', '#ddd').attr('stroke-dasharray', '2,2')
        );

      // Interaction overlay
      g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .on('mouseover', (event) => {
          tooltip
            .style('opacity', 1)
            .html(`<strong>${d.name}</strong><br/>${d.values.length} data points`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, columns, chartType]);

  return <svg ref={svgRef}></svg>;
}
