'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface TreeMapProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function TreeMap({ data, width = 600, height = 400 }: TreeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap<TreeNode>().size([width, height]).padding(2)(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

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

    const leaf = svg
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    leaf
      .append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => color(d.parent?.data.name || ''))
      .attr('opacity', 0)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('rx', 3)
      .on('mouseover', function (event, d: any) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name}</strong><br/>Category: ${d.parent?.data.name}<br/>Value: ${d.value}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('opacity', 0.8);

    leaf
      .append('text')
      .attr('x', 5)
      .attr('y', 20)
      .text((d: any) => d.data.name)
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .duration(300)
      .style('opacity', 1);

    leaf
      .append('text')
      .attr('x', 5)
      .attr('y', 35)
      .text((d: any) => d.value || '')
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(300)
      .style('opacity', 0.9);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
