'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LargeScatterPoint } from '@/utils/mockData';

interface HybridCanvasScatterProps {
  data: LargeScatterPoint[];
  width?: number;
  height?: number;
}

export default function HybridCanvasScatter({
  data,
  width = 900,
  height = 460,
}: HybridCanvasScatterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) || 100])
      .nice()
      .range([margin.left, margin.left + innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 100])
      .nice()
      .range([margin.top + innerHeight, margin.top]);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(25, 118, 210, 0.35)';
    data.forEach((point) => {
      ctx.beginPath();
      ctx.arc(x(point.x), y(point.y), 1.7, 0, Math.PI * 2);
      ctx.fill();
    });

    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    svg
      .append('g')
      .attr('transform', `translate(0,${margin.top + innerHeight})`)
      .call(d3.axisBottom(x).ticks(10));

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(8));

    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('X Axis');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerHeight / 2))
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Y Axis');
  }, [data, width, height]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width, height }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <svg ref={svgRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </div>
  );
}
