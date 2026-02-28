'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface DendrogramChartProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function DendrogramChart({ data, width = 900, height = 480 }: DendrogramChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(data);
    const cluster = d3.cluster<TreeNode>().size([innerHeight, innerWidth]);
    cluster(root);

    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

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

    g.selectAll('.dendro-link')
      .data(root.links())
      .join('path')
      .attr('class', 'dendro-link')
      .attr('d', (d) => linkGenerator(d as d3.HierarchyPointLink<TreeNode>) || '')
      .attr('fill', 'none')
      .attr('stroke', '#90a4ae')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 0.9);

    const nodes = g
      .selectAll('.dendro-node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'dendro-node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    nodes
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d) => (d.children ? '#1976d2' : '#66bb6a'))
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.data.name}</strong><br/>Depth: ${d.depth}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 6);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(600)
      .delay((_, index) => index * 30)
      .attr('r', 6);

    nodes
      .append('text')
      .attr('dy', 4)
      .attr('x', (d) => (d.children ? -10 : 10))
      .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .style('font-size', '11px')
      .style('fill', '#263238')
      .text((d) => d.data.name);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
