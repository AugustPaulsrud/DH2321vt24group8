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

type ScatterplotProps = {
  width: number;
  height: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  minX: number;
  minY: number;
  minZ: number;
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

const x_label = "Y";
const y_label = "Z";

export const ScatterYZ = (props: ScatterplotProps) => {
  //const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]);
  //const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [hovered, setHovered] = useState<InteractionData | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = props.width - MARGIN.right - MARGIN.left;
  const boundsHeight = props.height - MARGIN.top - MARGIN.bottom;

  // Scales
  const yScale = d3.scaleLinear().domain([props.minZ, props.maxZ]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([props.minY, props.maxY]).range([0, boundsWidth]);

  //const maxTime = d3.max(props.data, (d) => d.time) || 400;
  
  // Build the shapes and lines
const groupedShapesAndLines = props.allMarkerGroups.map((group) => {
  const groupData = props.data
    .filter((d) => d.group === group);

    var oldX = 0;
    var oldY = 0;

  const shapesAndLines = groupData.map((d, i, array) => {
    const markerSymb = d3Symbol().type(d3.symbolCircle).size(20);
    const x = xScale(d.y);
    const y = yScale(d.z);

    const transform = `translate(${x},${y})`;

    oldX = x;
    oldY = y;

    // Render the arrowhead as a <path> element
    const shape = (
      <path
        key={`shape-${i}`}
        d={markerSymb() || ''}
        transform={transform}
        fill={props.colorScale(d.group)}
        stroke={props.colorScale(d.group)}
        fillOpacity={1.0}
        strokeWidth={0.5}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(d.y),
            yPos: yScale(d.z),
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
      const lineX1 = xScale(prevData.y);
      const lineY1 = yScale(prevData.z);
      const lineX2 = xScale(d.y);
      const lineY2 = yScale(d.z);

      const line = (
        <line
          key={`line-${i}`}
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2}
          stroke={props.colorScale(d.group)}
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