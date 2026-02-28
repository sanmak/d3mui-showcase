'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface BulletData {
  title: string;
  subtitle?: string;
  ranges: number[]; // [bad, satisfactory, good]
  measures: number[]; // [current value, comparison value (optional)]
  markers: number[]; // target markers
}

interface BulletChartProps {
  data: BulletData[];
  width?: number;
  height?: number;
}

export default function BulletChart({ data, width = 700, height = 400 }: BulletChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 40, bottom: 20, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const bulletHeight = 40;
    const rowHeight = bulletHeight + 30;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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

    // Draw each bullet
    data.forEach((d, i) => {
      const bulletG = g.append('g').attr('transform', `translate(0, ${i * rowHeight})`);

      // Title
      bulletG
        .append('text')
        .attr('x', -10)
        .attr('y', bulletHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .text(d.title);

      // Subtitle
      if (d.subtitle) {
        bulletG
          .append('text')
          .attr('x', -10)
          .attr('y', bulletHeight / 2 + 15)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '10px')
          .style('fill', '#666')
          .text(d.subtitle);
      }

      // Scale
      const maxValue = Math.max(...d.ranges, ...d.measures, ...d.markers);
      const x = d3.scaleLinear().domain([0, maxValue]).range([0, innerWidth]);

      // Qualitative ranges (background)
      const rangeColors = ['#d32f2f', '#ffa726', '#66bb6a'];

      d.ranges.forEach((range, idx) => {
        bulletG
          .append('rect')
          .attr('x', 0)
          .attr('y', (bulletHeight - 20) / 2)
          .attr('width', 0)
          .attr('height', 20)
          .attr('fill', rangeColors[idx % rangeColors.length])
          .attr('opacity', 0.3)
          .transition()
          .duration(800)
          .delay(i * 100)
          .attr('width', x(range));
      });

      // Comparison measure (if exists)
      if (d.measures.length > 1) {
        bulletG
          .append('rect')
          .attr('x', 0)
          .attr('y', (bulletHeight - 12) / 2)
          .attr('width', 0)
          .attr('height', 12)
          .attr('fill', '#666')
          .attr('opacity', 0.5)
          .transition()
          .duration(800)
          .delay(i * 100 + 200)
          .attr('width', x(d.measures[1]));
      }

      // Current measure
      const measureBar = bulletG
        .append('rect')
        .attr('x', 0)
        .attr('y', (bulletHeight - 8) / 2)
        .attr('width', 0)
        .attr('height', 8)
        .attr('fill', '#1976d2')
        .on('mouseover', function (event) {
          d3.select(this).attr('fill', '#1565c0');
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${d.title}</strong><br/>Current: ${d.measures[0].toFixed(1)}<br/>Target: ${d.markers[0].toFixed(1)}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#1976d2');
          tooltip.style('opacity', 0);
        });

      measureBar
        .transition()
        .duration(800)
        .delay(i * 100 + 400)
        .attr('width', x(d.measures[0]));

      // Target markers
      d.markers.forEach((marker) => {
        const markerG = bulletG.append('g').style('opacity', 0);

        markerG
          .append('line')
          .attr('x1', x(marker))
          .attr('x2', x(marker))
          .attr('y1', (bulletHeight - 24) / 2)
          .attr('y2', (bulletHeight + 24) / 2)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);

        markerG
          .transition()
          .delay(i * 100 + 600)
          .duration(400)
          .style('opacity', 1);
      });

      // Value label
      bulletG
        .append('text')
        .attr('x', x(d.measures[0]) + 5)
        .attr('y', bulletHeight / 2)
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(d.measures[0].toFixed(0))
        .transition()
        .delay(i * 100 + 800)
        .duration(400)
        .style('opacity', 1);

      // Axis
      const axis = bulletG
        .append('g')
        .attr('transform', `translate(0, ${bulletHeight + 5})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(5));

      axis.selectAll('text').style('font-size', '10px');
      axis.select('.domain').attr('stroke', '#ccc');
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
