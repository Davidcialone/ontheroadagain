import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { AuthContext } from '../auth/authContext'; // Assurez-vous d'importer le bon AuthContext

export function NavbarSite() {
  const { isAuthenticated, logout } = useContext(AuthContext); // Consommer le contexte d'authentification
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout(); // Appeler la fonction de déconnexion depuis le contexte
    navigate('/login'); // Rediriger l'utilisateur vers la page de connexion
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            </Nav.Item>
            {isAuthenticated && (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/me/trips">Mes voyages</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/me/trips/projects">Mes projets de voyages</Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Nav.Item>
                <Nav.Link as="button" onClick={handleLogout} className="me-2">Déconnexion</Nav.Link>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login" className="me-2">Connexion</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/signup">Inscription</Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
