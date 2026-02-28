'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface BeeswarmData {
  category: string;
  values: number[];
}

interface BeeswarmPlotProps {
  data: BeeswarmData[];
  width?: number;
  height?: number;
  radius?: number;
}

export default function BeeswarmPlot({
  data,
  width = 700,
  height = 400,
  radius = 4,
}: BeeswarmPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const categories = data.map((d) => d.category);
    const x = d3.scaleBand().domain(categories).range([0, innerWidth]).padding(0.5);

    const allValues = data.flatMap((d) => d.values);
    const y = d3
      .scaleLinear()
      .domain([d3.min(allValues) || 0, d3.max(allValues) || 100])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal<string>().domain(categories).range(d3.schemeSet2);

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

    // Collision detection using force simulation
    data.forEach((categoryData, catIndex) => {
      const categoryX = x(categoryData.category) || 0;
      const bandWidth = x.bandwidth();

      // Create nodes for simulation
      const nodes = categoryData.values.map((value) => ({
        value,
        x: categoryX + bandWidth / 2,
        y: y(value),
        vx: 0,
        vy: 0,
      }));

      // Force simulation to prevent overlap
      const simulation = d3
        .forceSimulation(nodes)
        .force('x', d3.forceX((d: any) => categoryX + bandWidth / 2).strength(0.8))
        .force('y', d3.forceY((d: any) => y(d.value)).strength(0.2))
        .force('collide', d3.forceCollide(radius + 1))
        .stop();

      // Run simulation
      for (let i = 0; i < 120; i++) simulation.tick();

      // Draw circles
      g.selectAll(`.bee-${catIndex}`)
        .data(nodes)
        .join('circle')
        .attr('class', `bee-${catIndex}`)
        .attr('cx', categoryX + bandWidth / 2)
        .attr('cy', innerHeight)
        .attr('r', 0)
        .attr('fill', color(categoryData.category))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)
        .on('mouseover', function (event, d: any) {
          d3.select(this)
            .attr('r', radius + 2)
            .attr('opacity', 1)
            .attr('stroke-width', 2);
          tooltip
            .style('opacity', 1)
            .html(`<strong>${categoryData.category}</strong><br/>Value: ${d.value.toFixed(2)}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', radius).attr('opacity', 0.7).attr('stroke-width', 1);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => catIndex * 200 + i * 10)
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
        .attr('r', radius);
    });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g').call(d3.axisLeft(y));

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Category');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Value');

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Distribution Comparison (Beeswarm)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, radius]);

  return <svg ref={svgRef}></svg>;
}
