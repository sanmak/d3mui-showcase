'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface VennSet {
  id: string;
  label: string;
  size: number;
}

export interface VennIntersection {
  sets: string[];
  size: number;
}

export interface VennDiagramData {
  sets: VennSet[];
  intersections: VennIntersection[];
}

interface VennDiagramProps {
  data: VennDiagramData;
  width?: number;
  height?: number;
}

export default function VennDiagram({ data, width = 600, height = 500 }: VennDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.sets.length) return;

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    // Simple 2-3 circle Venn layout
    const numSets = data.sets.length;
    const baseRadius = Math.min(innerWidth, innerHeight) / 4;

    // Calculate circle positions
    const circles: { id: string; x: number; y: number; r: number; label: string }[] = [];

    if (numSets === 2) {
      const offset = baseRadius * 0.6;
      circles.push({
        id: data.sets[0].id,
        x: centerX - offset,
        y: centerY,
        r: baseRadius,
        label: data.sets[0].label,
      });
      circles.push({
        id: data.sets[1].id,
        x: centerX + offset,
        y: centerY,
        r: baseRadius,
        label: data.sets[1].label,
      });
    } else if (numSets === 3) {
      const offset = baseRadius * 0.65;
      const angle = (2 * Math.PI) / 3;
      circles.push({
        id: data.sets[0].id,
        x: centerX + offset * Math.cos(-Math.PI / 2),
        y: centerY + offset * Math.sin(-Math.PI / 2),
        r: baseRadius,
        label: data.sets[0].label,
      });
      circles.push({
        id: data.sets[1].id,
        x: centerX + offset * Math.cos(-Math.PI / 2 + angle),
        y: centerY + offset * Math.sin(-Math.PI / 2 + angle),
        r: baseRadius,
        label: data.sets[1].label,
      });
      circles.push({
        id: data.sets[2].id,
        x: centerX + offset * Math.cos(-Math.PI / 2 + 2 * angle),
        y: centerY + offset * Math.sin(-Math.PI / 2 + 2 * angle),
        r: baseRadius,
        label: data.sets[2].label,
      });
    } else {
      // Default single circle
      circles.push({
        id: data.sets[0].id,
        x: centerX,
        y: centerY,
        r: baseRadius,
        label: data.sets[0].label,
      });
    }

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.sets.map((s) => s.id))
      .range(['#2196f3', '#f44336', '#4caf50', '#ff9800']);

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

    // Draw circles
    circles.forEach((circle, i) => {
      g.append('circle')
        .attr('cx', circle.x)
        .attr('cy', circle.y)
        .attr('r', 0)
        .attr('fill', color(circle.id))
        .attr('opacity', 0.5)
        .attr('stroke', color(circle.id))
        .attr('stroke-width', 2)
        .on('mouseover', function (event) {
          d3.select(this).attr('opacity', 0.7).attr('stroke-width', 3);
          const setData = data.sets.find((s) => s.id === circle.id);
          tooltip
            .style('opacity', 1)
            .html(`<strong>${circle.label}</strong><br/>Size: ${setData?.size || 0}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 0.5).attr('stroke-width', 2);
          tooltip.style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay(i * 200)
        .attr('r', circle.r);

      // Labels
      g.append('text')
        .attr('x', circle.x)
        .attr('y', circle.y - circle.r - 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('fill', color(circle.id))
        .style('opacity', 0)
        .text(circle.label)
        .transition()
        .delay(circles.length * 200 + 400)
        .duration(400)
        .style('opacity', 1);
    });

    // Draw intersection labels
    data.intersections.forEach((intersection, i) => {
      if (intersection.sets.length === 2 && circles.length >= 2) {
        const circle1 = circles.find((c) => c.id === intersection.sets[0]);
        const circle2 = circles.find((c) => c.id === intersection.sets[1]);
        if (circle1 && circle2) {
          const x = (circle1.x + circle2.x) / 2;
          const y = (circle1.y + circle2.y) / 2;

          g.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '14px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text(intersection.size)
            .transition()
            .delay(circles.length * 200 + 600 + i * 100)
            .duration(400)
            .style('opacity', 1);
        }
      } else if (intersection.sets.length === 3 && circles.length === 3) {
        g.append('text')
          .attr('x', centerX)
          .attr('y', centerY)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '14px')
          .style('font-weight', '700')
          .style('opacity', 0)
          .text(intersection.size)
          .transition()
          .delay(circles.length * 200 + 800)
          .duration(400)
          .style('opacity', 1);
      }
    });

    // Individual set counts (non-overlapping portions)
    circles.forEach((circle, i) => {
      const setData = data.sets.find((s) => s.id === circle.id);
      if (!setData) return;

      // Calculate position for individual count
      let labelX = circle.x;
      let labelY = circle.y;

      if (numSets === 2) {
        labelX = i === 0 ? circle.x - circle.r * 0.5 : circle.x + circle.r * 0.5;
      } else if (numSets === 3) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        labelX = circle.x + Math.cos(angle) * circle.r * 0.5;
        labelY = circle.y + Math.sin(angle) * circle.r * 0.5;
      }

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(setData.size)
        .transition()
        .delay(circles.length * 200 + 1000)
        .duration(400)
        .style('opacity', 1);
    });

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Set Relationships (Venn Diagram)');

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
