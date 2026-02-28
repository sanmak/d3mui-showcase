'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BarChartData } from '@/utils/mockData';

interface RadarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
}

export default function RadarChart({ data, width = 500, height = 500 }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const radius = Math.min(width, height) / 2 - 40;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;

    const maxValue = d3.max(data, (d) => d.value) || 100;
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelFactor = (radius * i) / levels;
      g.append('circle')
        .attr('r', levelFactor)
        .attr('fill', 'none')
        .attr('stroke', '#CDCDCD')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    }

    const axes = g.selectAll('.axis').data(data).join('g').attr('class', 'axis');

    axes
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#CDCDCD')
      .attr('stroke-width', 1);

    axes
      .append('text')
      .attr('x', (d, i) => (rScale(maxValue) + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => (rScale(maxValue) + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d) => d.label);

    const radarLine = d3
      .lineRadial<BarChartData>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => angleSlice * i)
      .curve(d3.curveLinearClosed);

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

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', '#1976d2')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#1976d2')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    g.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('r', 0)
      .attr('fill', '#1976d2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5);
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay(1000)
      .duration(500)
      .attr('r', 5);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
