import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material"; // Importer le composant Button
import DeleteIcon from "@mui/icons-material/Delete"; // Importer l'icône Delete de Material UI

export function DeleteTripButton({ onClick }) {
  return (
    <Button 
      className="delete-visit-button" // Classe pour les styles personnalisés
      onClick={onClick} 
      variant="outlined" // Type de bouton, peut être 'text', 'contained' ou 'outlined'
      color="secondary" // Couleur du bouton
      startIcon={<DeleteIcon />} // Ajoute l'icône au début du bouton
    >
      Supprimer
    </Button>
  );
}

DeleteTripButton.propTypes = {
  onClick: PropTypes.func,
};
