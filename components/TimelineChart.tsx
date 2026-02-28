'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface TimelineEvent {
  id: string;
  label: string;
  date: Date;
  description?: string;
  category?: string;
}

interface TimelineChartProps {
  data: TimelineEvent[];
  width?: number;
  height?: number;
}

export default function TimelineChart({ data, width = 900, height = 400 }: TimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 60, right: 40, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort events by date
    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Time scale
    const x = d3
      .scaleTime()
      .domain([
        d3.min(sortedData, (d) => d.date) || new Date(),
        d3.max(sortedData, (d) => d.date) || new Date(),
      ])
      .range([0, innerWidth]);

    const categories = Array.from(new Set(data.map((d) => d.category || 'default')));
    const color = d3.scaleOrdinal<string>().domain(categories).range(d3.schemeSet2);

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

    const timelineY = innerHeight / 2;

    // Draw timeline axis
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', timelineY)
      .attr('y2', timelineY)
      .attr('stroke', '#666')
      .attr('stroke-width', 3);

    // Draw events
    sortedData.forEach((event, i) => {
      const eventX = x(event.date);
      const isTop = i % 2 === 0;
      const eventY = isTop ? timelineY - 80 : timelineY + 80;
      const lineY = isTop ? timelineY - 10 : timelineY + 10;

      const eventGroup = g.append('g').attr('class', 'event-group');

      // Connecting line
      eventGroup
        .append('line')
        .attr('x1', eventX)
        .attr('x2', eventX)
        .attr('y1', timelineY)
        .attr('y2', timelineY)
        .attr('stroke', color(event.category || 'default'))
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2')
        .transition()
        .duration(600)
        .delay(i * 100)
        .attr('y2', lineY);

      // Event marker
      const marker = eventGroup
        .append('circle')
        .attr('cx', eventX)
        .attr('cy', timelineY)
        .attr('r', 0)
        .attr('fill', color(event.category || 'default'))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', function (evt) {
          d3.select(this).attr('r', 10);
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${event.label}</strong><br/>Date: ${event.date.toLocaleDateString()}${event.description ? `<br/>${event.description}` : ''}`
            )
            .style('left', evt.pageX + 10 + 'px')
            .style('top', evt.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 7);
          tooltip.style('opacity', 0);
        });

      marker
        .transition()
        .duration(600)
        .delay(i * 100 + 300)
        .attr('r', 7);

      // Event label
      const label = eventGroup
        .append('text')
        .attr('x', eventX)
        .attr('y', eventY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', isTop ? 'bottom' : 'top')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(event.label);

      label
        .transition()
        .delay(i * 100 + 600)
        .duration(400)
        .style('opacity', 1);

      // Date label
      eventGroup
        .append('text')
        .attr('x', eventX)
        .attr('y', eventY + (isTop ? -12 : 12))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', isTop ? 'bottom' : 'top')
        .style('font-size', '9px')
        .style('fill', '#666')
        .style('opacity', 0)
        .text(event.date.toLocaleDateString())
        .transition()
        .delay(i * 100 + 600)
        .duration(400)
        .style('opacity', 1);
    });

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${timelineY + 30})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    // Legend (if categories exist)
    if (categories.length > 1) {
      const legend = g.append('g').attr('transform', `translate(${innerWidth - 100}, 0)`);

      categories.forEach((cat, i) => {
        const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

        legendRow
          .append('circle')
          .attr('r', 5)
          .attr('fill', color(cat))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        legendRow.append('text').attr('x', 12).attr('y', 4).style('font-size', '11px').text(cat);
      });
    }

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Event Timeline');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
