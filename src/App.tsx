import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Visuals from './pages/Visuals';
import './App.css';

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
              </Routes>
          </div>
      </>
  );
};

export default App;