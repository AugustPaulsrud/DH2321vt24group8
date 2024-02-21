import React, { useEffect, useState } from 'react';
import Scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';
import * as d3 from 'd3';

var Plotly = require('plotly.js/lib/core');
Plotly.register(require('plotly.js/lib/scatter3d'));

const Plot = createPlotlyComponent(Plotly);

const Plot3D = ({ width, height, csv_file }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!csv_file) {
      // If csv_file is empty or undefined, set data to an empty array
      setData([]);
      return;
    }
    // Using d3 to fetch and parse CSV data
    d3.csv(`${process.env.PUBLIC_URL}/data/csv/${csv_file}.csv`).then((csvData) => {
      // Process the CSV data to extract X, Y, Z, and MARKER_NR columns
      const processedData = processCSVData(csvData);
      setData(processedData);
    });
  }, [csv_file]);

  const processCSVData = (csvData) => {
    // Implement logic to extract X, Y, Z, and MARKER_NR columns
    // Return an array of objects with X, Y, Z, and MARKER_NR properties
    return csvData.map((row) => ({
      X: parseFloat(row.X),
      Y: parseFloat(row.Y),
      Z: parseFloat(row.Z),
      MARKER_NR: row.MARKER_NR.toString(),
    }));
  };

  const plotLayout = {
    width: width,
    height: height,
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' },
    },
    showlegend: true,
  };

  return (
    <Plot
      data={generateScatterData(data)}
      layout={plotLayout}
    />
  );
};

const generateScatterData = (data) => {
  // Group data by MARKER_NR
  const groupedData = groupByMarker(data);

  // Generate scatter data for each group
  const scatterData = Object.keys(groupedData).map((markerNr, index) => {
    const groupData = groupedData[markerNr];
    const markerColor = getRandomColor();

    return {
      type: 'scatter3d',
      mode: 'markers+lines',
      name: `Group ${markerNr}`,
      x: groupData.map((item) => item.X),
      y: groupData.map((item) => item.Y),
      z: groupData.map((item) => item.Z),
      marker: { color: markerColor, size: 6 },
      line: { color: markerColor, width: 2 },
    };
  });

  return scatterData;
};

const groupByMarker = (data) => {
  // Group data by MARKER_NR
  return data.reduce((groupedData, item) => {
    const markerNr = item.MARKER_NR;
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
