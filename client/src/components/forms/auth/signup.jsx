import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Button, Input, FormControl, FormLabel, Box } from '@chakra-ui/react';

export function Signup() {
  const [lastname, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState(''); // Changement ici
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/ontheroadagain/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastname, firstname, pseudo, email, password, confirmation }), // Changement ici
      });

      if (!response.ok) {
        const errorText = await response.json(); // Récupérer le JSON pour afficher l'erreur
        throw new Error(`Erreur: ${response.status} - ${errorText.error || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      console.log('Inscription réussie:', data);
      navigate('/login'); 
    } catch (err) {
      setError(err.message); 
      console.error('Erreur lors de l\'inscription:', err);
    }
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <h1>Inscription</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSignup}>
          <FormControl id="lastname" isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              type="text"
              value={lastname}
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
          <FormControl id="pseudo" isRequired>
            <FormLabel>Pseudo</FormLabel>
            <Input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
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
          <FormControl id="confirmation" isRequired>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <Input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)} // Changement ici
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



