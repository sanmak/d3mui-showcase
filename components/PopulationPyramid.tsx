'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}

interface PopulationPyramidProps {
  data: PyramidData[];
  width?: number;
  height?: number;
}

export default function PopulationPyramid({
  data,
  width = 700,
  height = 500,
}: PopulationPyramidProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Y scale (age groups)
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.ageGroup))
      .range([0, innerHeight])
      .padding(0.2);

    // X scale (population count)
    const maxValue = d3.max(data, (d) => Math.max(d.male, d.female)) || 100;
    const x = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth / 2 - 10]);

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

    const centerX = innerWidth / 2;

    // Male bars (left side)
    g.selectAll('.male-bar')
      .data(data)
      .join('rect')
      .attr('class', 'male-bar')
      .attr('x', centerX)
      .attr('y', (d) => y(d.ageGroup) || 0)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#2196f3')
      .attr('rx', 3)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#1976d2');
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.ageGroup}</strong><br/>Male: ${d.male.toLocaleString()}<br/>Total: ${(d.male + d.female).toLocaleString()}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#2196f3');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('x', (d) => centerX - x(d.male))
      .attr('width', (d) => x(d.male));

    // Female bars (right side)
    g.selectAll('.female-bar')
      .data(data)
      .join('rect')
      .attr('class', 'female-bar')
      .attr('x', centerX)
      .attr('y', (d) => y(d.ageGroup) || 0)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#f48fb1')
      .attr('rx', 3)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#ec407a');
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.ageGroup}</strong><br/>Female: ${d.female.toLocaleString()}<br/>Total: ${(d.male + d.female).toLocaleString()}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#f48fb1');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('width', (d) => x(d.female));

    // Center line
    g.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Y axis (age groups)
    g.append('g')
      .attr('transform', `translate(${centerX}, 0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain')
      .remove();

    // X axis (male - left)
    const xAxisLeft = d3
      .axisBottom(x)
      .ticks(5)
      .tickFormat((d) => d.valueOf().toLocaleString());

    g.append('g')
      .attr('transform', `translate(${centerX - innerWidth / 2 + 10}, ${innerHeight})`)
      .call(xAxisLeft)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // X axis (female - right)
    g.append('g')
      .attr('transform', `translate(${centerX}, ${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => d.valueOf().toLocaleString())
      )
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Labels
    g.append('text')
      .attr('x', centerX - innerWidth / 4)
      .attr('y', innerHeight + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#2196f3')
      .text('Male Population');

    g.append('text')
      .attr('x', centerX + innerWidth / 4)
      .attr('y', innerHeight + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#f48fb1')
      .text('Female Population');

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Age Group');

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Population Pyramid');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
