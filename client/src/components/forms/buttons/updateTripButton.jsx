import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material"; // Importer le composant Button
import EditIcon from "@mui/icons-material/Edit"; // Importer l'icône Edit de Material UI

export function UpdateTripButton({ onClick }) {
  return (
    <Button
      className="update-visit-button" // Classe pour les styles personnalisés
      onClick={onClick} 
      variant="outlined" // Type de bouton, peut être 'text', 'contained' ou 'outlined'
      startIcon={<EditIcon />} // Ajoute l'icône au début du bouton
    >
      Modifier
    </Button>
  );
}

UpdateTripButton.propTypes = {
  onClick: PropTypes.func,
};
