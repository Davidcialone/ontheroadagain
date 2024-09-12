import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Brand } from './components/forms/brand';
import { NavbarSite } from './components/forms/navbar';
import { TripsCarousel } from './components/forms/tripsCarousel';

function App() {
  return (
      <Router>
          <div>
              <Brand className="brand"/>
              <h1>ON THE ROAD AGAIN</h1>
              <NavbarSite/>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/trips" element={<TripsCarousel />} />
                  {/* Ajoutez d'autres routes ici si nécessaire */}
              </Routes>
          </div>
      </Router>
  );
}

export default App;
