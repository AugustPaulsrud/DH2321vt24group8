import React, { useEffect, useState } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));

const Plot = createPlotlyComponent(Plotly);

const Plot3D = (props) => {

  const timeScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([0.6, 1.0]);
  
  const plotLayout = {
    width: props.width,
    height: props.height,
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' },
    },
    showlegend: false,
  };

  return (
    <Plot
      data={generateScatterData(
        props.data,
        props.colorScale,
        props.timeStart,
        props.timeEnd,
        props.selectedMarkers,
        timeScale
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
const generateScatterData = (data, colorScale, timeStart, timeEnd, selectedMarkers, timeScale) => {
  // Group data by MARKER_NR
  const groupedData = groupByMarker(data);

  // Generate scatter data for each group
  const scatterData = Object.keys(groupedData).map((markerNr, index) => {
    const groupData = groupedData[markerNr];
    const markerColor = colorScale(markerNr);
    const markerColorRGB = d3.rgb(markerColor); // Fix for opacity
    const markerColorOpacity = groupData.map((item) => `rgba(${markerColorRGB.r}, ${markerColorRGB.g}, ${markerColorRGB.b}, ${timeScale(item.time)})`);

    return {
      type: 'scatter3d',
      mode: 'markers+lines',
      name: `${markerNr}`,
      meta: [`${markerNr}`],
      x: groupData.map((item) => item.x),
      y: groupData.map((item) => item.y),
      z: groupData.map((item) => item.z),
      text: groupData.map((item) => item.time),
      marker: { color: markerColorOpacity, size: 6 },
      line: { color: markerColorOpacity, width: 2 },
      hovertemplate: `<b>%{meta[0]}</b><br>` + 
      `X: %{x} mm<br>` + 
      `Y: %{x} mm<br>` + 
      `Z: %{z} mm<br>` + 
      `Time: %{text} s<br>` + 
      `<extra></extra>`,
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