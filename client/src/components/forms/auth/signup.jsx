import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Container,
} from '@mui/material';


export function Signup() {
  const [lastname, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
       // Déterminer l'URL de base en fonction de l'environnement
       let API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Récupération de l'URL de base de l'API
       if (import.meta.env.MODE === "production") {
         // Supprimer le slash initial en production si nécessaire
         API_BASE_URL = API_BASE_URL.replace(/\/$/, ""); // Supprime le slash final éventuel
       }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastname,
          firstname,
          pseudo,
          email,
          password,
          confirmation,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur: ${response.status} - ${errorData.error || 'Erreur inconnue'}`);
      }
  
      const data = await response.json();
      console.log('Inscription réussie:', data);
      navigate('/login'); // Redirige vers la page de connexion en cas de succès
    } catch (err) {
      setError(err.message); // Affiche l'erreur dans l'interface
      console.error('Erreur lors de l\'inscription:', err);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box p={5}>
        <Typography variant="h4" gutterBottom>
          Inscription
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSignup}>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Nom</FormLabel>
            <Input
              type="text"
              value={lastname}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Prénom</FormLabel>
            <Input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Pseudo</FormLabel>
            <Input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <Input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            S'inscrire
          </Button>
        </form>
      </Box>
    </Container>
  );
}
