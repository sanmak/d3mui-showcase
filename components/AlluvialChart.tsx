'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { AlluvialData } from '@/utils/mockData';

interface AlluvialChartProps {
  data: AlluvialData;
  width?: number;
  height?: number;
}

export default function AlluvialChart({ data, width = 860, height = 420 }: AlluvialChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || !data.links.length) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const sankeyGenerator = sankey<
      { name: string },
      { source: number; target: number; value: number }
    >()
      .nodeWidth(16)
      .nodePadding(12)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    const graph = sankeyGenerator({
      nodes: data.nodes.map((node) => ({ ...node })),
      links: data.links.map((link) => ({ ...link })),
    });

    const color = d3
      .scaleOrdinal<string>()
      .domain(graph.nodes.map((n) => n.name))
      .range(d3.schemeSet2);

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

    svg
      .append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', (d) => color((d.source as { name: string }).name))
      .attr('stroke-width', (d) => Math.max(1, d.width || 1))
      .attr('stroke-opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-opacity', 0.95);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${(d.source as { name: string }).name} → ${(d.target as { name: string }).name}</strong><br/>Flow: ${(d.value || 0).toFixed(0)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-opacity', 0.55);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('stroke-opacity', 0.55);

    svg
      .append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', (d) => d.x0 || 0)
      .attr('y', (d) => d.y0 || 0)
      .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr('height', 0)
      .attr('fill', (d) => color(d.name))
      .attr('stroke', '#fff')
      .transition()
      .duration(700)
      .attr('height', (d) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)));

    svg
      .append('g')
      .selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', (d) => ((d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6))
      .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => ((d.x0 || 0) < width / 2 ? 'start' : 'end'))
      .style('font-size', '11px')
      .text((d) => d.name);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
