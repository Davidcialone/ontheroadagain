import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/forms/home';
import { MyTrips } from './components/forms/myTrips';
import { NavbarSite } from './components/forms/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './Trip.css'



function App() {
  return (
      <Router basename="/ontheroadagain">
          <div>
             <h1>ON THE ROAD AGAIN</h1>
              <NavbarSite/>
              
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/myTrips" element={<MyTrips />} />
                   {/* Ajoutez d'autres routes ici si nécessaire */}
              </Routes>
          </div>
      </Router>
  );
}

export default App;