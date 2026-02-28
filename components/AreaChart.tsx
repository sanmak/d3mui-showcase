'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LineChartData } from '@/utils/mockData';

interface AreaChartProps {
  data: LineChartData[][];
  width?: number;
  height?: number;
}

export default function AreaChart({ data, width = 600, height = 400 }: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = data.flat();
    const x = d3
      .scaleTime()
      .domain(d3.extent(allData, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allData, (d) => d.value) || 100])
      .nice()
      .range([innerHeight, 0]);

    const area = d3
      .area<LineChartData>()
      .x((d) => x(d.date))
      .y0(innerHeight)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const colors = ['#1976d2', '#dc004e', '#4caf50'];

    data.forEach((series, i) => {
      g.append('path')
        .datum(series)
        .attr('fill', colors[i])
        .attr('opacity', 0.6)
        .attr('d', area)
        .transition()
        .duration(1000)
        .delay(i * 200);
    });

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickFormat(d3.timeFormat('%b %d') as any)
      );

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Date');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Values');

    const legend = g.append('g').attr('transform', `translate(${innerWidth - 100},0)`);

    const legendItems = ['Series 1', 'Series 2', 'Series 3'];
    legendItems.forEach((label, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors[i])
        .attr('opacity', 0.6);

      legendRow.append('text').attr('x', 20).attr('y', 12).style('font-size', '12px').text(label);
    });
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
