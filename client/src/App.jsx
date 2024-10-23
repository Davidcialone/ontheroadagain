import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import { MyTrips } from './components/forms/trips/myTrips';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import { Box, CssBaseline, Container, Typography } from "@mui/material"; // Importations MUI
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { AuthProvider } from './components/forms/auth/authContext';
import { TripVisits } from './components/forms/visits/tripVisits';

export function App() {
  // État pour gérer l'authentification de l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification de la présence d'un token à chaque chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Si un token est trouvé, l'utilisateur est authentifié
    }
  }, []);

  return (
    <AuthProvider>
      <CssBaseline /> {/* Ajoute les styles CSS globaux de MUI */}
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: 'background.default', color: 'text.primary' }}>
        <Router basename="/ontheroadagain">
          <Container maxWidth="lg"> {/* Utilisation d'un conteneur MUI */}
            <Typography variant="h2" align="center" gutterBottom>ON THE ROAD AGAIN</Typography>
            <NavbarSite />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Protéger la route /me/trips, redirige si non authentifié */}
              <Route
                path="/me/trips"
                element={isAuthenticated ? <MyTrips /> : <Navigate to="/login" />}
              />
              {/* Route dynamique pour les visites avec le tripId */}
              <Route
                path="/me/trips/:tripId/visits"
                element={isAuthenticated ? <TripVisits /> : <Navigate to="/login" />}
              />
              {/* Route vers la page de connexion */}
              <Route path="/login" element={<Login />} />
              {/* Route vers la page d'inscription */}
              <Route path="/signup" element={<Signup />} />
              {/* Route pour les pages non trouvées */}
              <Route path="*" element={<Typography>404 - Page non trouvée</Typography>} />
            </Routes>
          </Container>
        </Router>
      </Box>
    </AuthProvider>
  );
}
