'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FunnelStageData } from '@/utils/mockData';

interface FunnelChartProps {
  data: FunnelStageData[];
  width?: number;
  height?: number;
}

export default function FunnelChart({ data, width = 600, height = 420 }: FunnelChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(data, (d) => d.value) || 1;
    const stageHeight = innerHeight / data.length;
    const widthScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([innerWidth * 0.25, innerWidth]);
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, data.length - 1]);

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

    data.forEach((stage, index) => {
      const topWidth = widthScale(stage.value);
      const nextValue = data[index + 1]?.value ?? stage.value * 0.8;
      const bottomWidth = widthScale(nextValue);
      const yTop = index * stageHeight;
      const yBottom = (index + 1) * stageHeight;
      const topLeft = (innerWidth - topWidth) / 2;
      const topRight = topLeft + topWidth;
      const bottomLeft = (innerWidth - bottomWidth) / 2;
      const bottomRight = bottomLeft + bottomWidth;

      const path = `M ${topLeft},${yTop} L ${topRight},${yTop} L ${bottomRight},${yBottom} L ${bottomLeft},${yBottom} Z`;

      g.append('path')
        .attr('d', path)
        .attr('fill', colorScale(index))
        .attr('opacity', 0)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .on('mouseover', function (event) {
          d3.select(this).attr('opacity', 1);
          const conversion = index === 0 ? 100 : (stage.value / data[index - 1].value) * 100;

          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${stage.stage}</strong><br/>Value: ${stage.value.toLocaleString()}<br/>Step Conversion: ${conversion.toFixed(1)}%`
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
        .delay(index * 80)
        .attr('opacity', 0.88);

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', yTop + stageHeight / 2 + 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#0d1b2a')
        .style('font-weight', '600')
        .text(`${stage.stage}: ${stage.value.toLocaleString()}`);
    });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
