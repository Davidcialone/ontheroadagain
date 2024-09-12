import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

export function NavbarSite() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/myTrips">Mes voyages</Nav.Link>
            <Nav.Link as={Link} to="/myTripsProjects">Mes projets de voyages</Nav.Link>
               {/* <NavDropdown title="Mes voyages" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/voyage1">Voyage 1</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voyage2">Voyage 2</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voyage3">Voyage 3</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
        <Nav.Link as={Link} to="/">Connexion</Nav.Link>
      </Container>
    </Navbar>
  );
}
