import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Visualisation from './pages/Visuals';
import AboutUs from './pages/Miscellaneous';

const App = () => {
  // Routes allows the code to be scalable, by allowing different pages by specifying their path
  return (
      <div className='bg-gray-100'>
          <Navbar/>
          <div className="w-full pt-20 h-screen bg-gray-100">
              <Routes>
                  <Route path="/" element={<Visualisation/>}/> {/* Default page */}
                  <Route path="Home" element={<Home/>}/>
                  <Route path="Visualisation" element={<Visualisation/>}/>
                  <Route path="About Us" element={<AboutUs/>}/>
              </Routes>
          </div>
      </div>
  );
};

export default App;