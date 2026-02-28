'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '@/utils/mockData';

interface TreeDiagramProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

export default function TreeDiagram({ data, width = 700, height = 500 }: TreeDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree<TreeNode>().size([innerHeight, innerWidth]);

    const root = d3.hierarchy(data);
    treeLayout(root);

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

    g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .attr(
        'd',
        d3
          .linkHorizontal<any, any>()
          .x((d) => d.y)
          .y((d) => d.x) as any
      )
      .transition()
      .duration(1000)
      .attr('opacity', 0.6);

    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d) => (d.children ? '#1976d2' : '#4caf50'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name}</strong>${d.data.value ? `<br/>Value: ${d.data.value}` : ''}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 6);
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay(1000)
      .duration(500)
      .attr('r', 6);

    node
      .append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d) => d.data.name)
      .style('opacity', 0)
      .transition()
      .delay(1500)
      .duration(500)
      .style('opacity', 1);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
