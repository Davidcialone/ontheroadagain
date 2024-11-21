import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Button, Container, IconButton, useMediaQuery, Typography } from '@mui/material';
import { AuthContext } from '../auth/authContext';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

export function NavbarSite() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [showNavbar, setShowNavbar] = useState(true); // Navbar visible or not
  const [isCollapsed, setIsCollapsed] = useState(false); // Menu collapsed or not
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check if the screen size is mobile

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

  // Function for logout
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

    // Scroll event listener to hide/show navbar on scroll
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setShowNavbar(false); // Hide navbar when scrolling down
      } else {
        setShowNavbar(true); // Show navbar when scrolling up
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, user]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#f5deb3',
        borderRadius: '8px',
        top: showNavbar ? 0 : '-140px',
        transition: 'top 0.3s',
      }}
    >
      <Container>
        <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {/* Menu Buttons */}
          <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '0.2rem' : '1rem',
                flexWrap: 'nowrap',
                width: 'auto',
                justifyContent: 'center',
              }}
            >
              {isAuthenticated ? (
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
              ) : (
                <>
                  <Button sx={buttonStyles} component={Link} to="/login">
                    Connexion
                  </Button>
                  <Button sx={buttonStyles} component={Link} to="/signup">
                    Inscription
                  </Button>
                </>
              )}
            </div>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              sx={{
                position: 'fixed',
                top: 10,
                right: 10,
                backgroundColor: 'primary.main',
                color: 'white',
                zIndex: 1300,
              }}
              onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapsed menu
            >
              {isCollapsed ? <CloseIcon /> : <MenuIcon />} {/* Change icon when collapsed */}
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Collapsed Menu (Mobile) */}
      {isCollapsed && isMobile && (
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
        </Box>
      )}
    </AppBar>
  );
}
