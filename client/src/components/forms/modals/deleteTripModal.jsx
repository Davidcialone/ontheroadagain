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

export function DeleteTripModal({ isOpen, onClose, onDelete, tripId }) {
  const handleDelete = () => {
    if (tripId) {
      onDelete(tripId); // Passer l'ID du voyage à la fonction onDelete
    }
    onClose(); // Fermer la modal après l'appel à onDelete
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Supprimer le voyage</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer ce voyage ? <br />
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

DeleteTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // Assurez-vous que la fonction onDelete est une prop
  tripId: PropTypes.number.isRequired, // Ajoutez la prop pour l'ID du voyage
};

export default DeleteTripModal;
