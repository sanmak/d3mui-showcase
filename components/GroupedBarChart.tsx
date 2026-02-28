'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface GroupedBarData {
  category: string;
  values: { series: string; value: number }[];
}

interface GroupedBarChartProps {
  data: GroupedBarData[];
  width?: number;
  height?: number;
}

export default function GroupedBarChart({ data, width = 700, height = 400 }: GroupedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract series names
    const seriesNames = data[0]?.values.map((v) => v.series) || [];
    const categories = data.map((d) => d.category);

    // Scales
    const x0 = d3.scaleBand().domain(categories).range([0, innerWidth]).padding(0.2);

    const x1 = d3.scaleBand().domain(seriesNames).range([0, x0.bandwidth()]).padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(d.values, (v) => v.value)) || 100])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal<string>().domain(seriesNames).range(d3.schemeSet2);

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

    // Draw groups
    const categoryGroup = g
      .selectAll('.category-group')
      .data(data)
      .join('g')
      .attr('class', 'category-group')
      .attr('transform', (d) => `translate(${x0(d.category)},0)`);

    categoryGroup
      .selectAll('rect')
      .data((d) => d.values)
      .join('rect')
      .attr('x', (d) => x1(d.series) || 0)
      .attr('width', x1.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', (d) => color(d.series))
      .attr('rx', 3)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 0.8);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.series}</strong><br/>Value: ${d.value.toFixed(1)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', 1);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => innerHeight - y(d.value));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
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
      .text('Categories');

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
