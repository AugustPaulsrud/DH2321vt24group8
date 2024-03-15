import React, { useEffect, useRef, useState } from 'react';
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
    study1: string;
    study2: string;
    data1: dataFormat[];
    data2: dataFormat[];
    colorScale: d3.ScaleOrdinal<string, string>;
    selectedMarkers: string[];
    allMarkerGroups: string[];
    timeStart: number;
    timeEnd: number;
}

const x_label = "TIME (s)";
const y_label = "VELOCITY (mm/s)";

export const VelocityChart: React.FC<VelocityChartProps> = (props) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [pausedTime, setPausedTime] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [timeRange, setTimeRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

    const svgRef = useRef<SVGSVGElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = 1300 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Hook to handle the initial setup of the chart by setting the max time as the current time
    useEffect(() => {
        if (!initialized && props.data1.length && props.data2.length) {
            const allData = [...props.data1, ...props.data2];
            const maxTime = d3.max(allData, d => d.time)!;
            setCurrentTime(maxTime);
            setInitialized(true);
        }
    }, [props.data1, props.data2, initialized]);
    
    // Hook to handle the initial setup of the play/pause functionality
    useEffect(() => {
        if (!props.data1.length || !props.data2.length || !svgRef.current) return;

        const allData = [...props.data1, ...props.data2];
        const minTime = d3.min(allData, d => d.time)!;
        const maxTime = d3.max(allData, d => d.time)!;
        setTimeRange({ min: minTime, max: maxTime });

        if (!isPlaying && pausedTime !== null) setCurrentTime(pausedTime);
    }, [props.data1, props.data2, isPlaying, pausedTime]);

    // Hook to handle the play/pause functionality
    useEffect(() => {
        if (!isPlaying) return;

        intervalRef.current = setInterval(() => {
            setCurrentTime(prevTime => {
                const nextTime = prevTime + 0.1; // Adjust speed as needed
                return nextTime > timeRange.max ? timeRange.min : nextTime;
            });
        }, 100); // Adjust interval as needed

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPlaying, timeRange]);

    // Hook to handle the rendering of the chart
    useEffect(() => {
        if (!svgRef.current) return;

        // Combine data from both CSV files
        const filteredData1 = props.data1.filter((d) => !isNaN(d.velocity) && d.time >= timeRange.min && d.time <= currentTime);
        const filteredData2 = props.data2.filter((d) => !isNaN(d.velocity) && d.time >= timeRange.min && d.time <= currentTime);
        const combinedData = [...filteredData1, ...filteredData2];

        console.log(filteredData1);
        console.log(filteredData2);

        // Create scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([timeRange.min, currentTime]) // Update the x-scale domain to [timeRange.min, currentTime]
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

        // Append x-axis
        const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f")); // Adjust ticks as needed
        svg.append("g")
            .attr("transform", `translate(0, ${height + margin.top})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // Append lines for the data
        // svg.selectAll(".line")
        //     .data([filteredData1, filteredData2])
        //     .join("path")
        //     .attr("class", "line")
        //     .attr("d", line)
        //     .style("stroke", (d, i) => i === 0 ? "blue" : "red")
        //     .style("fill", "none")
        //     .style("stroke-width", 2);
        if (props.study1 != "") {
        svg.selectAll(".line")
            .data([filteredData1])
            .join("path")
            .attr("class", "line1")
            .attr("d", line)
            .style("stroke", "blue")
            .style("fill", "none")
            .style("stroke-width", 2);
        }
        
        if (props.study2 != "") {
            svg.selectAll(".line2")
            .data([filteredData2])
            .join("path")
            .attr("class", "line2")
            .attr("d", line)
            .style("stroke", "red")
            .style("fill", "none")
            .style("stroke-width", 2);
        }

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

    }, [props.data1, props.data2, props.study1, props.study2, timeRange, currentTime, width, height]);

    const handlePlayPause = () => {
        setIsPlaying(prev => {
            if (!prev) {
                setPausedTime(currentTime); // Store current time before pausing
            } else {
                setPausedTime(null);
            }
            return !prev;
        });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(Number(e.target.value));
    };
    return (
        <div className="flex flex-col justify-center items-center mt-4">
            <h1 className='font-bold'>Velocity-Time Chart</h1>
            <div className="flex mt-4">
                {props.study1 === "" ? (<></>) : (
                <div className="flex mr-4">
                    <div className="w-4 h-4 mt-1 mr-2 bg-blue-600 rounded-full"></div>
                    <span>{props.study1}</span>
                </div>
                )}
                {props.study2 === "" ? (<></>) : (
                <div className="flex ml-4">
                    <div className="w-4 h-4 mt-1 mr-2 bg-red-500 rounded-full"></div>
                    <span>{props.study2}</span>
                </div>
                )}
            </div>
            <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}></svg>
            <div className="flex justify-center rounded-md p-4 w-4/5 border border-gray-300 bg-white">
                <button onClick={handlePlayPause} className={`px-6 py-2 rounded-md ${isPlaying ? 'bg-gray-300' : 'bg-blue-900 text-white'}`}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="my-2 mx-4">Min:</span>
                <input
                    type="number"
                    min={timeRange.min}
                    max={timeRange.max}
                    value={timeRange.min}
                    onChange={(e) => {
                        const newValue = Math.min(Number(e.target.value), timeRange.max);
                        setTimeRange(prev => ({ ...prev, min: newValue }));
                        setCurrentTime(prev => Math.max(newValue, prev));
                    }}
                    className="w-1/5 mr-4"
                />
                <input
                    type="range"
                    min={timeRange.min}
                    max={timeRange.max}
                    value={isPlaying ? currentTime : pausedTime !== null ? pausedTime : currentTime}
                    onChange={handleTimeChange}
                    step={0.01}
                    className="w-3/4"
                />
                <span className="my-2 ml-4">Max:</span>
                <input
                    type="number"
                    min={timeRange.min}
                    max={timeRange.max}
                    value={timeRange.max}
                    onChange={(e) => {
                        const newValue = Math.max(Number(e.target.value), timeRange.min);
                        setTimeRange(prev => ({ ...prev, max: newValue }));
                        setCurrentTime(prev => Math.min(newValue, prev));
                    }}
                    className="w-1/5 ml-4"
                />
            </div>
        </div>
    );    
};
