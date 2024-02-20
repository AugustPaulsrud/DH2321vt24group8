import * as d3 from 'd3';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { useEffect, useRef, useState } from 'react';
import { DSVRowArray } from 'd3';
import { symbol as d3Symbol, symbolTriangle } from 'd3';

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
  time: number;
};

type CSVData = dataFormat | null; //DSVRowArray | null;

const x_label = "X";
const y_label = "Y";

export const ScatterplotSimple = ({ width, height, csv_file }: ScatterplotProps) => {
  const [fetchedCSVData, setFetchedCSVdata] = useState<dataFormat[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

   // State variable to trigger a re-render
   const [forceRender, setForceRender] = useState<number>(0);

  const svgRef = useRef<SVGSVGElement>(null);

  // Create a zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.5, 5]) // Set the zoom scale range
    .on('zoom', handleZoom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv/${csv_file}.csv`);
        const processedData = response.map((d: any) => ({
          x: +d.X,
          y: +d.Y,
          group: d.MARKER_NR,
          time: d.TIME,
        }));
        setFetchedCSVdata(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (svgRef.current) {
      d3.select(svgRef.current).call(zoom as any); // Use 'as any' to satisfy TypeScript
    }

    fetchData();
  }, [csv_file, zoom]); 
  
    // Zoom event handler
  function handleZoom(event: d3.D3ZoomEvent<SVGSVGElement, null>) {
    const { transform } = event;

    const updatedXScale = d3.scaleLinear().domain([-100, 500]).range([0, boundsWidth].map(d => transform.applyX(d)));
    const updatedYScale = d3.scaleLinear().domain([0, 400]).range([boundsHeight, 0].map(d => transform.applyY(d)));

    setForceRender(prev => prev + 1);

    // Update the scales
    xScale.domain(updatedXScale.domain());
    yScale.domain(updatedYScale.domain());
  }
  

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
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Scales
  const yScale = d3.scaleLinear().domain([0, 400]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([-100, 500]).range([0, boundsWidth]);

  const allGroups = fetchedCSVData.map((d) => String(d.group));

  const maxTime = d3.max(fetchedCSVData, (d) => d.time) || 400;

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(allGroups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"]);

  // Build the shapes
  const filteredShapes = fetchedCSVData
    .filter((d) => selectedGroups.includes(d.group))
    .map((d, i) => {

      // Calculate the angle based on the time column
    const angle = (d.time / maxTime) * Math.PI * 2; // Assuming time is in the range [0, 400]
    
    // Create arrowhead symbol
    const arrowhead = d3Symbol().type(symbolTriangle).size(20);

    // Calculate position
    const x = xScale(d.y);
    const y = yScale(d.x);

    // Apply the rotation to the arrowhead symbol
    const rotation = (angle - Math.PI / 2) * (180 / Math.PI);
    const transform = `translate(${x},${y}) rotate(${rotation})`;

    // Render the arrowhead as a <path> element
    return (
      <path
        key={i}
        d={arrowhead() || ''}
        transform={transform}
        fill={colorScale(d.group)}
        stroke={colorScale(d.group)}
        fillOpacity={1.0}
        strokeWidth={0.5}
      />
    );
    }
    );




  return (
    <div>
      {fetchedCSVData.length ? (
      <>
      <div>
            <label>Select Groups:</label>
            {allMarkerGroups.map((group) => (
              <label>
              <input
                type="checkbox"
                checked={selectedGroups.includes(group)}
                onChange={() => handleGroupChange(group)}
              />
              {group}
            </label>
            ))}
      </div>

      <svg ref={svgRef} width={width} height={height}>
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
        {filteredShapes}
      </g>
    </svg>
    </>
       ) : (
       <h1>Loading...</h1>
       )}
    </div>
  );
};