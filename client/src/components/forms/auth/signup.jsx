import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Remplacez useHistory par useNavigate
import { ChakraProvider, Button, Input, FormControl, FormLabel, Box } from '@chakra-ui/react';

export function Signup() {
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Utilisez useNavigate pour la redirection

  // Fonction pour gérer l'inscription
  const handleSignup = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      const response = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, firstname, email, password, confirmPassword }), // Envoyer les données d'inscription
      });

      if (!response.ok) {
        const errorText = await response.text(); // Récupérer le texte brut
        throw new Error(`Erreur: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Inscription réussie:', data);
      // Rediriger l'utilisateur après une inscription réussie
      navigate('/login'); // Redirige vers la page de connexion ou une autre page
    } catch (err) {
      setError(err.message); // Gérer les erreurs
      console.error('Erreur lors de l\'inscription:', err);
    }
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <h1>Inscription</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSignup}>
          <FormControl id="name" isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="firstname" isRequired>
            <FormLabel>Prénom</FormLabel>
            <Input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">
            S'inscrire
          </Button>
        </form>
      </Box>
    </ChakraProvider>
  );
}
