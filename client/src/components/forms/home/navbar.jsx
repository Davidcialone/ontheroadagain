import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import { AuthContext } from '../auth/authContext';

export function NavbarSite() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // État pour gérer le menu déroulant
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Gérer l'ouverture et la fermeture du menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
            OnTheRoadAgain
          </Typography>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/me/trips">Mes voyages</Button>
              <Button color="inherit" component={Link} to="/me/trips/projects">Mes projets de voyages</Button>
            </>
          )}
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Connexion</Button>
              <Button color="inherit" component={Link} to="/signup">Inscription</Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
