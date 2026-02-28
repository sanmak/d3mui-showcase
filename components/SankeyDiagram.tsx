'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { SankeyData } from '@/utils/mockData';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

export default function SankeyDiagram({ data, width = 700, height = 400 }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 5],
      ]);

    const { nodes, links } = sankey({
      nodes: data.nodes.map((d) => ({ ...d })) as any,
      links: data.links.map((d) => ({ ...d })) as any,
    } as any);

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

    svg
      .append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => color(d.name))
      .attr('opacity', 0)
      .on('mouseover', function (event, d: any) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Value: ${d.value}`)
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

    const linkGroup = svg
      .append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(links)
      .join('g')
      .attr('opacity', 0);

    linkGroup
      .append('path')
      .attr('d', sankeyLinkHorizontal() as any)
      .attr('stroke', (d: any) => color(d.source.name))
      .attr('stroke-width', (d: any) => Math.max(1, d.width));

    linkGroup.transition().delay(500).duration(800).attr('opacity', 0.5);

    svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < width / 2 ? 'start' : 'end'))
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .text((d: any) => d.name)
      .style('opacity', 0)
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
