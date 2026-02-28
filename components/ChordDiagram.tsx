'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChordData } from '@/utils/mockData';

interface ChordDiagramProps {
  data: ChordData;
  width?: number;
  height?: number;
}

export default function ChordDiagram({ data, width = 640, height = 640 }: ChordDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.labels.length || !data.matrix.length) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const outerRadius = Math.min(width, height) / 2 - 40;
    const innerRadius = outerRadius - 24;

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    const chords = chord(data.matrix);

    const color = d3.scaleOrdinal<string, string>().domain(data.labels).range(d3.schemeTableau10);

    const arc = d3.arc<d3.ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>().radius(innerRadius);

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

    g.append('g')
      .selectAll('path')
      .data(chords.groups)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => color(data.labels[d.index]))
      .attr('stroke', '#fff')
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${data.labels[d.index]}</strong><br/>Total: ${d.value.toFixed(0)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(700)
      .attr('opacity', 0.9);

    g.append('g')
      .attr('fill-opacity', 0.75)
      .selectAll('path')
      .data(chords)
      .join('path')
      .attr('d', ribbon)
      .attr('fill', (d) => color(data.labels[d.source.index]))
      .attr('stroke', '#eceff1')
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.95);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${data.labels[d.source.index]} → ${data.labels[d.target.index]}</strong><br/>Value: ${d.source.value.toFixed(0)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.75);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(900)
      .delay((_, index) => index * 25)
      .attr('opacity', 0.75);

    g.append('g')
      .selectAll('text')
      .data(chords.groups)
      .join('text')
      .attr('dy', '0.35em')
      .attr('transform', (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const rotation = (angle * 180) / Math.PI - 90;
        const flip = angle > Math.PI ? 180 : 0;
        return `rotate(${rotation}) translate(${outerRadius + 12}) rotate(${flip})`;
      })
      .style('font-size', '12px')
      .style('text-anchor', (d) => ((d.startAngle + d.endAngle) / 2 > Math.PI ? 'end' : 'start'))
      .text((d) => data.labels[d.index]);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
