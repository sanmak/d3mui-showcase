'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CandlestickData } from '@/utils/mockData';

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
}

export default function CandlestickChart({
  data,
  width = 760,
  height = 420,
}: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d3.timeFormat('%Y-%m-%d')(d.date)))
      .range([0, innerWidth])
      .padding(0.35);

    const minPrice = d3.min(data, (d) => d.low) ?? 0;
    const maxPrice = d3.max(data, (d) => d.high) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([minPrice * 0.98, maxPrice * 1.02])
      .nice()
      .range([innerHeight, 0]);

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

    g.selectAll('.wick')
      .data(data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', (d) => (x(d3.timeFormat('%Y-%m-%d')(d.date)) || 0) + x.bandwidth() / 2)
      .attr('x2', (d) => (x(d3.timeFormat('%Y-%m-%d')(d.date)) || 0) + x.bandwidth() / 2)
      .attr('y1', (d) => y(d.high))
      .attr('y2', (d) => y(d.low))
      .attr('stroke', '#546e7a')
      .attr('stroke-width', 1.3)
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    g.selectAll('.candle')
      .data(data)
      .join('rect')
      .attr('class', 'candle')
      .attr('x', (d) => x(d3.timeFormat('%Y-%m-%d')(d.date)) || 0)
      .attr('y', (d) => y(Math.max(d.open, d.close)))
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (d) => (d.close >= d.open ? '#2e7d32' : '#c62828'))
      .attr('opacity', 0.88)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d3.timeFormat('%b %d, %Y')(d.date)}</strong><br/>Open: ${d.open.toFixed(2)}<br/>High: ${d.high.toFixed(2)}<br/>Low: ${d.low.toFixed(2)}<br/>Close: ${d.close.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.88);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, i) => i * 15)
      .attr('height', (d) => Math.max(2, Math.abs(y(d.open) - y(d.close))));

    const xTickValues = x.domain().filter((_, index) => index % 5 === 0);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(xTickValues)
          .tickFormat((value) => d3.timeFormat('%b %d')(new Date(value)))
      );

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 12)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Date');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Price');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
