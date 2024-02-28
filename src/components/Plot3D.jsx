import React, { useEffect, useState } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));

const Plot = createPlotlyComponent(Plotly);

const Plot3D = (props) => {
  
  const plotLayout = {
    width: props.width,
    height: props.height,
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' },
    },
    showlegend: true,
  };

  return (
    <Plot
      data={generateScatterData(
        props.data,
        props.colorScale,
        props.timeStart,
        props.timeEnd
      )}
      layout={plotLayout}
    />
  );
};

/**
 * TODO: 
 * Synchronize marker selection
 * Synchronize time slider
 */
const generateScatterData = (data, colorScale, timeStart, timeEnd) => {
  // Group data by MARKER_NR
  const groupedData = groupByMarker(data);

  // Generate scatter data for each group
  const scatterData = Object.keys(groupedData).map((markerNr, index) => {
    const groupData = groupedData[markerNr];
    const markerColor = colorScale(markerNr);

    return {
      type: 'scatter3d',
      mode: 'markers+lines',
      name: `Group ${markerNr}`,
      x: groupData.map((item) => item.x),
      y: groupData.map((item) => item.y),
      z: groupData.map((item) => item.z),
      marker: { color: markerColor, size: 6 },
      line: { color: markerColor, width: 2 },
    };
  });

  return scatterData;
};

const groupByMarker = (data) => {
  // Group data by MARKER_NR
  return data.reduce((groupedData, item) => {
    const markerNr = item.group;
    if (!groupedData[markerNr]) {
      groupedData[markerNr] = [];
    }
    groupedData[markerNr].push(item);
    return groupedData;
  }, {});
};

export default Plot3D;