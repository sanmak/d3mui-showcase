'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface SlopeData {
  label: string;
  start: number;
  end: number;
}

interface SlopeChartProps {
  data: SlopeData[];
  startLabel?: string;
  endLabel?: string;
  width?: number;
  height?: number;
}

export default function SlopeChart({
  data,
  startLabel = 'Before',
  endLabel = 'After',
  width = 600,
  height = 500,
}: SlopeChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 60, right: 120, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Y scale
    const allValues = data.flatMap((d) => [d.start, d.end]);
    const y = d3
      .scaleLinear()
      .domain([d3.min(allValues) || 0, d3.max(allValues) || 100])
      .nice()
      .range([innerHeight, 0]);

    // X positions
    const leftX = 0;
    const rightX = innerWidth;

    // Color scale (red for decrease, green for increase)
    const getColor = (d: SlopeData) => {
      const change = d.end - d.start;
      if (change > 0) return '#4caf50';
      if (change < 0) return '#f44336';
      return '#9e9e9e';
    };

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

    // Draw lines
    const lines = g
      .selectAll('.slope-line')
      .data(data)
      .join('line')
      .attr('class', 'slope-line')
      .attr('x1', leftX)
      .attr('y1', (d) => y(d.start))
      .attr('x2', leftX)
      .attr('y2', (d) => y(d.start))
      .attr('stroke', getColor)
      .attr('stroke-width', 2)
      .attr('opacity', 0.7)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 4).attr('opacity', 1);
        const change = d.end - d.start;
        const changePercent = ((change / d.start) * 100).toFixed(1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.label}</strong><br/>${startLabel}: ${d.start.toFixed(1)}<br/>${endLabel}: ${d.end.toFixed(1)}<br/>Change: ${change > 0 ? '+' : ''}${change.toFixed(1)} (${change > 0 ? '+' : ''}${changePercent}%)`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 2).attr('opacity', 0.7);
        tooltip.style('opacity', 0);
      });

    lines
      .transition()
      .duration(1000)
      .attr('x2', rightX)
      .attr('y2', (d) => y(d.end));

    // Left points (start)
    g.selectAll('.start-point')
      .data(data)
      .join('circle')
      .attr('class', 'start-point')
      .attr('cx', leftX)
      .attr('cy', (d) => y(d.start))
      .attr('r', 0)
      .attr('fill', getColor)
      .transition()
      .delay(800)
      .duration(400)
      .attr('r', 4);

    // Right points (end)
    g.selectAll('.end-point')
      .data(data)
      .join('circle')
      .attr('class', 'end-point')
      .attr('cx', rightX)
      .attr('cy', (d) => y(d.end))
      .attr('r', 0)
      .attr('fill', getColor)
      .transition()
      .delay(800)
      .duration(400)
      .attr('r', 4);

    // Left labels (start values)
    g.selectAll('.start-label')
      .data(data)
      .join('text')
      .attr('class', 'start-label')
      .attr('x', leftX - 10)
      .attr('y', (d) => y(d.start))
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text((d) => `${d.label} (${d.start.toFixed(0)})`)
      .transition()
      .delay(1200)
      .duration(400)
      .style('opacity', 1);

    // Right labels (end values)
    g.selectAll('.end-label')
      .data(data)
      .join('text')
      .attr('class', 'end-label')
      .attr('x', rightX + 10)
      .attr('y', (d) => y(d.end))
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text((d) => {
        const change = d.end - d.start;
        const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
        return `${d.label} (${d.end.toFixed(0)}) ${arrow}`;
      })
      .attr('fill', getColor)
      .transition()
      .delay(1200)
      .duration(400)
      .style('opacity', 1);

    // Column headers
    g.append('text')
      .attr('x', leftX)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text(startLabel);

    g.append('text')
      .attr('x', rightX)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text(endLabel);

    // Y axes
    g.append('g').attr('transform', `translate(${leftX}, 0)`).call(d3.axisLeft(y).ticks(6));

    g.append('g').attr('transform', `translate(${rightX}, 0)`).call(d3.axisRight(y).ticks(6));

    return () => {
      tooltip.remove();
    };
  }, [data, startLabel, endLabel, width, height]);

  return <svg ref={svgRef}></svg>;
}
