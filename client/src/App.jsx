import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/forms/home/home';
import { MyTrips } from './components/forms/trips/myTrips';
import { Login } from './components/forms/auth/login';
import { Signup } from './components/forms/auth/signup';
import { NavbarSite } from './components/forms/home/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/style/app.css';
import '../src/style/trip.css';
import '../src/style/visit.css';
import { Box } from "@chakra-ui/react";

function App() {
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
    <Box width="100%" minHeight="100vh">
      <Router basename="/ontheroadagain">
        <div>
          <h1>ON THE ROAD AGAIN</h1>
          <NavbarSite />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/me/trips" element={isAuthenticated ? <MyTrips /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<div>404 - Page non trouvée</div>} />
          </Routes>
        </div>
      </Router>
    </Box>
  );
}

export default App;
