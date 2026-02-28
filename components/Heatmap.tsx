'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapProps {
  data: number[][];
  width?: number;
  height?: number;
}

export default function Heatmap({ data, width = 600, height = 400 }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 100, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const rows = data.length;
    const cols = data[0].length;
    const cellWidth = innerWidth / cols;
    const cellHeight = innerHeight / rows;

    const minValue = d3.min(data.flat()) || 0;
    const maxValue = d3.max(data.flat()) || 100;

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([minValue, maxValue]);

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

    const cells = g
      .selectAll('g')
      .data(data.flatMap((row, i) => row.map((value, j) => ({ i, j, value }))))
      .join('g');

    cells
      .append('rect')
      .attr('x', (d) => d.j * cellWidth)
      .attr('y', (d) => d.i * cellHeight)
      .attr('width', cellWidth - 1)
      .attr('height', cellHeight - 1)
      .attr('fill', (d) => colorScale(d.value))
      .attr('opacity', 0)
      .attr('rx', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', '#000').attr('stroke-width', 2);
        tooltip
          .style('opacity', 1)
          .html(`<strong>Cell [${d.i}, ${d.j}]</strong><br/>Value: ${d.value.toFixed(2)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.9).attr('stroke', 'none');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 5)
      .attr('opacity', 0.9);

    const legendWidth = 20;
    const legendHeight = innerHeight;

    const legendScale = d3.scaleLinear().domain([minValue, maxValue]).range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale).ticks(5);

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 20},${margin.top})`);

    const legendGradient = legend
      .append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '100%')
      .attr('y2', '0%');

    legendGradient
      .selectAll('stop')
      .data(
        d3.range(0, 1.01, 0.01).map((t) => ({
          offset: `${t * 100}%`,
          color: colorScale(minValue + t * (maxValue - minValue)),
        }))
      )
      .join('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    legend.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(legendAxis);

    legend
      .append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Intensity');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
