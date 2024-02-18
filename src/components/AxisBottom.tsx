import { useMemo } from "react";
import { ScaleLinear } from "d3";

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  height: number;
};

// tick length
const TICK_LENGTH = 10;

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  height,
}: AxisBottomProps) => {
  const range = xScale.range();

  const ticks = useMemo(() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale]);

    // var svg = d3.select("svg");
  // svg.append("text")
  //   .attr("class", "x label")
  //   .attr("text-anchor", "end")
  //   .attr("x", width)
  //   .attr("y", height - 6)
  //   .text("income per capita, inflation-adjusted (dollars)");

  // svg.append("text")
  //   .attr("class", "y label")
  //   .attr("text-anchor", "end")
  //   .attr("y", 6)
  //   .attr("dy", ".5em")
  //   .attr("transform", "rotate(-90)")
  //   .text("life expectancy (years)");

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
          shapeRendering={"crispEdges"}
        >
          <line
            y1={TICK_LENGTH}
            y2={-height - TICK_LENGTH}
            stroke="#D2D7D3"
            strokeWidth={0.5}
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
              fill: "#505050",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};