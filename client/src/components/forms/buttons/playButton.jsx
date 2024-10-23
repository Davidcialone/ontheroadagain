import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material"; // Importer le composant Button
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Importer l'icône ArrowForward de Material UI

export function PlayButton({ onClick }) {
  return (
    <Button
      className="play-visit-button" // Classe pour les styles personnalisés
      onClick={onClick}
      variant="contained" // Type de bouton, peut être 'text', 'contained' ou 'outlined'
      color="primary" // Couleur du bouton
      startIcon={<ArrowForwardIcon />} // Ajoute l'icône au début du bouton
    >
      Jouer
    </Button>
  );
}

PlayButton.propTypes = {
  onClick: PropTypes.func,
};
