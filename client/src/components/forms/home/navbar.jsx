import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Button, Container, IconButton, useMediaQuery  } from '@mui/material';
import { AuthContext } from '../auth/authContext';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

export function NavbarSite() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [showNavbar, setShowNavbar] = useState(true); // État de la navbar visible
  const [isCollapsed, setIsCollapsed] = useState(false); // État du menu (collapsed ou non)

  const buttonStyles = {
    color: '#333',
    backgroundColor: '#87CEEB',
    margin: '0.2rem',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
    borderRadius: '4px',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    '&:hover': {
      color: 'black',
      backgroundColor: '#bdbdbd',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
    },
  };

    // Media query pour détecter si l'écran est plus petit que 600px (Mobile)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }

    // Fonction qui gère l'affichage de la navbar en fonction du scroll
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowNavbar(false); // Masquer la navbar quand on descend
      } else {
        setShowNavbar(true); // Réafficher la navbar quand on remonte
      }
    };

    // Écouter l'événement scroll
    window.addEventListener('scroll', handleScroll);

    // Nettoyage de l'événement lors du démontage du composant
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, user]);

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: '#f5deb3',
        borderRadius: '8px',
        top: showNavbar ? 0 : '-100px',
        transition: 'top 0.3s',
      }}
    >
      <Container>
        <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Boutons à gauche */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile? "column": "row",
              gap: isMobile?'0.2rem':"1rem", // Espace entre les boutons
              flexWrap: 'nowrap', // Permet aux boutons de se réorganiser si nécessaire
              width: '100%',
              justifyContent: 'center' 
            }}
          >
            {isAuthenticated && (
              <>
                <Button sx={buttonStyles} component={Link} to="/">
                  Accueil
                </Button>
                <Button sx={buttonStyles} component={Link} to="/me/trips">
                  Mes voyages
                </Button>
                <Button sx={buttonStyles} onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            )}
          </div>

        
          {/* Bouton d'icône pour afficher/masquer le menu */}
          {!showNavbar && (
            <IconButton
              sx={{
                position: 'fixed',
                top: 10,
                left: 10,
                backgroundColor: 'primary.main',
                color: 'white',
                zIndex: 1300,
              }}
              onClick={() => setShowNavbar(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Menu déroulant (collapsed) */}
      {isCollapsed && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Menu
          </Typography>
        </Box>
      )}
    </AppBar>
  );
}
