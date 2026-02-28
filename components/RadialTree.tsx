'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface RadialTreeProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function RadialTree({ data, width = 700, height = 700 }: RadialTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    // Create tree layout
    const tree = d3.tree<TreeNode>().size([2 * Math.PI, radius - 80]);

    const root = d3.hierarchy(data);
    tree(root);

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

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr(
        'd',
        d3
          .linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
          .angle((d) => d.x)
          .radius((d) => d.y) as any
      )
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 20)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        const angle = d.x || 0;
        const r = d.y || 0;
        const x = r * Math.sin(angle);
        const y = -r * Math.cos(angle);
        return `translate(${x},${y})`;
      });

    nodes
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d) => (d.children ? '#1976d2' : '#4caf50'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', d.children ? 8 : 6);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name}</strong>${d.data.value ? `<br/>Value: ${d.data.value}` : ''}<br/>Depth: ${d.depth}${d.children ? `<br/>Children: ${d.children.length}` : ''}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('r', d.children ? 6 : 4);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(600)
      .delay((d, i) => root.links().length * 20 + i * 30)
      .attr('r', (d) => (d.children ? 6 : 4));

    // Add labels
    nodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => {
        const angle = d.x || 0;
        return angle > Math.PI ? -10 : 10;
      })
      .attr('text-anchor', (d) => {
        const angle = d.x || 0;
        return angle > Math.PI ? 'end' : 'start';
      })
      .attr('transform', (d) => {
        const angle = d.x || 0;
        const degrees = (angle * 180) / Math.PI - 90;
        return angle > Math.PI ? `rotate(${degrees + 180})` : `rotate(${degrees})`;
      })
      .style('font-size', '10px')
      .style('font-weight', (d) => (d.children ? '600' : '400'))
      .style('opacity', 0)
      .text((d) => d.data.name)
      .transition()
      .delay(root.links().length * 20 + root.descendants().length * 30 + 400)
      .duration(400)
      .style('opacity', 1);

    // Draw circles for depth levels
    const maxDepth = d3.max(root.descendants(), (d) => d.depth) || 0;
    const depthLevels = d3.range(1, maxDepth + 2);

    g.selectAll('.depth-circle')
      .data(depthLevels)
      .join('circle')
      .attr('class', 'depth-circle')
      .attr('r', (d) => (d * radius) / (maxDepth + 1))
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Radial Tree (Hierarchical Layout)');

    // Legend
    const legend = svg.append('g').attr('transform', `translate(20, 60)`);

    legend
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#1976d2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    legend
      .append('text')
      .attr('x', 12)
      .attr('y', 4)
      .style('font-size', '11px')
      .text('Parent nodes');

    legend
      .append('circle')
      .attr('cy', 20)
      .attr('r', 4)
      .attr('fill', '#4caf50')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    legend.append('text').attr('x', 12).attr('y', 24).style('font-size', '11px').text('Leaf nodes');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
