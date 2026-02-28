'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BoxPlotProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function BoxPlot({ data, width = 600, height = 400 }: BoxPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const sorted = [...data].sort((a, b) => a - b);
    const q1 = d3.quantileSorted(sorted, 0.25) ?? sorted[0];
    const median = d3.quantileSorted(sorted, 0.5) ?? sorted[0];
    const q3 = d3.quantileSorted(sorted, 0.75) ?? sorted[sorted.length - 1];
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const nonOutliers = sorted.filter((value) => value >= lowerFence && value <= upperFence);
    const whiskerMin = d3.min(nonOutliers) ?? sorted[0];
    const whiskerMax = d3.max(nonOutliers) ?? sorted[sorted.length - 1];
    const outliers = sorted.filter((value) => value < lowerFence || value > upperFence);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(sorted) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    const boxCenter = innerWidth / 2;
    const boxWidth = Math.min(180, innerWidth * 0.45);

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

    g.append('line')
      .attr('x1', boxCenter)
      .attr('x2', boxCenter)
      .attr('y1', y(whiskerMin))
      .attr('y2', y(whiskerMax))
      .attr('stroke', '#546e7a')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', boxCenter - boxWidth / 4)
      .attr('x2', boxCenter + boxWidth / 4)
      .attr('y1', y(whiskerMin))
      .attr('y2', y(whiskerMin))
      .attr('stroke', '#546e7a')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', boxCenter - boxWidth / 4)
      .attr('x2', boxCenter + boxWidth / 4)
      .attr('y1', y(whiskerMax))
      .attr('y2', y(whiskerMax))
      .attr('stroke', '#546e7a')
      .attr('stroke-width', 2);

    g.append('rect')
      .attr('x', boxCenter - boxWidth / 2)
      .attr('width', boxWidth)
      .attr('y', y(q3))
      .attr('height', 0)
      .attr('fill', '#1976d2')
      .attr('opacity', 0.7)
      .attr('stroke', '#0d47a1')
      .attr('stroke-width', 2)
      .on('mouseover', function (event) {
        d3.select(this).attr('opacity', 0.9);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Q1:</strong> ${q1.toFixed(2)}<br/><strong>Median:</strong> ${median.toFixed(2)}<br/><strong>Q3:</strong> ${q3.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.7);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .attr('y', y(q3))
      .attr('height', y(q1) - y(q3));

    g.append('line')
      .attr('x1', boxCenter - boxWidth / 2)
      .attr('x2', boxCenter + boxWidth / 2)
      .attr('y1', y(median))
      .attr('y2', y(median))
      .attr('stroke', '#0d47a1')
      .attr('stroke-width', 3);

    g.selectAll('.outlier')
      .data(outliers)
      .join('circle')
      .attr('class', 'outlier')
      .attr('cx', boxCenter)
      .attr('cy', (d) => y(d))
      .attr('r', 0)
      .attr('fill', '#dc004e')
      .attr('opacity', 0.9)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 6);
        tooltip
          .style('opacity', 1)
          .html(`<strong>Outlier:</strong> ${d.toFixed(2)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(500)
      .attr('r', 4);

    g.append('g').call(d3.axisLeft(y));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(
          d3
            .scaleBand()
            .domain(['Distribution'])
            .range([boxCenter - boxWidth / 2, boxCenter + boxWidth / 2])
        )
      );

    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Values');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
