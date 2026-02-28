'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HorizonDataPoint } from '@/utils/mockData';

interface HorizonChartProps {
  data: HorizonDataPoint[];
  width?: number;
  height?: number;
}

export default function HorizonChart({ data, width = 860, height = 320 }: HorizonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const maxAbs = d3.max(data, (d) => Math.abs(d.value)) || 1;
    const bands = 3;
    const bandHeight = innerHeight / bands;

    const area = d3
      .area<HorizonDataPoint>()
      .x((d) => x(d.date))
      .y0(bandHeight)
      .y1(
        (d) =>
          bandHeight - (Math.min(Math.abs(d.value), maxAbs / bands) / (maxAbs / bands)) * bandHeight
      )
      .curve(d3.curveMonotoneX);

    for (let band = 0; band < bands; band++) {
      const thresholdLow = (band / bands) * maxAbs;
      const thresholdHigh = ((band + 1) / bands) * maxAbs;

      const clipped = data.map((d) => ({
        ...d,
        value:
          Math.max(0, Math.min(Math.abs(d.value), thresholdHigh) - thresholdLow) *
          (d.value >= 0 ? 1 : -1),
      }));

      g.append('path')
        .datum(clipped.filter((d) => d.value >= 0))
        .attr('transform', `translate(0,${innerHeight - (band + 1) * bandHeight})`)
        .attr('d', area)
        .attr('fill', d3.interpolateBlues((band + 1) / bands))
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 0.8);

      g.append('path')
        .datum(clipped.filter((d) => d.value < 0).map((d) => ({ ...d, value: -d.value })))
        .attr(
          'transform',
          `translate(0,${innerHeight - (band + 1) * bandHeight}) scale(1,-1) translate(0,${-2 * (innerHeight - (band + 1) * bandHeight)})`
        )
        .attr('d', area)
        .attr('fill', d3.interpolateReds((band + 1) / bands))
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 0.65);
    }

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', innerHeight)
      .attr('y2', innerHeight)
      .attr('stroke', '#607d8b');
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(8)
          .tickFormat((d) => d3.timeFormat('%b %d')(d as Date))
      );
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
