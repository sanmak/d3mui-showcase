'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BarChartData } from '@/utils/mockData';

interface PieChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  innerRadius?: number;
}

export default function PieChart({
  data,
  width = 500,
  height = 500,
  innerRadius = 0,
}: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const radius = Math.min(width, height) / 2 - 40;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(d3.schemeSet3);

    const pie = d3
      .pie<BarChartData>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<BarChartData>>().innerRadius(innerRadius).outerRadius(radius);

    const arcHover = d3
      .arc<d3.PieArcDatum<BarChartData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10);

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

    const arcs = g.selectAll('.arc').data(pie(data)).join('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('fill', (d) => color(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover as any);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.label}</strong><br/>Value: ${d.data.value}<br/>Percentage: ${((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(1)}%`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc as any);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .attrTween('d', function (d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t: number) {
          return arc(interpolate(t)) || '';
        };
      });

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .style('opacity', 0)
      .text((d) => d.data.label)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, innerRadius]);

  return <svg ref={svgRef}></svg>;
}
