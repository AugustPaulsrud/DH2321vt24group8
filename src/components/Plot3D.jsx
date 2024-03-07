import React, { useEffect, useState } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));

const Plot = createPlotlyComponent(Plotly);

const AXIS_LABEL = {
  0: 'X',
  1: 'Y',
  2: 'Z',
  3: 'TIME'
};

const Plot3D = (props) => {

  const timeScale = d3.scaleLinear().domain([props.timeMin, props.timeMax]).range([0.6, 1.0]);
  // 0: X, 1: Y, 2: Z, 3: TIME
  
  const plotLayout = {
    width: props.width,
    height: props.height,
    scene: {
      xaxis: { title: AXIS_LABEL[props.axis1] },
      yaxis: { title: AXIS_LABEL[props.axis2] },
      zaxis: { title: AXIS_LABEL[props.axis3] },
    },
    showlegend: false,
  };

  return (
    <Plot
      data={generateScatterData(
        props.data,
        props.colorScale,
        timeScale,
        props.axis1,
        props.axis2,
        props.axis3,
        props.colorAxis
      )}
      layout={plotLayout}
    />
  );
};


const generateScatterData = (data, colorScale, timeScale, axis1, axis2, axis3, colorAxis) => {
  // Group data by MARKER_NR
  const groupedData = groupByMarker(data);

  // Generate scatter data for each group
  const scatterData = Object.keys(groupedData).map((markerNr, index) => {
    const groupData = groupedData[markerNr];
    
    const markerColor = colorScale(markerNr);
    const markerColorRGB = d3.rgb(markerColor);

    var markerColorOpacity = [];
    switch (colorAxis) {
      case 0: //x
        markerColorOpacity = groupData.map((item) => `rgba(${markerColorRGB.r}, ${markerColorRGB.g}, ${markerColorRGB.b}, ${timeScale(item.x)})`);
        break;
      case 1: //y
        markerColorOpacity = groupData.map((item) => `rgba(${markerColorRGB.r}, ${markerColorRGB.g}, ${markerColorRGB.b}, ${timeScale(item.y)})`);
        break;
      case 2: //z
        markerColorOpacity = groupData.map((item) => `rgba(${markerColorRGB.r}, ${markerColorRGB.g}, ${markerColorRGB.b}, ${timeScale(item.z)})`);
        break;
      case 3: //time
        markerColorOpacity = groupData.map((item) => `rgba(${markerColorRGB.r}, ${markerColorRGB.g}, ${markerColorRGB.b}, ${timeScale(item.time)})`);
        break;
      default:
        markerColorOpacity = markerColor;
    }

    var dim1 = [];
    var dim2 = [];
    var dim3 = [];

    switch (axis1) {
      case 0:
        dim1 = groupData.map((item) => item.x);
        break;
      case 1:
        dim1 = groupData.map((item) => item.y);
        break;
      case 2:
        dim1 = groupData.map((item) => item.z);
        break;
      case 3:
        dim1 = groupData.map((item) => item.time);
        break;
      default:
        break;
    }

    switch (axis2) {
      case 0:
        dim2 = groupData.map((item) => item.x);
        break;
      case 1:
        dim2 = groupData.map((item) => item.y);
        break;
      case 2:
        dim2 = groupData.map((item) => item.z);
        break;
      case 3:
        dim2 = groupData.map((item) => item.time);
        break;
      default:
        break;
    }

    switch (axis3) {
      case 0:
        dim3 = groupData.map((item) => item.x);
        break;
      case 1:
        dim3 = groupData.map((item) => item.y);
        break;
      case 2:
        dim3 = groupData.map((item) => item.z);
        break;
      case 3:
        dim3 = groupData.map((item) => item.time);
        break;
      default:
        break;
    }

    return {
      type: 'scatter3d',
      mode: 'markers+lines',
      name: `${markerNr}`,
      meta: [`${markerNr}`],
      x: dim1,
      y: dim2,
      z: dim3,
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