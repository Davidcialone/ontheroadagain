import React from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import de l'icône Add de Material UI

export function AddTripButton({ onClick }) {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick} 
      startIcon={<AddIcon />} // Ajoute l'icône au début du bouton
      sx={{ display: 'flex', alignItems: 'center' }} // Flexbox pour centrer le texte et l'icône
    >
      Ajouter un voyage
    </Button>
  );
}

AddTripButton.propTypes = {
  onClick: PropTypes.func,
};
