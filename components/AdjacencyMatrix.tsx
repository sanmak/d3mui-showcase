'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NetworkLink, NetworkNode } from '@/utils/mockData';

interface AdjacencyMatrixProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width?: number;
  height?: number;
}

export default function AdjacencyMatrix({
  nodes,
  links,
  width = 620,
  height = 620,
}: AdjacencyMatrixProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const margin = { top: 100, right: 20, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const ids = nodes.map((node) => node.id);
    const indexById = new Map(ids.map((id, index) => [id, index]));

    const matrix = Array.from({ length: ids.length }, () => Array(ids.length).fill(0));
    links.forEach((link) => {
      const sourceIndex = indexById.get(link.source);
      const targetIndex = indexById.get(link.target);
      if (sourceIndex !== undefined && targetIndex !== undefined) {
        matrix[sourceIndex][targetIndex] += link.value;
        matrix[targetIndex][sourceIndex] += link.value;
      }
    });

    const x = d3.scaleBand().domain(ids).range([0, innerWidth]).padding(0.06);
    const y = d3.scaleBand().domain(ids).range([0, innerHeight]).padding(0.06);

    const color = d3.scaleSequential(d3.interpolateGnBu).domain([0, d3.max(matrix.flat()) || 1]);

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

    const cells = ids.flatMap((sourceId, sourceIndex) =>
      ids.map((targetId, targetIndex) => ({
        sourceId,
        targetId,
        value: matrix[sourceIndex][targetIndex],
      }))
    );

    g.selectAll('.cell')
      .data(cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d) => x(d.targetId) || 0)
      .attr('y', (d) => y(d.sourceId) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', '#e0f2f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.7)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#004d40').attr('stroke-width', 1.2);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.sourceId} ↔ ${d.targetId}</strong><br/>Connection: ${d.value.toFixed(0)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.7);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 2)
      .attr('fill', (d) => color(d.value));

    g.append('g')
      .call(d3.axisTop(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'start');

    g.append('g').call(d3.axisLeft(y));

    return () => {
      tooltip.remove();
    };
  }, [nodes, links, width, height]);

  return <svg ref={svgRef}></svg>;
}
