import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corriger l'import si nécessaire
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/authContext'; // Import du contexte d'authentification
import { Container, TextField, Button, Typography, Box, Snackbar } from '@mui/material';

export function Login() {
  const { login } = useContext(AuthContext); // Récupérer la fonction de login du contexte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false); // État pour gérer la snackbar

  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !hasRedirected) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token déjà présent:', decodedToken);
        setHasRedirected(true);
        navigate(`/me/trips`); // Redirige l'utilisateur si déjà connecté
      } catch (err) {
        console.error("Erreur lors du décodage du token:", err);
        Cookies.remove('token'); // Supprimer le token si invalide
      }
    }
  }, [navigate, hasRedirected]); // Assurez-vous que `navigate` et `hasRedirected` sont dans les dépendances
  

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
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
        // Stocker le token dans les cookies
        Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
        const decodedToken = jwtDecode(data.token);

        console.log('Decoded token:', decodedToken);

        // Mettre à jour l'état global d'authentification via le contexte
        login(data.token);

        // Rediriger l'utilisateur
        navigate(`/me/trips`);
      } else {
        throw new Error("Token non reçu dans la réponse.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSnackbarOpen(true); // Ouvrir la snackbar en cas d'erreur
    }
  };

  // Fonction pour fermer la snackbar
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
