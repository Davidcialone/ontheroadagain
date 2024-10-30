import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";


export function DeleteVisitModal({ isOpen, onClose, onDelete, visitId, tripId }) {
  const handleDelete = () => {
    if (visitId && tripId) {
        console.log(`Deleting visit with ID: ${visitId} and trip ID: ${tripId}`);
        onDelete(visitId, tripId);
    } else {
        console.error("visitId or tripId is missing");
    }
    onClose(); 
};

  


  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Supprimer la visite</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer cette visite ? <br />
          Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Supprimer
        </Button>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteVisitModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func, // Assurez-vous que la fonction onDelete est une prop
  visitId: PropTypes.number, 
  tripId: PropTypes.number,
};

export default DeleteVisitModal;
