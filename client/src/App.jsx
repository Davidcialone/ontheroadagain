import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import { MyTrips } from './components/forms/trips/myTrips';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import { Box, Container, Typography, CssBaseline  } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import 'leaflet/dist/leaflet.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { AuthProvider } from './components/forms/auth/authContext';
import { ProtectedRoute } from '../src/components/forms/auth/protectedRoute';
import { TripVisits } from './components/forms/visits/tripVisits';

// Création du thème MUI personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Couleur principale (bleu par défaut)
    },
    secondary: {
      main: '#dc004e', // Couleur secondaire (rouge par défaut)
    },
    background: {
      default: '#f4f4f4', // Fond par défaut
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalisation des styles globaux */}
      <Router>
        <AuthProvider>
          <Box width="100%" minHeight="100vh" bgcolor="background.default">
            <Container>
              <Box
                component="img"
                src="/titre6.png"
                alt="titre"
                sx={{
                  width: "100%", // S'adapte à la largeur du conteneur
                  height: "auto", // Garde les proportions
                  maxWidth: "100%", // Empêche de dépasser la largeur réelle
                  objectFit: "contain", // Ajustement sans déformation
                  display: "block", // Supprime les espaces blancs autour
                  marginBottom: 2, // Espacement en bas
                }}
              />
            

              <NavbarSite />
              <Routes >
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
    </ThemeProvider>
  );
};
