'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface IcicleChartProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function IcicleChart({ data, width = 860, height = 420 }: IcicleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<TreeNode>().size([width, height]);
    const nodes = partition(root).descendants();

    const color = d3.scaleOrdinal<string>().range(d3.schemeSet3);

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

    g.selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => Math.max(0, d.x1 - d.x0 - 1))
      .attr('height', 0)
      .attr('fill', (d) => color((d.children ? d.data.name : d.parent?.data.name) || d.data.name))
      .attr('stroke', '#fff')
      .attr('opacity', 0.9)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name}</strong><br/>Value: ${(d.value || 0).toFixed(0)}<br/>Depth: ${d.depth}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 12)
      .attr('height', (d) => Math.max(0, d.y1 - d.y0 - 1));

    g.selectAll('text')
      .data(nodes.filter((d) => d.x1 - d.x0 > 70 && d.y1 - d.y0 > 16))
      .join('text')
      .attr('x', (d) => d.x0 + 5)
      .attr('y', (d) => d.y0 + 13)
      .style('font-size', '11px')
      .style('fill', '#102027')
      .text((d) => d.data.name);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
