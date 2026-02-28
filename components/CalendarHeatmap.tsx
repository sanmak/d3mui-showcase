'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CalendarHeatmapData } from '@/utils/mockData';

interface CalendarHeatmapProps {
  data: CalendarHeatmapData[];
  width?: number;
  height?: number;
}

export default function CalendarHeatmap({ data, width = 800, height = 260 }: CalendarHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...data].sort((a, b) => +a.date - +b.date);
    const startDate = d3.timeWeek.floor(sortedData[0].date);

    const maxValue = d3.max(sortedData, (d) => d.value) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, maxValue]);

    const weekCount =
      d3.timeWeek.count(startDate, d3.timeWeek.ceil(sortedData[sortedData.length - 1].date)) + 1;
    const cellSize = Math.min(innerWidth / Math.max(weekCount, 1), innerHeight / 7);

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

    const formatDate = d3.timeFormat('%b %d, %Y');

    g.selectAll('.day-cell')
      .data(sortedData)
      .join('rect')
      .attr('class', 'day-cell')
      .attr('x', (d) => d3.timeWeek.count(startDate, d.date) * cellSize)
      .attr('y', (d) => d.date.getDay() * cellSize)
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('rx', 2)
      .attr('fill', '#e0e0e0')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#1a237e').attr('stroke-width', 1.5);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${formatDate(d.date)}</strong><br/>Activity: ${d.value.toFixed(0)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', 'none');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, i) => i * 2)
      .attr('fill', (d) => colorScale(d.value));

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    g.selectAll('.day-label')
      .data(dayLabels)
      .join('text')
      .attr('class', 'day-label')
      .attr('x', -8)
      .attr('y', (_, i) => i * cellSize + cellSize / 1.6)
      .attr('text-anchor', 'end')
      .style('font-size', '11px')
      .style('fill', '#455a64')
      .text((d) => d);

    const monthStarts = d3.timeMonths(startDate, sortedData[sortedData.length - 1].date);
    g.selectAll('.month-label')
      .data(monthStarts)
      .join('text')
      .attr('class', 'month-label')
      .attr('x', (d) => d3.timeWeek.count(startDate, d) * cellSize)
      .attr('y', -8)
      .style('font-size', '12px')
      .style('fill', '#37474f')
      .text((d) => d3.timeFormat('%b')(d));

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
