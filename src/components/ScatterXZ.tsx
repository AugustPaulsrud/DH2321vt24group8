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
  csv_file: string;
  upperX: number;
  lowerX: number;
  upperY: number;
  lowerY: number;
  upperZ: number;
  lowerZ: number;
  timeStart: number;
  timeEnd: number;
  timeMax: number;
  //data: { x: number; y: number }[];
};

type dataFormat = {
  x: number; 
  y: number;
  z: number;
  group: string;
  time: number;
};

const x_label = "X";
const y_label = "Z";

export const ScatterXZ = (props: ScatterplotProps) => {
  const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [hovered, setHovered] = useState<InteractionData | null>(null);
  
   const [upperX, setUpperX] = useState<number>(1000);
   const [lowerX, setLowerX] = useState<number>(0);
   const [upperZ, setUpperZ] = useState<number>(1000);
   const [lowerZ, setLowerZ] = useState<number>(0);

   const [timeStart, setTimeStart] = useState<number>(0);
   const [timeEnd, setTimeEnd] = useState<number>(60);
   const [timeMax, setTimeMax] = useState<number>(60);

  const svgRef = useRef<SVGSVGElement>(null);

  // Create a zoom behavior
  // const zoom = d3.zoom()
  //   .scaleExtent([0.5, 5]) // Set the zoom scale range
  //   .on('zoom', handleZoom);

  useEffect(() => {
    const fetchData = async () => {
      if (props.csv_file != "") {
      try {
        const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv/${props.csv_file}.csv`);
        const processedData = response.map((d: any) => ({
          x: +d.X,
          y: +d.Y,
          z: +d.Z,
          group: d.MARKER_NR,
          time: d.TIME,
        }));
        setFetchedCSVdata(processedData);

        // TODO: Implement this!
        // const maxX = d3.max(processedData, (d) => d.x) || 500;
        // const maxY = d3.max(processedData, (d) => d.y) || 500;
        // const minX = d3.min(processedData, (d) => d.x) || 0;
        // const minY = d3.min(processedData, (d) => d.y) || 0;
        // setUpperX(maxX);
        // setUpperY(maxY);
        // setLowerX(minX);
        // setLowerY(minY);

        // const maxTime = d3.max(processedData, (d) => d.time) || 60;
        // setTimeMax(maxTime);
        // setTimeEnd(maxTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setFetchedCSVdata([]); // Unselect data (?)
    }
    };

    // if (svgRef.current) {
    //   d3.select(svgRef.current).call(zoom as any); // Use 'as any' to satisfy TypeScript
    // }

    fetchData();
  }, [props.csv_file]); //, zoom

  // TODO; Implement for Z axis
    useEffect(() => {
      setUpperX(props.upperX);
      setLowerX(props.lowerX);
      setUpperZ(props.upperZ);
      setLowerZ(props.lowerZ);
      setTimeStart(props.timeStart);
      setTimeEnd(props.timeEnd);
      setTimeMax(props.timeMax);
    }, [props.upperX,
        props.lowerX,
        props.upperZ,
        props.lowerZ,
        props.timeStart,
        props.timeEnd,
        props.timeMax,]);
  
    // Zoom event handler
  // function handleZoom(event: d3.D3ZoomEvent<SVGSVGElement, null>) {
  //   const { transform } = event;

  //   //const updatedXScale = d3.scaleLinear().domain([-100, 500]).range([0, boundsWidth].map(d => transform.applyX(d)));
  //   //const updatedYScale = d3.scaleLinear().domain([0, 400]).range([boundsHeight, 0].map(d => transform.applyY(d)));

  //   //setForceRender(prev => prev + 1);
  //   //const updatedXScale = d3.scaleLinear().domain([-100, upperX]).range([0, boundsWidth].map(d => transform.applyX(d)));

  //   setUpperX(transform.k * upperX);
  //   setUpperY(transform.k * upperY);

  //   // Update the scales
  //   //xScale.domain(updatedXScale.domain());
  //   //yScale.domain(updatedYScale.domain());
  // }
  

  const allMarkerGroups = Array.from(new Set(fetchedCSVData.map((d) => d.group)));

  const handleGroupChange = (selectedGroup: string) => {
    // Check if the group is already selected
    if (selectedGroups.includes(selectedGroup)) {
      // If yes, remove it from the selected groups
      setSelectedGroups(selectedGroups.filter(group => group !== selectedGroup));
    } else {
      // If no, add it to the selected groups
      setSelectedGroups([...selectedGroups, selectedGroup]);
    }
  };
  
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = props.width - MARGIN.right - MARGIN.left;
  const boundsHeight = props.height - MARGIN.top - MARGIN.bottom;

  // // Scales
  // const yScale = d3.scaleLinear().domain([lowerY, upperY]).range([boundsHeight, 0]);
  // const xScale = d3.scaleLinear().domain([lowerX, upperX]).range([0, boundsWidth]);

  // Scales
  const yScale = d3.scaleLinear().domain([lowerZ, upperZ]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([lowerX, upperX]).range([0, boundsWidth]);

  useEffect(() => {
    yScale.domain([lowerZ, upperZ]).range([boundsHeight, 0]);
    xScale.domain([lowerX, upperX]).range([0, boundsWidth]);
  }, [lowerX, upperX, lowerZ, upperZ]);

  const allGroups = fetchedCSVData.map((d) => String(d.group));

  const maxTime = d3.max(fetchedCSVData, (d) => d.time) || 400;
  //setUpperX(maxX);

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(allGroups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"]);

  // Build the shapes and lines
const groupedShapesAndLines = allMarkerGroups.map((group) => {
  const groupData = fetchedCSVData
    .filter((d) => selectedGroups.includes(d.group) && d.group === group)
    .filter((d) => d.time >= timeStart && d.time <= timeEnd);

    var oldX = 0;
    var oldY = 0;

  const shapesAndLines = groupData.map((d, i, array) => {
    const arrowhead = d3Symbol().type(symbolTriangle).size(20);
    const x = xScale(d.x);
    const y = yScale(d.z);

    const rotation = (270 - (Math.atan2(oldY - y, oldX - x)) * 180 / Math.PI)% 360
    const transform = `translate(${x},${y}) rotate(${rotation})`;

    oldX = x;
    oldY = y;

    // Render the arrowhead as a <path> element
    const shape = (
      <path
        key={`shape-${i}`}
        d={arrowhead() || ''}
        transform={transform}
        fill={colorScale(d.group)}
        stroke={colorScale(d.group)}
        fillOpacity={1.0}
        strokeWidth={0.5}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(d.x),
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
      const lineX1 = xScale(prevData.x);
      const lineY1 = yScale(prevData.z);
      const lineX2 = xScale(d.x);
      const lineY2 = yScale(d.z);

      const line = (
        <line
          key={`line-${i}`}
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2}
          stroke={colorScale(d.group)}
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
      {fetchedCSVData.length ? (
      <>
      <div className="flex items-center mt-4">
        <label className="p-4">Select Groups:</label>
          <div className="grid grid-cols-3 gap-2">
            {allMarkerGroups.map((group) => (
              <div key={group} className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group)}
                    onChange={() => handleGroupChange(group)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700" style={{color: colorScale(group)}}>{group}</span>
                </label>
              </div>
            ))}
          </div>
      </div>

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