import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Visuals from './pages/Visuals';
import Miscellaneous from './pages/Miscellaneous';
import { ScatterplotSimple } from './components/ScatterplotSimple';
import Plot3D from './components/Plot3D';

const App = () => {
  // Routes allows the code to be scalable, by allowing different pages by specifying their path
  return (
      <>
          <Navbar/>
          <div className="container">
              <Routes>
                <Route path="/" element={<Home/>}/>
                  <Route path="Home" element={<Home/>}/>
                  <Route path="Visuals" element={<Visuals/>}/>
                  <Route path="Miscellaneous" element={<Miscellaneous/>}/>
              </Routes>

              <ScatterplotSimple width={600} height={600} csv_file={"EVDa_SimCaTip_Ale0003"} />
              <Plot3D width={800} height={600} csv_file={"EVDa_SimCaTip_Ale0003"} />
          </div>
      </>
  );
};

export default App;