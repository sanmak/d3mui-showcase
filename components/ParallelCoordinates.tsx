'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ParallelCoordinatesData } from '@/utils/mockData';

interface ParallelCoordinatesProps {
  data: ParallelCoordinatesData[];
  width?: number;
  height?: number;
}

export default function ParallelCoordinates({
  data,
  width = 860,
  height = 440,
}: ParallelCoordinatesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 30, right: 60, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const dimensions = Object.keys(data[0]).filter((key) => key !== 'name');

    const x = d3.scalePoint<string>().domain(dimensions).range([0, innerWidth]).padding(0.5);

    const yScales: Record<string, d3.ScaleLinear<number, number>> = {};
    dimensions.forEach((dimension) => {
      yScales[dimension] = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[dimension] as number) as [number, number])
        .nice()
        .range([innerHeight, 0]);
    });

    const color = d3.scaleSequential(d3.interpolatePlasma).domain([0, data.length - 1]);

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

    const lineGenerator = d3
      .line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveLinear);

    g.selectAll('.parallel-line')
      .data(data)
      .join('path')
      .attr('class', 'parallel-line')
      .attr(
        'd',
        (row) =>
          lineGenerator(
            dimensions.map(
              (dimension) =>
                [x(dimension) || 0, yScales[dimension](row[dimension] as number)] as [
                  number,
                  number,
                ]
            )
          ) || ''
      )
      .attr('fill', 'none')
      .attr('stroke', (_, index) => color(index))
      .attr('stroke-width', 1.8)
      .attr('stroke-opacity', 0)
      .on('mouseover', function (event, row) {
        d3.select(this).attr('stroke-width', 3).attr('stroke-opacity', 1);
        const values = dimensions
          .map((dimension) => `${dimension}: ${(row[dimension] as number).toFixed(1)}`)
          .join('<br/>');
        tooltip
          .style('opacity', 1)
          .html(`<strong>${row.name}</strong><br/>${values}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1.8).attr('stroke-opacity', 0.55);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .delay((_, index) => index * 20)
      .attr('stroke-opacity', 0.55);

    dimensions.forEach((dimension) => {
      const axisGroup = g
        .append('g')
        .attr('transform', `translate(${x(dimension)},0)`)
        .call(d3.axisLeft(yScales[dimension]));

      axisGroup
        .append('text')
        .attr('y', -12)
        .attr('text-anchor', 'middle')
        .style('fill', '#263238')
        .style('font-size', '12px')
        .text(dimension);
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
