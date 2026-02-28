'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ScatterPlotData } from '@/utils/mockData';

interface ScatterPlotProps {
  data: ScatterPlotData[];
  width?: number;
  height?: number;
}

export default function ScatterPlot({ data, width = 600, height = 400 }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) || 100])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 100])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(['A', 'B', 'C'])
      .range(['#1976d2', '#dc004e', '#4caf50']);

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

    g.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 0)
      .attr('fill', (d) => colorScale(d.category))
      .attr('opacity', 0.7)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Category ${d.category}</strong><br/>X: ${d.x.toFixed(1)}<br/>Y: ${d.y.toFixed(1)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5).attr('opacity', 0.7);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 5)
      .attr('r', 5);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('X Axis');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Y Axis');

    const legend = g.append('g').attr('transform', `translate(${innerWidth + 20},20)`);

    const categories = ['A', 'B', 'C'];
    categories.forEach((cat, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 25})`);

      legendRow
        .append('circle')
        .attr('cx', 7)
        .attr('cy', 7)
        .attr('r', 6)
        .attr('fill', colorScale(cat))
        .attr('opacity', 0.7);

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(`Category ${cat}`);
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
