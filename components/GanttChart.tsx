'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
}

interface GanttChartProps {
  data: GanttTask[];
  width?: number;
  height?: number;
}

export default function GanttChart({ data, width = 900, height = 400 }: GanttChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Time scale
    const minDate = d3.min(data, (d) => d.start) || new Date();
    const maxDate = d3.max(data, (d) => d.end) || new Date();

    const x = d3.scaleTime().domain([minDate, maxDate]).range([0, innerWidth]);

    // Task scale
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3);

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

    // Draw task bars
    const taskGroups = g
      .selectAll('.task')
      .data(data)
      .join('g')
      .attr('class', 'task')
      .attr('transform', (d) => `translate(0, ${y(d.name)})`);

    // Background bar (full duration)
    taskGroups
      .append('rect')
      .attr('x', (d) => x(d.start))
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#e0e0e0')
      .attr('rx', 4)
      .transition()
      .duration(800)
      .attr('width', (d) => x(d.end) - x(d.start));

    // Progress bar
    taskGroups
      .append('rect')
      .attr('x', (d) => x(d.start))
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#1976d2')
      .attr('rx', 4)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#1565c0');
        const duration = Math.ceil((d.end.getTime() - d.start.getTime()) / (1000 * 60 * 60 * 24));
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.name}</strong><br/>Start: ${d.start.toLocaleDateString()}<br/>End: ${d.end.toLocaleDateString()}<br/>Duration: ${duration} days<br/>Progress: ${d.progress}%`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#1976d2');
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay(400)
      .duration(800)
      .attr('width', (d) => ((x(d.end) - x(d.start)) * d.progress) / 100);

    // Progress text
    taskGroups
      .append('text')
      .attr('x', (d) => x(d.start) + (x(d.end) - x(d.start)) / 2)
      .attr('y', y.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#fff')
      .style('opacity', 0)
      .text((d) => `${d.progress}%`)
      .transition()
      .delay(1200)
      .duration(400)
      .style('opacity', 1);

    // Y axis (task names)
    g.append('g').call(d3.axisLeft(y)).selectAll('text').style('font-size', '12px');

    // X axis (timeline)
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6));

    xAxis.selectAll('text').attr('transform', 'rotate(-45)').style('text-anchor', 'end');

    // Today line
    const today = new Date();
    if (today >= minDate && today <= maxDate) {
      g.append('line')
        .attr('x1', x(today))
        .attr('x2', x(today))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#f44336')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .style('opacity', 0)
        .transition()
        .delay(1000)
        .duration(400)
        .style('opacity', 0.7);

      g.append('text')
        .attr('x', x(today))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#f44336')
        .text('Today');
    }

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickSize(innerHeight)
          .tickFormat(() => '')
      )
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g.selectAll('.tick line').attr('stroke', '#e0e0e0').attr('stroke-dasharray', '2,2')
      );

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Project Timeline');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
