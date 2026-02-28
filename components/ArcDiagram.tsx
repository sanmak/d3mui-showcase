'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface ArcNode {
  id: string;
  label: string;
}

export interface ArcLink {
  source: string;
  target: string;
  value?: number;
}

export interface ArcDiagramData {
  nodes: ArcNode[];
  links: ArcLink[];
}

interface ArcDiagramProps {
  data: ArcDiagramData;
  width?: number;
  height?: number;
}

export default function ArcDiagram({ data, width = 800, height = 400 }: ArcDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Position nodes along a line
    const x = d3
      .scalePoint()
      .domain(data.nodes.map((d) => d.id))
      .range([0, innerWidth])
      .padding(0.5);

    const nodePositions = new Map(data.nodes.map((d) => [d.id, x(d.id) || 0]));

    const y = innerHeight * 0.7;

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

    // Draw arcs for links
    const linkGroup = g.append('g').attr('class', 'links');

    data.links.forEach((link, i) => {
      const sourceX = nodePositions.get(link.source) || 0;
      const targetX = nodePositions.get(link.target) || 0;
      const midX = (sourceX + targetX) / 2;
      const arcHeight = Math.abs(targetX - sourceX) / 2;

      const path = d3.path();
      path.moveTo(sourceX, y);
      path.quadraticCurveTo(midX, y - arcHeight, targetX, y);

      linkGroup
        .append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', '#1976d2')
        .attr('stroke-width', link.value ? Math.sqrt(link.value) : 1.5)
        .attr('opacity', 0)
        .on('mouseover', function (event) {
          d3.select(this).attr('stroke', '#1565c0').attr('opacity', 1);
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>Connection</strong><br/>${link.source} → ${link.target}${link.value ? `<br/>Weight: ${link.value}` : ''}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke', '#1976d2').attr('opacity', 0.4);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay(i * 50)
        .attr('opacity', 0.4);
    });

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    data.nodes.forEach((node, i) => {
      const nodeX = nodePositions.get(node.id) || 0;

      // Circle
      nodeGroup
        .append('circle')
        .attr('cx', nodeX)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', '#1976d2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', function (event) {
          d3.select(this).attr('r', 8).attr('fill', '#1565c0');

          // Highlight connected arcs
          linkGroup
            .selectAll('path')
            .filter(
              (d: any) =>
                (d as any).__data__.source === node.id || (d as any).__data__.target === node.id
            )
            .attr('stroke', '#ff9800')
            .attr('opacity', 0.8)
            .attr('stroke-width', 3);

          tooltip
            .style('opacity', 1)
            .html(`<strong>${node.label}</strong><br/>ID: ${node.id}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 6).attr('fill', '#1976d2');

          // Reset arcs
          linkGroup
            .selectAll('path')
            .attr('stroke', '#1976d2')
            .attr('opacity', 0.4)
            .attr('stroke-width', (d: any) => (d.value ? Math.sqrt(d.value) : 1.5));

          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(600)
        .delay(data.links.length * 50 + i * 80)
        .attr('r', 6);

      // Label
      nodeGroup
        .append('text')
        .attr('x', nodeX)
        .attr('y', y + 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '500')
        .style('opacity', 0)
        .text(node.label)
        .transition()
        .delay(data.links.length * 50 + data.nodes.length * 80 + 200)
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
      .text('Network Arc Diagram');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
