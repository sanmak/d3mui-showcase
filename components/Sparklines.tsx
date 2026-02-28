'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface SparklineData {
  label: string;
  values: number[];
}

interface SparklinesProps {
  data: SparklineData[];
  width?: number;
  height?: number;
  sparklineHeight?: number;
  type?: 'line' | 'bar' | 'area';
}

export default function Sparklines({
  data,
  width = 700,
  height = 400,
  sparklineHeight = 40,
  type = 'line',
}: SparklinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const sparklineWidth = innerWidth - 100;
    const rowHeight = sparklineHeight + 30;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Draw each sparkline
    data.forEach((d, i) => {
      const rowG = g.append('g').attr('transform', `translate(0, ${i * rowHeight})`);

      // Label
      rowG
        .append('text')
        .attr('x', -10)
        .attr('y', sparklineHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .text(d.label);

      const x = d3
        .scaleLinear()
        .domain([0, d.values.length - 1])
        .range([0, sparklineWidth]);

      const y = d3
        .scaleLinear()
        .domain([d3.min(d.values) || 0, d3.max(d.values) || 100])
        .nice()
        .range([sparklineHeight, 0]);

      const sparklineG = rowG.append('g');

      if (type === 'line') {
        // Draw line
        const line = d3
          .line<number>()
          .x((_, i) => x(i))
          .y((val) => y(val))
          .curve(d3.curveMonotoneX);

        const path = sparklineG
          .append('path')
          .datum(d.values)
          .attr('fill', 'none')
          .attr('stroke', '#1976d2')
          .attr('stroke-width', 2)
          .attr('d', line);

        const pathLength = (path.node() as SVGPathElement).getTotalLength();

        path
          .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);

        // Add end point
        sparklineG
          .append('circle')
          .attr('cx', x(d.values.length - 1))
          .attr('cy', y(d.values[d.values.length - 1]))
          .attr('r', 0)
          .attr('fill', '#1976d2')
          .transition()
          .delay(800)
          .duration(200)
          .attr('r', 3);
      } else if (type === 'bar') {
        // Draw bars
        const barWidth = sparklineWidth / d.values.length - 1;

        sparklineG
          .selectAll('rect')
          .data(d.values)
          .join('rect')
          .attr('x', (_, i) => x(i) - barWidth / 2)
          .attr('width', barWidth)
          .attr('y', sparklineHeight)
          .attr('height', 0)
          .attr('fill', '#1976d2')
          .attr('rx', 1)
          .transition()
          .duration(800)
          .delay((_, i) => i * 30)
          .attr('y', (val) => y(val))
          .attr('height', (val) => sparklineHeight - y(val));
      } else if (type === 'area') {
        // Draw area
        const area = d3
          .area<number>()
          .x((_, i) => x(i))
          .y0(sparklineHeight)
          .y1((val) => y(val))
          .curve(d3.curveMonotoneX);

        sparklineG
          .append('path')
          .datum(d.values)
          .attr('fill', '#1976d2')
          .attr('fill-opacity', 0.6)
          .attr('d', area)
          .style('clip-path', 'inset(0 100% 0 0)')
          .transition()
          .duration(1000)
          .style('clip-path', 'inset(0 0% 0 0)');
      }

      // Current value
      const currentValue = d.values[d.values.length - 1];
      const previousValue = d.values[d.values.length - 2];
      const change = currentValue - previousValue;
      const changePercent = ((change / previousValue) * 100).toFixed(1);

      rowG
        .append('text')
        .attr('x', sparklineWidth + 10)
        .attr('y', sparklineHeight / 2)
        .attr('dominant-baseline', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .text(currentValue.toFixed(1));

      rowG
        .append('text')
        .attr('x', sparklineWidth + 60)
        .attr('y', sparklineHeight / 2)
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('fill', change >= 0 ? '#4caf50' : '#f44336')
        .text(`${change >= 0 ? '+' : ''}${changePercent}%`);

      // Invisible overlay for tooltip
      rowG
        .append('rect')
        .attr('width', sparklineWidth)
        .attr('height', sparklineHeight)
        .attr('fill', 'transparent')
        .on('mousemove', function (event) {
          const [mouseX] = d3.pointer(event, this);
          const index = Math.round(x.invert(mouseX));
          const value = d.values[index];
          if (value !== undefined) {
            tooltip
              .style('opacity', 1)
              .html(`<strong>${d.label}</strong><br/>Point ${index + 1}: ${value.toFixed(1)}`)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          }
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, sparklineHeight, type]);

  return <svg ref={svgRef}></svg>;
}
