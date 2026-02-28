'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ViolinPlotGroup {
  category: string;
  values: number[];
}

interface ViolinPlotProps {
  data: ViolinPlotGroup[];
  width?: number;
  height?: number;
}

export default function ViolinPlot({ data, width = 600, height = 400 }: ViolinPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allValues = data.flatMap((group) => group.values);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(allValues) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    const x = d3
      .scaleBand()
      .domain(data.map((group) => group.category))
      .range([0, innerWidth])
      .padding(0.25);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((group) => group.category))
      .range(['#1976d2', '#4caf50', '#ff9800', '#9c27b0']);

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

    data.forEach((group) => {
      const center = (x(group.category) || 0) + x.bandwidth() / 2;
      const values = [...group.values].sort((a, b) => a - b);

      const bins = d3
        .bin<number, number>()
        .domain(y.domain() as [number, number])
        .thresholds(24)(values);

      const maxBin = d3.max(bins, (bin) => bin.length) || 1;
      const violinWidth = x.bandwidth() / 2;
      const densityScale = d3.scaleLinear().domain([0, maxBin]).range([0, violinWidth]);

      const area = d3
        .area<d3.Bin<number, number>>()
        .x0((bin) => center - densityScale(bin.length))
        .x1((bin) => center + densityScale(bin.length))
        .y((bin) => y(((bin.x0 ?? 0) + (bin.x1 ?? 0)) / 2))
        .curve(d3.curveCatmullRom);

      g.append('path')
        .datum(bins)
        .attr('d', area)
        .attr('fill', color(group.category))
        .attr('opacity', 0)
        .attr('stroke', color(group.category))
        .attr('stroke-width', 1.5)
        .on('mouseover', function (event) {
          d3.select(this).attr('opacity', 0.8);

          const q1 = d3.quantileSorted(values, 0.25) ?? values[0];
          const median = d3.quantileSorted(values, 0.5) ?? values[0];
          const q3 = d3.quantileSorted(values, 0.75) ?? values[values.length - 1];

          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${group.category}</strong><br/>Q1: ${q1.toFixed(2)}<br/>Median: ${median.toFixed(2)}<br/>Q3: ${q3.toFixed(2)}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 0.6);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(800)
        .attr('opacity', 0.6);

      const median = d3.quantileSorted(values, 0.5) ?? values[0];
      g.append('line')
        .attr('x1', center - violinWidth * 0.45)
        .attr('x2', center + violinWidth * 0.45)
        .attr('y1', y(median))
        .attr('y2', y(median))
        .attr('stroke', '#0d47a1')
        .attr('stroke-width', 2);
    });

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

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
