'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface VoronoiPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

interface VoronoiDiagramProps {
  data: VoronoiPoint[];
  width?: number;
  height?: number;
}

export default function VoronoiDiagram({ data, width = 700, height = 600 }: VoronoiDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xExtent = d3.extent(data, (d) => d.x) as [number, number];
    const yExtent = d3.extent(data, (d) => d.y) as [number, number];

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice();

    const y = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice();

    // Map data to screen coordinates
    const points: [number, number][] = data.map((d) => [x(d.x), y(d.y)]);

    // Create Delaunay triangulation
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, innerWidth, innerHeight]);

    // Color scale
    const colorScale = data.some((d) => d.value !== undefined)
      ? d3
          .scaleSequential(d3.interpolatePlasma)
          .domain([
            d3.min(data, (d) => d.value || 0) || 0,
            d3.max(data, (d) => d.value || 0) || 100,
          ])
      : null;

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

    // Draw Voronoi cells
    data.forEach((point, i) => {
      const cell = voronoi.cellPolygon(i);
      if (!cell) return;

      g.append('path')
        .attr('d', `M${cell.join('L')}Z`)
        .attr('fill', colorScale ? colorScale(point.value || 0) : '#e3f2fd')
        .attr('stroke', '#1976d2')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .on('mouseover', function (event) {
          d3.select(this)
            .attr('fill', colorScale ? colorScale(point.value || 0) : '#bbdefb')
            .attr('stroke-width', 3);
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${point.label || `Point ${i + 1}`}</strong><br/>X: ${point.x.toFixed(2)}<br/>Y: ${point.y.toFixed(2)}${point.value !== undefined ? `<br/>Value: ${point.value.toFixed(2)}` : ''}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this)
            .attr('fill', colorScale ? colorScale(point.value || 0) : '#e3f2fd')
            .attr('stroke-width', 1.5);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay(i * 30)
        .attr('opacity', 0.7);
    });

    // Draw points (sites)
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 0)
      .attr('fill', '#d32f2f')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .transition()
      .duration(600)
      .delay(data.length * 30 + 200)
      .attr('r', 4);

    // Draw labels (if provided)
    if (data.some((d) => d.label)) {
      g.selectAll('.label')
        .data(data.filter((d) => d.label))
        .join('text')
        .attr('class', 'label')
        .attr('x', (d) => x(d.x))
        .attr('y', (d) => y(d.y) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text((d) => d.label || '')
        .transition()
        .delay(data.length * 30 + 800)
        .duration(400)
        .style('opacity', 1);
    }

    // Optional: Draw Delaunay triangulation (commented out by default)
    // g.append('path')
    //   .attr('d', delaunay.render())
    //   .attr('fill', 'none')
    //   .attr('stroke', '#999')
    //   .attr('stroke-width', 0.5)
    //   .attr('stroke-dasharray', '2,2')

    // Axes
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(6));

    g.append('g').call(d3.axisLeft(y).ticks(6));

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Voronoi Diagram (Nearest Neighbor Partition)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
