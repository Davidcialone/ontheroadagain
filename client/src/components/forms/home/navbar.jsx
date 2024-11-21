import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
} from '@mui/material';
import { AuthContext } from '../auth/authContext';
import { useState } from 'react';


export function NavbarSite() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);

  // console.log('nav bar isAuthenticated', isAuthenticated);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Dès que l'état de l'authentification ou de l'utilisateur change, mettre à jour l'état local
    if (isAuthenticated) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated, user]);  // Déclenche ce useEffect lorsque isAuthenticated ou user changent


  // Styles des boutons
 const buttonStyles = {
    color: '#333',                      // Couleur du texte (gris foncé)
    backgroundColor: '#87CEEB',        // Couleur de fond (gris clair)
    margin: '1rem',                    // Marges
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', // Ombre portée
    borderRadius: '4px',               // Bords arrondis (optionnel)
    transition: 'background-color 0.3s, box-shadow 0.3s', // Transition pour l'effet hover
    '&:hover': {
      color:'black',
      backgroundColor: '#bdbdbd',      // Couleur de fond au survol (gris plus foncé)
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)', // Ombre plus forte au survol
    },
  };
  
    return (
      <AppBar position="static" sx={{ backgroundColor: '#f5deb3', borderRadius: '8px' }}>
        <Container>
          <Toolbar
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Colonne si écran petit, sinon rangée
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Boutons à gauche */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Disposition en colonne sous 724px
                alignItems: 'center',
                gap: 1, // Espacement entre les boutons
                mb: { xs: 1, sm: 0 }, // Marge inférieure uniquement pour petit écran
              }}
            >
              {isAuthenticated && (
                <>
                  <Button 
                    sx={buttonStyles}
                    component={Link} 
                    to="/"
                  >
                    Accueil
                  </Button>
                  <Button 
                    sx={buttonStyles}
                    component={Link} 
                    to="/me/trips"
                  >
                    Mes voyages
                  </Button>
                </>
              )}
            </Box>
    
            {/* Bouton de déconnexion à droite */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Toujours rangée pour ce groupe
                alignItems: 'center',
                gap: 1,
              }}
            >
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <p
                    style={{
                      color: 'black',
                      fontSize: '1rem',
                    }}
                  >
                    Bienvenue, <strong>{currentUser?.pseudo || 'Utilisateur'}</strong>
                  </p>
                  <Button 
                    sx={buttonStyles}
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </Box>
              ) : (
                <>
                  <Button 
                    sx={buttonStyles}
                    component={Link} 
                    to="/login"
                  >
                    Connexion
                  </Button>
                  <Button 
                    sx={buttonStyles}
                    component={Link} 
                    to="/signup"
                  >
                    Inscription
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
    
}
