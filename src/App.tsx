import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Scatterplot } from './components/Scatterplot';
//import datafile from './data/csv/EVDa_SimCaTip_Ale0003.csv'

function App() {

  return (
    <div>
    <h1>CSV Scatterplot</h1>
    <Scatterplot width={600} height={600} csv_file={"EVDa_SimCaTip_Ale0003"} />
  </div>
  );
}

export default App;
