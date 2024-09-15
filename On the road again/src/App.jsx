import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/forms/home';
import { MyTrips } from './components/forms/myTrips';
import { TripVisits } from '../src/components/forms/tripVisits';
import { NavbarSite } from './components/forms/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';

function App() {
  return (
      <Router basename="/ontheroadagain">
          <div>
             <h1>ON THE ROAD AGAIN</h1>
              <NavbarSite/>
              
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/myTrips" element={<MyTrips />} />
                  <Route path="/tripVisits" element={<TripVisits />} />
                   {/* Ajoutez d'autres routes ici si nécessaire */}
              </Routes>
          </div>
      </Router>
  );
}

export default App;