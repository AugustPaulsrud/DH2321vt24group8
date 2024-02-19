import * as d3 from 'd3';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { useEffect, useState } from 'react';
import { DSVRowArray } from 'd3';

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

export const ScatterplotSimple = ({ width, height, csv_file }: ScatterplotProps) => {
  //const initialState: CSVData = null;

  // useMemo instead?
  const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]); //useState<CSVData>(initialState);

  //const [data, setData] = useState<dataFormat[]>([]);

  //let fetchedCSVData: dataFormat[] = [];

  d3.csv(`${process.env.PUBLIC_URL}/data/csv/${csv_file}.csv`).then(res => {
        const processedData = res.map((d: any) => ({
          x: d.X,
          y: d.Y,
          group: d.MARKER_NR,
        }));
        setFetchedCSVdata(processedData);
        //fetchedCSVData.push(res);
      });
  
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Scales
  const yScale = d3.scaleLinear().domain([0, 400]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([-100, 500]).range([0, boundsWidth]);

  const allGroups = fetchedCSVData.map((d) => String(d.group));
  
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
      />
    );
  });


  return (
    <div>
      { (fetchedCSVData && fetchedCSVData.length) ? 
      <>
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
    </>
       : 
       <h1>Loading...</h1>
       }
    </div>
  );
};