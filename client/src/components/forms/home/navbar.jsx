import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
} from '@mui/material';
import { AuthContext } from '../auth/authContext';

export function NavbarSite() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // État pour gérer le menu déroulant
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };


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
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Boutons à gauche */}
          <div>
            {isAuthenticated && (
              <>
                <Button 
                  sx={buttonStyles}  // Appliquer ici avec sx
                  component={Link} 
                  to="/"
                >
                 Accueil
                </Button>
               
                <Button 
                  sx={buttonStyles}  // Appliquer ici avec sx
                  component={Link} 
                  to="/me/trips"
                >
                  Mes voyages
                </Button>
                <Button 
                  sx={buttonStyles}  // Appliquer ici avec sx
                  component={Link} 
                  to="/me/trips/projects"
                >
                  Mes projets de voyages
                </Button>
              </>
            )}
          </div>
          
          {/* Bouton de déconnexion à droite */}
          <div>
            {isAuthenticated ? (
              <Box sx={{display:"flex", alignItems:"center"}}>
                {/* Affichage du message de bienvenue avec le pseudo de l'utilisateur */}
                <p style={{
                  color: "black", // Couleur noire
                  fontSize: "1.2rem", // Taille de la police
                  fontWeight: "bold", // Texte en gras                      
                }}>Bienvenue, {user?.pseudo || 'Utilisateur'}!</p> 
                <Button 
                  sx={buttonStyles}  // Appliquer les styles du bouton
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </Box>
            ) : (
              <>
                <Button 
                  sx={buttonStyles}  // Appliquer ici avec sx
                  component={Link} 
                  to="/login"
                >
                  Connexion
                </Button>
                <Button 
                  sx={buttonStyles}  // Appliquer ici avec sx
                  component={Link} 
                  to="/signup"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
