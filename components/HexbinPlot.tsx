'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { HexbinPointData } from '@/utils/mockData';

interface HexbinPlotProps {
  data: HexbinPointData[];
  width?: number;
  height?: number;
}

export default function HexbinPlot({ data, width = 760, height = 420 }: HexbinPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) || 100])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 100])
      .nice()
      .range([innerHeight, 0]);

    const points = data.map((d) => [x(d.x), y(d.y)] as [number, number]);

    const hexbinGenerator = d3Hexbin<[number, number]>()
      .x((point) => point[0])
      .y((point) => point[1])
      .radius(16)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    const bins = hexbinGenerator(points);

    const color = d3
      .scaleSequential(d3.interpolatePuBuGn)
      .domain([0, d3.max(bins, (bin) => bin.length) || 1]);

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

    g.selectAll('.hex')
      .data(bins)
      .join('path')
      .attr('class', 'hex')
      .attr('d', hexbinGenerator.hexagon())
      .attr('transform', (bin) => `translate(${bin.x},${bin.y})`)
      .attr('fill', '#e0f2f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .on('mouseover', function (event, bin) {
        d3.select(this).attr('stroke', '#004d40').attr('stroke-width', 1.5);
        tooltip
          .style('opacity', 1)
          .html(`<strong>Bin Density</strong><br/>Points: ${bin.length}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 5)
      .attr('fill', (bin) => color(bin.length))
      .attr('opacity', 0.92);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 12)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('X Axis');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Y Axis');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
