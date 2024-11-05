import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import { MyTrips } from './components/forms/trips/myTrips';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import { Box, CssBaseline, Container, Typography } from "@mui/material";
import 'leaflet/dist/leaflet.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { AuthProvider } from './components/forms/auth/authContext';
import { TripVisits } from './components/forms/visits/tripVisits';
import Cookies from 'js-cookie';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router >
    <AuthProvider>
      <Box width="100%" minHeight="100vh">
      <Container>
            <h1>ON THE ROAD AGAIN</h1>
            <NavbarSite />
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/me/trips" element={isAuthenticated ? <MyTrips /> : <Navigate to="/login" />} />
              <Route path="/me/trips/:tripId" element={isAuthenticated ? <TripVisits /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Typography>404 - Page non trouvée</Typography>} />
            </Routes>
          </Container>
        </Box>
      </AuthProvider>
    </Router>
  );
}
