import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import {MyTrips} from './components/forms/trips/myTrips';
import { TripVisits } from '../src/components/forms/visits/tripVisits';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { Box } from "@chakra-ui/react";

function App() {
  return (
      <Box width="100%" minHeight="100vh">
          <Router basename="/ontheroadagain">
              <div>
                 <h1>ON THE ROAD AGAIN</h1>
                 <NavbarSite/>             
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/me/trips" element={<MyTrips />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  </Routes>
              </div>
          </Router>
      </Box>
  );
}

export default App;