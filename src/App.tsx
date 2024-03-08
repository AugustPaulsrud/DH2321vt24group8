import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Visualisation from './pages/Visuals';
import Miscellaneous from './pages/Miscellaneous';

const App = () => {
  // Routes allows the code to be scalable, by allowing different pages by specifying their path
  return (
      <>
          <Navbar/>
          <div className="w-full h-screen pt-20">
              <Routes>
                  <Route path="/" element={<Visualisation/>}/> {/* Default page */}
                  <Route path="Home" element={<Home/>}/>
                  <Route path="Visualisation" element={<Visualisation/>}/>
                  <Route path="Miscellaneous" element={<Miscellaneous/>}/>
              </Routes>
          </div>
      </>
  );
};

export default App;