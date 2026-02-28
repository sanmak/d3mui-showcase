'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { StreamgraphDataPoint } from '@/utils/mockData';

interface StreamgraphProps {
  data: StreamgraphDataPoint[];
  width?: number;
  height?: number;
}

export default function Streamgraph({ data, width = 820, height = 420 }: StreamgraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const keys = Object.keys(data[0]).filter((key) => key !== 'date');

    const stack = d3.stack<StreamgraphDataPoint>().keys(keys).offset(d3.stackOffsetWiggle);

    const layers = stack(data);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(layers, (layer) => d3.min(layer, (point) => point[0])) || 0,
        d3.max(layers, (layer) => d3.max(layer, (point) => point[1])) || 0,
      ])
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal<string>().domain(keys).range(d3.schemeSet2);

    const area = d3
      .area<d3.SeriesPoint<StreamgraphDataPoint>>()
      .x((d) => x(d.data.date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

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

    g.selectAll('.stream-layer')
      .data(layers)
      .join('path')
      .attr('class', 'stream-layer')
      .attr('d', area)
      .attr('fill', (d) => color(d.key))
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.95);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.key}</strong>`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(900)
      .delay((_, i) => i * 100)
      .attr('opacity', 0.8);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(8)
          .tickFormat((tick) => d3.timeFormat('%b %d')(tick as Date))
      );

    g.append('g').call(d3.axisLeft(y).ticks(6));

    const legend = g.append('g').attr('transform', `translate(${innerWidth - 120},10)`);

    keys.forEach((key, index) => {
      const row = legend.append('g').attr('transform', `translate(0,${index * 22})`);
      row.append('rect').attr('width', 12).attr('height', 12).attr('fill', color(key));
      row.append('text').attr('x', 18).attr('y', 10).style('font-size', '12px').text(key);
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
