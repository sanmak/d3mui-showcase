'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface ContourPoint {
  x: number;
  y: number;
  value: number;
}

interface ContourPlotProps {
  data: ContourPoint[];
  width?: number;
  height?: number;
  thresholds?: number;
}

export default function ContourPlot({
  data,
  width = 700,
  height = 500,
  thresholds = 10,
}: ContourPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.x) || 0, d3.max(data, (d) => d.x) || 100])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y) || 0, d3.max(data, (d) => d.y) || 100])
      .range([innerHeight, 0]);

    const values = data.map((d) => d.value);
    const minValue = d3.min(values) || 0;
    const maxValue = d3.max(values) || 100;

    // Create grid data for contours
    const gridSize = 40;
    const gridData: number[][] = [];

    for (let i = 0; i < gridSize; i++) {
      gridData[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const gridX = (i / (gridSize - 1)) * (x.domain()[1] - x.domain()[0]) + x.domain()[0];
        const gridY = (j / (gridSize - 1)) * (y.domain()[1] - y.domain()[0]) + y.domain()[0];

        // Interpolate value using inverse distance weighting
        let sumWeights = 0;
        let sumValues = 0;

        data.forEach((point) => {
          const distance = Math.sqrt(Math.pow(point.x - gridX, 2) + Math.pow(point.y - gridY, 2));
          const weight = distance === 0 ? 1000 : 1 / (distance * distance);
          sumWeights += weight;
          sumValues += point.value * weight;
        });

        gridData[i][j] = sumValues / sumWeights;
      }
    }

    // Create contours
    const contours = d3.contours().size([gridSize, gridSize]).thresholds(thresholds);

    const contourData = contours(gridData.flat());

    // Color scale
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([minValue, maxValue]);

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

    // Path generator for contours
    const projection = d3
      .geoIdentity()
      .scale(innerWidth / gridSize)
      .translate([0, 0]);

    const path = d3.geoPath().projection(projection);

    // Draw contours
    g.selectAll('path')
      .data(contourData)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d) => colorScale(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 2).attr('stroke', '#333');
        tooltip
          .style('opacity', 1)
          .html(`<strong>Contour Level</strong><br/>Value: ${d.value.toFixed(2)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 0.5).attr('stroke', '#fff');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .attr('opacity', 0.7);

    // Draw data points
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 0)
      .attr('fill', '#333')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .transition()
      .delay(1000)
      .duration(600)
      .attr('r', 3);

    // Axes
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('X Coordinate');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Y Coordinate');

    // Color legend
    const legendWidth = 20;
    const legendHeight = 200;
    const legend = g
      .append('g')
      .attr('transform', `translate(${innerWidth + 20}, ${innerHeight / 2 - legendHeight / 2})`);

    const legendScale = d3.scaleLinear().domain([minValue, maxValue]).range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale).ticks(5);

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'contour-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '100%')
      .attr('y2', '0%');

    const numStops = 10;
    d3.range(numStops).forEach((i) => {
      gradient
        .append('stop')
        .attr('offset', `${(i / (numStops - 1)) * 100}%`)
        .attr('stop-color', colorScale(minValue + (i / (numStops - 1)) * (maxValue - minValue)));
    });

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#contour-gradient)')
      .attr('stroke', '#333');

    legend.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(legendAxis);

    legend
      .append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .text('Value');

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Contour Plot (Isolines)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, thresholds]);

  return <svg ref={svgRef}></svg>;
}
