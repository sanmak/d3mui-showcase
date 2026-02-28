'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface SunburstProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function Sunburst({ data, width = 500, height = 500 }: SunburstProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const radius = Math.min(width, height) / 2;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<TreeNode>().size([2 * Math.PI, radius]);

    partition(root);

    const arc = d3
      .arc<d3.HierarchyRectangularNode<TreeNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

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

    g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('fill', (d) => color((d.children ? d : d.parent)?.data.name || ''))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.data.name}</strong><br/>Value: ${d.value || 0}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .attr('d', arc as any)
      .attr('opacity', 0.8);

    g.selectAll('text')
      .data(root.descendants().filter((d: any) => d.depth && (d.x1 - d.x0) * (d.y1 - d.y0) > 0.03))
      .join('text')
      .attr('transform', function (d: any) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .style('opacity', 0)
      .text((d) => d.data.name)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
