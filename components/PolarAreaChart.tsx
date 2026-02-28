'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface PolarAreaData {
  label: string;
  value: number;
}

interface PolarAreaChartProps {
  data: PolarAreaData[];
  width?: number;
  height?: number;
}

export default function PolarAreaChart({ data, width = 600, height = 600 }: PolarAreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    // Angle scale (equal angles for each segment)
    const angleScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, 2 * Math.PI])
      .padding(0.05);

    // Radius scale (based on values)
    const radiusScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 100])
      .range([0, radius]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(d3.schemeSet3);

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

    // Create arc generator
    const arc = d3
      .arc<PolarAreaData>()
      .innerRadius(0)
      .outerRadius((d) => radiusScale(d.value))
      .startAngle((d) => angleScale(d.label) || 0)
      .endAngle((d) => (angleScale(d.label) || 0) + angleScale.bandwidth());

    // Draw radial grid circles
    const gridLevels = 5;
    const gridValues = d3.range(1, gridLevels + 1).map((i) => (i * radius) / gridLevels);

    g.selectAll('.grid-circle')
      .data(gridValues)
      .join('circle')
      .attr('class', 'grid-circle')
      .attr('r', (d) => d)
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '2,2');

    // Draw segments
    const segments = g
      .selectAll('.segment')
      .data(data)
      .join('path')
      .attr('class', 'segment')
      .attr('fill', (d) => color(d.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke-width', 3);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.label}</strong><br/>Value: ${d.value.toFixed(1)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8).attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      });

    segments
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('d', arc as any)
      .attr('opacity', 0.8);

    // Labels
    data.forEach((d, i) => {
      const angle = (angleScale(d.label) || 0) + angleScale.bandwidth() / 2;
      const labelRadius = radiusScale(d.value) + 20;
      const x = labelRadius * Math.sin(angle);
      const y = -labelRadius * Math.cos(angle);

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(d.label)
        .transition()
        .delay(data.length * 100 + 400)
        .duration(400)
        .style('opacity', 1);
    });

    // Grid labels (values)
    gridValues.forEach((gridRadius, i) => {
      const value = radiusScale.invert(gridRadius);
      g.append('text')
        .attr('x', 5)
        .attr('y', -gridRadius)
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(value.toFixed(0));
    });

    // Center point
    g.append('circle').attr('r', 3).attr('fill', '#333');

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Polar Area Chart (Coxcomb)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
