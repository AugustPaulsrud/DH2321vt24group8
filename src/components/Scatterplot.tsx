import * as d3 from 'd3';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { useEffect, useState } from 'react';
import { DSVRowArray } from 'd3';
import { InteractionData, Tooltip } from "./Tooltip";

// https://d3js.org/d3-zoom
// https://observablehq.com/@d3/x-y-zoom?collection=@d3/d3-zoom
// https://d3-graph-gallery.com/graph/line_select.html

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

type ScatterplotProps = {
  width: number;
  height: number;
  csv_file: string;
  //data: { x: number; y: number }[];
};

type dataFormat = {
  x: number; 
  y: number;
  group: string;
};

type CSVData = dataFormat | null; //DSVRowArray | null;

const x_label = "TIME";
const y_label = "X";

export const Scatterplot = ({ width, height, csv_file }: ScatterplotProps) => {
  //const initialState: CSVData = null;

  // useMemo instead?
  //const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]); //useState<CSVData>(initialState);

  const [hovered, setHovered] = useState<InteractionData | null>(null);


  //const [data, setData] = useState<dataFormat[]>([]);

  let fetchedCSVData: dataFormat[] = [];

  d3.csv(`${process.env.PUBLIC_URL}/data/csv/${csv_file}.csv`).then(res => {
        fetchedCSVData = res.map((d: any) => ({
          x: d.X,
          y: d.Y,
          group: d.MARKER_NR,
        }));
        //fetchedCSVData.push(res);
      });
  
  // if (!(fetchedCSVData && fetchedCSVData.length)) {
  //   d3.csv(`${process.env.PUBLIC_URL}/data/csv/${csv_file}.csv`).then(res => {
  //     const processedData = res.map((d: any) => ({
  //       x: d.X,
  //       y: d.Y,
  //       group: d.MARKER_NR,
  //     }));
  //     //setFetchedCSVdata(res);
  //     setFetchedCSVdata(processedData);
  //   });
  // }
  
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Scales
  const yScale = d3.scaleLinear().domain([0, 400]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([-100, 500]).range([0, boundsWidth]);

  const allGroups = fetchedCSVData.map((d) => String(d.group));
  
  // add the options to the button
  d3.select("#selectButton")
  .selectAll('myOptions')
   .data(allGroups)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

  
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(allGroups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"]);

  // Build the shapes
  var allShapes = fetchedCSVData.map((d, i) => {
    return (
      <circle
        key={i}
        r={0.5}
        cx={xScale(d.y)}
        cy={yScale(d.x)}
        opacity={1}
        stroke={colorScale(d.group)}
        fill={colorScale(d.group)}
        fillOpacity={0.2}
        strokeWidth={1}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(d.x),
            yPos: yScale(d.y),
            xRaw: 0,
            yRaw: 0,
            zRaw: 0,
            name: d.group,
            time: 0,
          })
        }
        onMouseLeave={() => setHovered(null)}
      />
    );
  });


  // A function that update the chart
  function update(selectedGroup: any) {

    // Create new data with the selection?
    var dataFilter = fetchedCSVData.filter(function(d){return d.group==selectedGroup})

    // Give these new data to update 
    
      allShapes = dataFilter.map((d, i) => {
          return (
            <circle
              key={i}
              r={0.5}
              cx={xScale(d.y)}
              cy={yScale(d.x)}
              opacity={1}
              stroke={colorScale(d.group)}
              fill={colorScale(d.group)}
              fillOpacity={0.2}
              strokeWidth={1}
              onMouseEnter={() =>
                setHovered({
                  xPos: xScale(d.x),
                  yPos: yScale(d.y),
                  xRaw: 0,
                  yRaw: 0,
                  zRaw: 0,
                  name: d.group,
                  time: 0,
                })
              }
              onMouseLeave={() => setHovered(null)}
            />
          );
        });
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
  })


  return (
    <div>
      <select id="selectButton"></select>
      { (fetchedCSVData && fetchedCSVData.length) ? 
      <>
      <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
      >
        {/* Y axis */}
        <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

        <text
      //   .attr("transform", "rotate(-90)")
      //textAnchor="end"
      x={0}
      y={-25}
      style={{
        fontSize: "15px",
        textAnchor: "end",
        transform: "translateX(-10px)",
        fill: "#505050",
      }}
      >
      ↑ {y_label}
      </text>

        <text
      //textAnchor="end"
      x={boundsWidth}
      y={boundsHeight}
      style={{
        fontSize: "15px",
        textAnchor: "end",
        transform: "translateY(50px)",
        fill: "#505050",
      }}
      >
      {x_label} →
      </text>
      
        {/* X axis, use an additional translation to appear at the bottom */}
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom
            xScale={xScale}
            pixelsPerTick={40}
            height={boundsHeight}
          />
        </g>

        {/* Circles */}
        {allShapes}
      </g>
    </svg>
    {/* Tooltip */}
    <div
        style={{
          width: boundsWidth,
          height: boundsHeight,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top,
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>
      </div>
    </>
       : 
       <h1>Loading...</h1>
       }
    </div>
  );
};