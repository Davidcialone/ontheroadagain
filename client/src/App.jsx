import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import { MyTrips } from './components/forms/trips/myTrips';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import { Box, Container, Typography } from "@mui/material";
import 'leaflet/dist/leaflet.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { AuthProvider } from './components/forms/auth/authContext';
import { ProtectedRoute } from '../src/components/forms/auth/protectedRoute';
import { TripVisits } from './components/forms/visits/tripVisits';
import Cookies from 'js-cookie';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Box width="100%" minHeight="100vh">
          <Container >
            {/* <h1>ON THE ROAD AGAIN</h1> */}
            <Box 
              borderRadius={4} 
              backgroundColor="#8CCEE9" 
              width="100%" 
              mb={1} 
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.4)" // Ombre personnalisée
            >
              <img src="/titre6.png" alt="titre" />
            </Box>

            <NavbarSite />
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Route d'accueil - peut être publique ou protégée selon vos besoins */}
              <Route path="/" element={<Home />} />

              {/* Routes protégées groupées */}
              <Route path="/me/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="trips" element={<MyTrips />} />
                    <Route path="trips/:tripId" element={<TripVisits />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Route 404 */}
              <Route path="*" element={<Typography>404 - Page non trouvée</Typography>} />
            </Routes>
          </Container>
        </Box>
      </AuthProvider>
    </Router>
  );
};
