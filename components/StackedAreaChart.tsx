'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface StackedAreaDataPoint {
  date: Date;
  [key: string]: Date | number;
}

interface StackedAreaChartProps {
  data: StackedAreaDataPoint[];
  width?: number;
  height?: number;
}

export default function StackedAreaChart({
  data,
  width = 700,
  height = 400,
}: StackedAreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract series names (excluding 'date')
    const seriesNames = Object.keys(data[0]).filter((key) => key !== 'date');

    // Prepare stack data
    const stackedData = d3.stack<StackedAreaDataPoint>().keys(seriesNames)(data as any);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1]) || 100])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal<string>().domain(seriesNames).range(d3.schemeCategory10);

    const area = d3
      .area<any>()
      .x((d) => x(d.data.date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

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

    // Draw stacked areas
    const layers = g.selectAll('.layer').data(stackedData).join('g').attr('class', 'layer');

    layers
      .append('path')
      .attr('fill', (d) => color(d.key))
      .attr('opacity', 0.8)
      .attr('d', area)
      .style('clip-path', 'inset(0 100% 0 0)')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.key}</strong>`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mousemove', function (event) {
        tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .style('clip-path', 'inset(0 0% 0 0)');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    // Legend
    const legend = g.append('g').attr('transform', `translate(${innerWidth + 10}, 0)`);

    seriesNames.forEach((series, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color(series))
        .attr('rx', 2);

      legendRow.append('text').attr('x', 18).attr('y', 10).style('font-size', '12px').text(series);
    });

    // Axis labels
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

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
