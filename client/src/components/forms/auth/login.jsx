import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import (make sure jwt-decode is installed)
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/authContext'; // Import authentication context
import { Container, TextField, Button, Typography, Box, Snackbar } from '@mui/material';

export function Login() {
  const { login } = useContext(AuthContext); // Retrieve the login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control snackbar

   // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Get the API base URL from the environment variables
      // Déterminer l'URL de base en fonction de l'environnement
      let API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Récupération de l'URL de base de l'API
      if (import.meta.env.MODE === "production") {
        // Supprimer le slash initial en production si nécessaire
        API_BASE_URL = API_BASE_URL.replace(/\/$/, ""); // Supprime le slash final éventuel
      }
    console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);


    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
     

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la connexion: ${errorText}`);
      }

      const data = await response.json();

      if (data.token) {
        // Store token in cookies
        Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
        const decodedToken = jwtDecode(data.token);

        console.log('Decoded token:', decodedToken);

        // // Update global auth state via context
        login(data.token);

        // Redirect to intended page or /me/trips by default
        const from = location.state?.from || '/me/trips';
        navigate(from, { replace: true });
      } else {
        throw new Error("Token non reçu dans la réponse.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSnackbarOpen(true); // Open snackbar in case of an error
    }
  };

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" component="h2" align="center">Connexion</Typography>
        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={error}
          />
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Se connecter
          </Button>
        </form>
      </Box>
    </Container>
  );
}
