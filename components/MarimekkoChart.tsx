'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface MarimekkoData {
  category: string;
  segments: { name: string; value: number }[];
}

interface MarimekkoChartProps {
  data: MarimekkoData[];
  width?: number;
  height?: number;
}

export default function MarimekkoChart({ data, width = 800, height = 500 }: MarimekkoChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 120, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate totals and widths
    const categoryTotals = data.map((d) => ({
      category: d.category,
      total: d3.sum(d.segments, (s) => s.value),
      segments: d.segments,
    }));

    const grandTotal = d3.sum(categoryTotals, (d) => d.total);

    // X scale (proportional widths)
    let xOffset = 0;
    const xPositions = new Map<string, { start: number; end: number }>();

    categoryTotals.forEach((cat) => {
      const catWidth = (cat.total / grandTotal) * innerWidth;
      xPositions.set(cat.category, { start: xOffset, end: xOffset + catWidth });
      xOffset += catWidth;
    });

    // Y scale (normalized to 100%)
    const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // Collect all segment names for color scale
    const allSegmentNames = Array.from(new Set(data.flatMap((d) => d.segments.map((s) => s.name))));

    const color = d3.scaleOrdinal<string>().domain(allSegmentNames).range(d3.schemeSet2);

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

    // Draw stacked segments for each category
    categoryTotals.forEach((catData, catIndex) => {
      const xPos = xPositions.get(catData.category);
      if (!xPos) return;

      const catWidth = xPos.end - xPos.start;
      let yOffset = 0;

      catData.segments.forEach((segment, segIndex) => {
        const segmentPercent = (segment.value / catData.total) * 100;
        const segmentHeight = ((100 - segmentPercent - yOffset) / 100) * innerHeight;

        g.append('rect')
          .attr('x', xPos.start)
          .attr('y', innerHeight)
          .attr('width', catWidth)
          .attr('height', 0)
          .attr('fill', color(segment.name))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .on('mouseover', function (event) {
            d3.select(this).attr('opacity', 0.8);
            tooltip
              .style('opacity', 1)
              .html(
                `<strong>${catData.category}</strong><br/>Segment: ${segment.name}<br/>Value: ${segment.value}<br/>Percentage: ${segmentPercent.toFixed(1)}%<br/>Category Total: ${catData.total}`
              )
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', function () {
            d3.select(this).attr('opacity', 1);
            tooltip.style('opacity', 0);
          })
          .transition()
          .duration(800)
          .delay(catIndex * 150 + segIndex * 50)
          .attr('y', y(100 - yOffset))
          .attr(
            'height',
            ((yOffset + segmentPercent) / 100) * innerHeight - (yOffset / 100) * innerHeight
          );

        yOffset += segmentPercent;
      });

      // Category label
      g.append('text')
        .attr('x', xPos.start + catWidth / 2)
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text(catData.category);

      // Total value label
      g.append('text')
        .attr('x', xPos.start + catWidth / 2)
        .attr('y', innerHeight + 35)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(`(${catData.total})`);
    });

    // Y axis
    g.append('g').call(d3.axisLeft(y).tickFormat((d) => `${d}%`));

    // Legend
    const legend = g.append('g').attr('transform', `translate(${innerWidth + 10}, 0)`);

    allSegmentNames.forEach((name, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color(name))
        .attr('rx', 2);

      legendRow.append('text').attr('x', 18).attr('y', 10).style('font-size', '11px').text(name);
    });

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Market Share Analysis (Marimekko)');

    // Axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Percentage (%)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
