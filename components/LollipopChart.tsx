'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LollipopData } from '@/utils/mockData';

interface LollipopChartProps {
  data: LollipopData[];
  width?: number;
  height?: number;
}

export default function LollipopChart({ data, width = 700, height = 420 }: LollipopChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const x = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.value) || 1])
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

    g.selectAll('.lollipop-stem')
      .data(sortedData)
      .join('line')
      .attr('class', 'lollipop-stem')
      .attr('x1', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('x2', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y1', innerHeight)
      .attr('y2', innerHeight)
      .attr('stroke', '#90caf9')
      .attr('stroke-width', 3)
      .transition()
      .duration(700)
      .attr('y2', (d) => y(d.value));

    g.selectAll('.lollipop-head')
      .data(sortedData)
      .join('circle')
      .attr('class', 'lollipop-head')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', innerHeight)
      .attr('r', 0)
      .attr('fill', '#1976d2')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 10).attr('fill', '#0d47a1');
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.label}</strong><br/>Value: ${d.value.toFixed(1)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 8).attr('fill', '#1976d2');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, i) => i * 40)
      .attr('cy', (d) => y(d.value))
      .attr('r', 8);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-35)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 15)
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
