import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import de l'icône Add de Material UI

export function AddVisitButton({ onClick }) {
  return (
    <Button 
      className="add-visit-button" // Vous pouvez garder la classe pour le style personnalisé
      onClick={onClick} 
      variant="contained" // Type de bouton, vous pouvez choisir 'text' ou 'outlined' si besoin
      color="primary" // Couleur du bouton
      startIcon={<AddIcon />} // Ajoute l'icône au début du bouton
    >
      Ajouter une visite
    </Button>
  );
}

AddVisitButton.propTypes = {
  onClick: PropTypes.func,
};
