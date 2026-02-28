'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WaterfallData } from '@/utils/mockData';

interface WaterfallChartProps {
  data: WaterfallData[];
  width?: number;
  height?: number;
}

interface WaterfallBar extends WaterfallData {
  start: number;
  end: number;
}

export default function WaterfallChart({ data, width = 700, height = 420 }: WaterfallChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 70, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    let cumulative = 0;
    const bars: WaterfallBar[] = data.map((entry) => {
      const start = cumulative;
      cumulative += entry.value;
      return {
        ...entry,
        start,
        end: cumulative,
      };
    });

    const minValue = d3.min(bars, (d) => Math.min(d.start, d.end)) ?? 0;
    const maxValue = d3.max(bars, (d) => Math.max(d.start, d.end)) ?? 0;

    const x = d3
      .scaleBand()
      .domain(bars.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, minValue), maxValue])
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

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#78909c')
      .attr('stroke-width', 1);

    g.selectAll('.wf-bar')
      .data(bars)
      .join('rect')
      .attr('class', 'wf-bar')
      .attr('x', (d) => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .attr('fill', (d) => (d.value >= 0 ? '#2e7d32' : '#d32f2f'))
      .attr('opacity', 0.9)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.label}</strong><br/>Change: ${d.value >= 0 ? '+' : ''}${d.value.toFixed(1)}<br/>Cumulative: ${d.end.toFixed(1)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', (d) => y(Math.max(d.start, d.end)))
      .attr('height', (d) => Math.abs(y(d.start) - y(d.end)));

    g.selectAll('.connector')
      .data(bars.slice(0, -1))
      .join('line')
      .attr('class', 'connector')
      .attr('x1', (d) => (x(d.label) || 0) + x.bandwidth())
      .attr('x2', (_, index) => x(bars[index + 1].label) || 0)
      .attr('y1', (d) => y(d.end))
      .attr('y2', (d) => y(d.end))
      .attr('stroke', '#607d8b')
      .attr('stroke-dasharray', '4,3');

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-20)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Stages');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Cumulative Value');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
