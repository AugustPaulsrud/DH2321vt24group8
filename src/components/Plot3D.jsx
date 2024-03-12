import React, { useEffect, useState, useMemo } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));
Plotly.register(require('plotly.js/lib/mesh3d'));

const Plot = createPlotlyComponent(Plotly);

const AXIS_LABEL = {
  0: 'X',
  1: 'Y',
  2: 'Z',
  3: 'TIME'
};

var skullData = {
  x: [],
  y: [],
  z: [],
  i: [],
  j: [],
  k: [],
};

var treeData = {
  x: [],
  y: [],
  z: [],
  i: [],
  j: [],
  k: [],
};

var ventricleData = {
  x: [],
  y: [],
  z: [],
  i: [],
  j: [],
  k: [],
};

var lowData = {
  x: [],
  y: [],
  z: [],
  i: [],
  j: [],
  k: [],
};


d3.csv(`${process.env.PUBLIC_URL}/listVskull.csv`, (d) => {
  skullData.x.push(+d.X);
  skullData.y.push(+d.Y);
  skullData.z.push(+d.Z);
});

d3.csv(`${process.env.PUBLIC_URL}/listSskull.csv`, (d) => {
  skullData.i.push(+d.I);
  skullData.j.push(+d.J);
  skullData.k.push(+d.K);
  });

d3.csv(`${process.env.PUBLIC_URL}/listVtree.csv`, (d) => {
  treeData.x.push(+d.X);
  treeData.y.push(+d.Y);
  treeData.z.push(+d.Z);
});

d3.csv(`${process.env.PUBLIC_URL}/listStree.csv`, (d) => {
  treeData.i.push(+d.I);
  treeData.j.push(+d.J);
  treeData.k.push(+d.K);
  }
);

d3.csv(`${process.env.PUBLIC_URL}/listVvent.csv`, (d) => {
  ventricleData.x.push(+d.X);
  ventricleData.y.push(+d.Y);
  ventricleData.z.push(+d.Z);
}
);

d3.csv(`${process.env.PUBLIC_URL}/listSvent.csv`, (d) => {
  ventricleData.i.push(+d.I);
  ventricleData.j.push(+d.J);
  ventricleData.k.push(+d.K);
}
);

d3.csv(`${process.env.PUBLIC_URL}/listVlow.csv`, (d) => {
  lowData.x.push(+d.X);
  lowData.y.push(+d.Y);
  lowData.z.push(+d.Z);
}
);

d3.csv(`${process.env.PUBLIC_URL}/listSlow.csv`, (d) => {
  lowData.i.push(+d.I);
  lowData.j.push(+d.J);
  lowData.k.push(+d.K);
}
);

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
    legend: {
      x: 0, 
      y: 1.2,
      orientation: 'h',
      bgcolor: 'rgba(102, 102, 153, 0.02)',},
    showlegend: true,
    legend_itemclick: true
  };

  const scatterPlot = useMemo(() => {
    return generateScatterData(
      props.data,
      props.colorScale,
      timeScale,
      props.axis1,
      props.axis2,
      props.axis3,
      props.colorAxis
    );
  }, [props.data, props.colorScale, timeScale, props.axis1, props.axis2, props.axis3, props.colorAxis]);

  
  const skull = {
    name: 'Upper Skull',
    opacity: 0.2,
    color: 'rgb(300, 100, 200)',
    type: 'mesh3d',
    hoverinfo: 'skip',
    showlegend: true,
    x: skullData.x,
    y: skullData.y,
    z: skullData.z,
    i: skullData.i,
    j: skullData.j,
    k: skullData.k
  }

  const marker = {
    name: 'Phantom',
    opacity: 0.05,
    color: 'rgb(102, 102, 153)',
    type: 'mesh3d',
    hoverinfo: 'skip',
    showlegend: true,
    x: treeData.x,
    y: treeData.y,
    z: treeData.z,
    i: treeData.i,
    j: treeData.j,
    k: treeData.k
  }
  
  const ventricle = {
    name: 'Ventricle',
    opacity: 0.4,
    color: 'rgb(255, 0, 0)',
    type: 'mesh3d',
    hoverinfo: 'skip',
    showlegend: true,
    x: ventricleData.x,
    y: ventricleData.y,
    z: ventricleData.z,
    i: ventricleData.i,
    j: ventricleData.j,
    k: ventricleData.k
  }

  const low = {
    name: 'Lower Skull',
    opacity: 0.2,
    color: 'rgb(102, 255, 255)',
    type: 'mesh3d',
    hoverinfo: 'skip',
    showlegend: true,
    visible: 'legendonly',
    x: lowData.x,
    y: lowData.y,
    z: lowData.z,
    i: lowData.i,
    j: lowData.j,
    k: lowData.k
  }

  if (scatterPlot.length > 0 && plotLayout.scene.xaxis.title === "X" && plotLayout.scene.yaxis.title === "Y" && plotLayout.scene.zaxis.title === "Z") {
  scatterPlot.push(skull)
  scatterPlot.push(low)
  scatterPlot.push(marker)
  scatterPlot.push(ventricle)
  }

  return (
    <Plot
      data={scatterPlot}
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
      mode: 'lines+markers',
      name: `${markerNr}`,
      showlegend: false,
      meta: [`${markerNr}`],
      x: dim1,
      y: dim2,
      z: dim3,
      text: groupData.map((item) => item.time),
      marker: { color: markerColorOpacity, size: 4 },
      line: { color: markerColorOpacity, width: 2 },
      hovertemplate: `<b>%{meta[0]}</b><br>` + 
      `X: %{x} mm<br>` + 
      `Y: %{y} mm<br>` + 
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