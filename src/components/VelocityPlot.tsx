import React, { useEffect, useRef, useState } from 'react';
import { InteractionData, Tooltip } from "./Tooltip";
import * as d3 from 'd3';


type dataFormat = {
    time: number;
    x: number; 
    y: number;
    z: number;
    velocity: number;
    group: string;
};

interface VelocityChartProps {
  data1: dataFormat[];
  data2: dataFormat[];
  colorScale: d3.ScaleOrdinal<string, string>;
  selectedMarkers: string[];
  allMarkerGroups: string[];
  timeStart: number;
  timeEnd: number;
}

const x_label = "TIME";
const y_label = "VELOCITY";

export const VelocityChart: React.FC<VelocityChartProps> = (props) => {
    //const [fetchedCSVData1, setFetchedCSVData1] = useState<dataFormat[]>([]);
    //const [fetchedCSVData2, setFetchedCSVData2] = useState<dataFormat[]>([]);
    const [hovered, setHovered] = useState<InteractionData | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);

    // Set the dimensions and margins of the graph
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = 1300 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    useEffect(() => {
        if (!props.data1.length || !props.data2.length || !svgRef.current) return;

        // Combine data from both CSV files
        const filteredData1 = props.data1.filter((d) => d.time >= props.timeStart && d.time <= props.timeEnd && props.selectedMarkers.includes(d.group) && !isNaN(d.velocity));
        const filteredData2 = props.data2.filter((d) => d.time >= props.timeStart && d.time <= props.timeEnd && props.selectedMarkers.includes(d.group) && !isNaN(d.velocity));
        const combinedData = [...filteredData1, ...filteredData2];
        

        // Create scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(combinedData, d => d.time)!])
            .range([margin.left, width + margin.left]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(combinedData, d => d.velocity)!])
            .range([height + margin.top, margin.top]);

        // Create line generator functions
        const line = d3.line<dataFormat>()
            .x(d => xScale(d.time))
            .y(d => yScale(d.velocity));

        // Append SVG elements for axes
        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove(); // Clear previous content

        svg.append("g")
            .attr("transform", `translate(0, ${height + margin.top})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // Append lines for the data
        svg.selectAll(".line")
            .data([filteredData1, filteredData2])
            .join("path")
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", (d, i) => i === 0 ? "blue" : "red")
            .style("fill", "none")
            .style("stroke-width", 2);
        
        // Append labels for the x-axis
        svg.append("text")
            .attr("transform", `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
            .style("text-anchor", "middle")
            .text(x_label);
        
        // Append label for the y-axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0 - (height / 2 + margin.top))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(y_label);
        
        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width + margin.left - 100}, ${margin.top})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "blue");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Study #1");
            
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 30)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "red");
        
        legend.append("text")
            .attr("x", 20)
            .attr("y", 40)
            .text("Study #2");

    }, [props.data1, props.data2, props.timeStart, props.timeEnd, props.selectedMarkers, margin, width, height]);

    return (
        <div className="justify-center items-center">
            <h1>Velocity-Time Chart</h1>
            <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}></svg>
        </div>
    );
};
