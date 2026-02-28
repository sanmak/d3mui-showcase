'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface CirclePackingProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function CirclePacking({ data, width = 620, height = 620 }: CirclePackingProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const pack = d3.pack<TreeNode>().size([width, height]).padding(4);
    const nodes = pack(root).descendants();

    const color = d3.scaleSequential(d3.interpolateBlues).domain([0, root.height || 1]);

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

    const g = svg.append('g');

    g.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 0)
      .attr('fill', (d) => (d.children ? color(d.depth) : '#90caf9'))
      .attr('fill-opacity', (d) => (d.children ? 0.35 : 0.85))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#0d47a1').attr('stroke-width', 2);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name}</strong><br/>Value: ${(d.value || 0).toFixed(0)}<br/>Depth: ${d.depth}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 8)
      .attr('r', (d) => d.r);

    g.selectAll('text')
      .data(nodes.filter((d) => !d.children && d.r > 16))
      .join('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y + 3)
      .style('font-size', '10px')
      .style('text-anchor', 'middle')
      .style('fill', '#0d1b2a')
      .text((d) => d.data.name);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
