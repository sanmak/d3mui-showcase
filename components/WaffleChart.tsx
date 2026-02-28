'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface WaffleData {
  category: string;
  value: number;
  color?: string;
}

interface WaffleChartProps {
  data: WaffleData[];
  width?: number;
  height?: number;
  gridSize?: number;
  totalSquares?: number;
}

export default function WaffleChart({
  data,
  width = 500,
  height = 500,
  gridSize = 10,
  totalSquares = 100,
}: WaffleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 120, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const squaresPerRow = Math.ceil(Math.sqrt(totalSquares));
    const squareSize = Math.min(innerWidth, innerHeight) / squaresPerRow - 2;

    // Calculate total and normalize
    const total = d3.sum(data, (d) => d.value);
    const normalized = data.map((d) => ({
      ...d,
      count: Math.round((d.value / total) * totalSquares),
    }));

    // Create square data
    const squares: Array<{ category: string; color: string; index: number }> = [];
    let currentIndex = 0;

    normalized.forEach((d, i) => {
      for (let j = 0; j < d.count; j++) {
        squares.push({
          category: d.category,
          color: d.color || d3.schemeSet3[i % d3.schemeSet3.length],
          index: currentIndex++,
        });
      }
    });

    // Fill remaining squares (if any due to rounding)
    while (squares.length < totalSquares) {
      squares.push({
        category: 'Empty',
        color: '#e0e0e0',
        index: currentIndex++,
      });
    }

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

    // Draw squares
    g.selectAll('rect')
      .data(squares)
      .join('rect')
      .attr('x', (d) => (d.index % squaresPerRow) * (squareSize + 2))
      .attr('y', (d) => Math.floor(d.index / squaresPerRow) * (squareSize + 2))
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', (d) => d.color)
      .attr('rx', 2)
      .on('mouseover', function (event, d) {
        if (d.category === 'Empty') return;
        d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
        const categoryData = data.find((item) => item.category === d.category);
        const percentage = categoryData ? ((categoryData.value / total) * 100).toFixed(1) : '0';
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.category}</strong><br/>Value: ${categoryData?.value || 0}<br/>Percentage: ${percentage}%`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', 'none');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d) => d.index * 10)
      .attr('width', squareSize)
      .attr('height', squareSize);

    // Legend
    const legend = g.append('g').attr('transform', `translate(${innerWidth + 20}, 0)`);

    data.forEach((d, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 25})`);

      legendRow
        .append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', d.color || d3.schemeSet3[i % d3.schemeSet3.length])
        .attr('rx', 2);

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 11)
        .style('font-size', '12px')
        .text(`${d.category} (${((d.value / total) * 100).toFixed(1)}%)`);
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, gridSize, totalSquares]);

  return <svg ref={svgRef}></svg>;
}
