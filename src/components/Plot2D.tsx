import * as d3 from 'd3';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { useEffect, useRef, useState } from 'react';
import { DSVRowArray } from 'd3';
import { symbol as d3Symbol, symbolTriangle } from 'd3';
import { InteractionData, Tooltip } from "./Tooltip";

// https://d3js.org/d3-zoom
// https://observablehq.com/@d3/x-y-zoom?collection=@d3/d3-zoom
// https://d3-graph-gallery.com/graph/line_select.html

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

const AXIS_LABEL: any = {
  0: 'X',
  1: 'Y',
  2: 'Z',
  3: 'TIME'
};

type ScatterplotProps = {
  width: number;
  height: number;
  axis1: number;
  axis2: number;
  colorAxis: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  minX: number;
  minY: number;
  minZ: number;
  timeMax: number;
  timeMin: number;
  data: dataFormat[];
  colorScale: d3.ScaleOrdinal<string, string>;
  selectedMarkers: string[];
  allMarkerGroups: string[];
};

type dataFormat = {
  x: number; 
  y: number;
  z: number;
  group: string;
  time: number;
};

export const Plot2D = (props: ScatterplotProps) => {
  //const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]);
  //const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hovered, setHovered] = useState<InteractionData | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const x_label = AXIS_LABEL[props.axis1];
  const y_label = AXIS_LABEL[props.axis2];
  
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = props.width - MARGIN.right - MARGIN.left;
  const boundsHeight = props.height - MARGIN.top - MARGIN.bottom;

  // Scales
  var yScale = d3.scaleLinear().domain([props.minY, props.maxY]).range([boundsHeight, 0]);
  var xScale = d3.scaleLinear().domain([props.minX, props.maxX]).range([0, boundsWidth]); 
  //var timeScale: d3.ScaleLinear<number, number>;
  
  switch (props.axis1) {
    case 0: //x
        xScale = d3.scaleLinear().domain([props.minX, props.maxX]).range([0, boundsWidth]);
        break;
    case 1: //y
        xScale = d3.scaleLinear().domain([props.minY, props.maxY]).range([0, boundsWidth]);
        break;
    case 2: //z
        xScale = d3.scaleLinear().domain([props.minZ, props.maxZ]).range([0, boundsWidth]);
        break;
    case 3: //time
        xScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([0, boundsWidth]);
        break;
    default:
        break;
  }

  switch (props.axis2) {
    case 0: //x
        yScale = d3.scaleLinear().domain([props.minX, props.maxX]).range([boundsHeight, 0]);
        break;
    case 1: //y
        yScale = d3.scaleLinear().domain([props.minY, props.maxY]).range([boundsHeight, 0]);
        break;
    case 2: //z
        yScale = d3.scaleLinear().domain([props.minZ, props.maxZ]).range([boundsHeight, 0]);
        break;
    case 3: //time
        yScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([boundsHeight, 0]);
        break;
    default:
        break;
  }

  var timeScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([0.1, 1.0]);

  switch (props.colorAxis) {
    case 3: //time
        timeScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([0.1, 1.0]);
        break;
    default:
        timeScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([1.0, 1.0]);
        break;
  }
  
  // Build the shapes and lines
const groupedShapesAndLines = props.allMarkerGroups.map((group) => {
  const groupData = props.data
    .filter((d) => d.group === group);

  const shapesAndLines = groupData.map((d, i, array) => {
    const markerSymb = d3Symbol().type(d3.symbolCircle).size(20);
    var x = 0;
    var y = 0;

    switch (props.axis1) {
        case 0://x
            x = xScale(d.x);
            break;
        case 1://y
            x = xScale(d.y);
            break;
        case 2://z
            x = xScale(d.z);
            break;
        case 3://time
            x = xScale(d.time);
            break;
        default:
            break;
    }

    switch (props.axis2) {
        case 0://x
            y = yScale(d.x);
            break;
        case 1://y
            y = yScale(d.y);
            break;
        case 2://z
            y = yScale(d.z);
            break;
        case 3://time
            y = yScale(d.time);
            break;
        default:
            break;
    }

    const transform = `translate(${x},${y})`;

    // Render the arrowhead as a <path> element
    const shape = (
      <path
        key={`shape-${i}`}
        d={markerSymb() || ''}
        transform={transform}
        fill={props.colorScale(d.group)}
        stroke={props.colorScale(d.group)}
        fillOpacity={timeScale(d.time)}
        strokeWidth={0.5}
        onMouseEnter={() =>
          setHovered({
            xPos: x,
            yPos: y,
            xRaw: d.x,
            yRaw: d.y,
            zRaw: d.z,
            name: d.group,
            time: d.time,
          })
        }
        onMouseLeave={() => setHovered(null)}
      />
    );

    // Connect data points with lines
    if (i > 0) {
      const prevData = array[i - 1];
      var lineX1 = 0;
      var lineY1 = 0;

      switch (props.axis1) {
        case 0://x
            lineX1 = xScale(prevData.x);
            break;
        case 1://y
            lineX1 = xScale(prevData.y);
            break;
        case 2://z
            lineX1 = xScale(prevData.z);
            break;
        case 3://time
            lineX1 = xScale(prevData.time);
            break;
        default:
            break;
    }

    switch (props.axis2) {
        case 0://x
            lineY1 = yScale(prevData.x);
            break;
        case 1://y
            lineY1 = yScale(prevData.y);
            break;
        case 2://z
            lineY1 = yScale(prevData.z);
            break;
        case 3://time
            lineY1 = yScale(prevData.time);
            break;
        default:
            break;
    }

    const lineX2 = x;
    const lineY2 = y;

    const line = (
        <line
          key={`line-${i}`}
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2}
          stroke={props.colorScale(d.group)}
          fillOpacity={timeScale(d.time)}
          strokeWidth={0.5}
        />
      );

      return [shape, line];
    }

    return shape;
  });

  return shapesAndLines;
  });

  // Flatten the array to avoid nested arrays
  const flattenedShapesAndLines = groupedShapesAndLines.flat();

  return (
    <div>
      {props.data.length ? (
      <>
      <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={props.width} height={props.height}>
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
        {flattenedShapesAndLines}
      </g>
    </svg>
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
       ) : (
       // If no data is available, render a placeholder
        <div className="text-center text-gray-400">
          No data available
        </div>
       )}
    </div>
  );
};