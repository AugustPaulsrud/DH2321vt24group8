import React, { useEffect, useState } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));

const Plot = createPlotlyComponent(Plotly);

const Plot3D = (props) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // useEffect(() => {
  //   if (!props.csv_file) {
  //     // If csv_file is empty or undefined, set data to an empty array
  //     setData([]);
  //     return;
  //   }
  //   // Using d3 to fetch and parse CSV data
  //   d3.csv(`${process.env.PUBLIC_URL}/data/csv/${props.csv_file}.csv`).then((csvData) => {
  //     // Process the CSV data to extract X, Y, Z, and MARKER_NR columns
  //     const processedData = processCSVData(csvData);
  //     setData(processedData);
  //     setFilteredData(processedData);
  //   });
  // }, [props.csv_file]);

  useEffect(() => {
    const syncData = props.data
    .filter((d) => d.TIME >= props.timeStart && d.TIME <= props.timeEnd);
    setFilteredData(syncData);
  }, [props.data, props.timeStart, props.timeEnd]);

  // const processCSVData = (csvData) => {
  //   // Implement logic to extract X, Y, Z, and MARKER_NR columns
  //   // Return an array of objects with X, Y, Z, and MARKER_NR properties
  //   return csvData.map((row) => ({
  //     X: parseFloat(row.X),
  //     Y: parseFloat(row.Y),
  //     Z: parseFloat(row.Z),
  //     TIME: parseFloat(row.TIME),
  //     MARKER_NR: row.MARKER_NR.toString(),
  //   }));
  // };

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
      data={generateScatterData(filteredData, props.colorScale)}
      layout={plotLayout}
    />
  );
};

const generateScatterData = (data, colorScale) => {
  // Group data by MARKER_NR
  const groupedData = groupByMarker(data);
  //TODO: Debugging
  // console.dir(groupedData);
  // console.table(groupedData);
  // console.log(groupedData);

  // Generate scatter data for each group
  const scatterData = Object.keys(groupedData).map((markerNr, index) => {
    const groupData = groupedData[markerNr];
    const markerColor = colorScale(markerNr); //getRandomColor();

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

const getRandomColor = () => {
  // Implement a function to generate a random color
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
};

export default Plot3D;
