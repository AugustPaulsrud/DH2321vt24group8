import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Visuals from './pages/Visuals';
import Miscellaneous from './pages/Miscellaneous';

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
          </div>
      </>
  );
};

export default App;