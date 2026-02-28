'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

interface FlowMapProps {
  data: FlowMapData;
  width?: number;
  height?: number;
}

export default function FlowMap({ data, width = 800, height = 600 }: FlowMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.locations.length) return;

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xExtent = d3.extent(data.locations, (d) => d.x) as [number, number];
    const yExtent = d3.extent(data.locations, (d) => d.y) as [number, number];

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice();

    const y = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice();

    // Flow width scale
    const maxFlow = d3.max(data.flows, (d) => d.value) || 1;
    const flowWidth = d3.scaleLinear().domain([0, maxFlow]).range([1, 15]);

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

    // Create location lookup
    const locationMap = new Map(data.locations.map((loc) => [loc.id, loc]));

    // Draw background map outline (simplified regions)
    const mapOutline: [number, number][] = [
      [10, 10],
      [90, 15],
      [85, 85],
      [20, 80],
    ];

    const lineGenerator = d3
      .line<[number, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(mapOutline)
      .attr('d', lineGenerator)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    // Draw flows (curved paths)
    data.flows.forEach((flow, i) => {
      const source = locationMap.get(flow.source);
      const target = locationMap.get(flow.target);

      if (!source || !target) return;

      const sourceX = x(source.x);
      const sourceY = y(source.y);
      const targetX = x(target.x);
      const targetY = y(target.y);

      // Create curved path
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const offset = Math.sqrt(dx * dx + dy * dy) * 0.2;

      // Perpendicular offset for curve
      const perpX = (-dy / Math.sqrt(dx * dx + dy * dy)) * offset;
      const perpY = (dx / Math.sqrt(dx * dx + dy * dy)) * offset;

      const controlX = midX + perpX;
      const controlY = midY + perpY;

      const path = d3.path();
      path.moveTo(sourceX, sourceY);
      path.quadraticCurveTo(controlX, controlY, targetX, targetY);

      const pathElement = g
        .append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', '#2196f3')
        .attr('stroke-width', flowWidth(flow.value))
        .attr('opacity', 0)
        .attr('marker-end', 'url(#arrow)')
        .on('mouseover', function (event) {
          d3.select(this).attr('stroke', '#1565c0').attr('opacity', 0.9);
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>Flow</strong><br/>${source.name} → ${target.name}<br/>Value: ${flow.value}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke', '#2196f3').attr('opacity', 0.6);
          tooltip.style('opacity', 0);
        });

      pathElement
        .transition()
        .duration(1000)
        .delay(i * 100)
        .attr('opacity', 0.6);
    });

    // Define arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#2196f3');

    // Draw locations
    data.locations.forEach((location, i) => {
      const locationG = g.append('g').attr('class', 'location');

      locationG
        .append('circle')
        .attr('cx', x(location.x))
        .attr('cy', y(location.y))
        .attr('r', 0)
        .attr('fill', '#ff5722')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', function (event) {
          d3.select(this).attr('r', 10);
          tooltip
            .style('opacity', 1)
            .html(`<strong>${location.name}</strong><br/>Location ID: ${location.id}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 7);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(600)
        .delay(data.flows.length * 100 + i * 100)
        .attr('r', 7);

      locationG
        .append('text')
        .attr('x', x(location.x))
        .attr('y', y(location.y) - 12)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(location.name)
        .transition()
        .delay(data.flows.length * 100 + data.locations.length * 100 + 200)
        .duration(400)
        .style('opacity', 1);
    });

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Flow Map (Migration/Movement)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
