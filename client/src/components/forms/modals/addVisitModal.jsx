import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import { addVisit } from "../../../api/visitApi"; // Assurez-vous que cette fonction existe dans l'API visit

export function AddVisitModal({ isOpen, onClose, onAddVisit, tripId }) {
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);
  const [geo, setGeo] = useState("");
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setError(null);
    console.log("Tentative d'enregistrement de la visite...");

    // Vérifie que tous les champs requis sont remplis
    if (!title || !dateStart || !dateEnd || !comment) {
      setError("Veuillez remplir tous les champs requis.");
      console.warn("Champs requis manquants:", { title, dateStart, dateEnd, comment });
      return;
    }

    // Vérifie que la date de fin est après la date de début
    if (dateEnd <= dateStart) {
      setError("La date de fin doit être après la date de début.");
      console.warn("Validation des dates échouée:", { dateStart, dateEnd });
      return;
    }

    // Vérifie que tripId est valide
    if (!tripId) {
      setError("Le tripId est manquant. Veuillez sélectionner un voyage.");
      console.warn("tripId est manquant");
      return;
    }

    try {
      const newVisit = {
        title,
        dateStart,
        dateEnd,
        comment,
        rating,
        geo,
        tripId, // Assurez-vous que tripId est inclus
      };

      console.log("Données de la nouvelle visite:", newVisit);
      const response = await addVisit(newVisit);
      console.log("Nouvelle visite ajoutée:", response);
      onAddVisit(response); // Passe la nouvelle visite ajoutée
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la visite:", error);
      setError("Une erreur est survenue lors de l'ajout de la visite.");
      console.error("Détails de l'erreur:", error);
    }
  };

  // Met à jour le commentaire lorsque le titre change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setComment(newTitle); // Met à jour le commentaire avec le titre
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Ajouter une visite</DialogTitle>
      <DialogContent>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <FormControl fullWidth margin="normal">
          <TextField
            value={title}
            onChange={handleTitleChange}
            label="Titre"
            placeholder="Titre de la visite"
            variant="outlined"
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de début"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            // Utilisation du DatePicker
            InputProps={{
              readOnly: true,
              value: dateStart ? dateStart.toLocaleDateString() : '',
              onClick: () => setDateStart(dateStart),
            }}
            placeholder="Sélectionnez une date de début"
          />
          <DatePicker
            selected={dateStart}
            onChange={(date) => {
              setDateStart(date);
              if (dateEnd && date < dateEnd) {
                setDateEnd(null); // Réinitialiser dateEnd si dateStart est modifiée
              }
            }}
            dateFormat="dd/MM/yyyy"
            isClearable // Ajoute une option pour effacer la sélection
            wrapperClassName="react-datepicker-wrapper"
            popperClassName="react-datepicker-popper"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de fin"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
              value: dateEnd ? dateEnd.toLocaleDateString() : '',
              onClick: () => setDateEnd(dateEnd),
            }}
            placeholder="Sélectionnez une date de fin"
          />
          <DatePicker
            selected={dateEnd}
            onChange={(date) => setDateEnd(date)}
            dateFormat="dd/MM/yyyy"
            minDate={dateStart} // Empêche la sélection de dates antérieures à dateStart
            isClearable // Ajoute une option pour effacer la sélection
            wrapperClassName="react-datepicker-wrapper"
            popperClassName="react-datepicker-popper"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormHelperText>Note</FormHelperText>
          <ReactStars
            count={5}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            color2={"#ffd700"}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label="Commentaire"
            placeholder="Commentaire de la visite"
            variant="outlined"
            multiline
            rows={4}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          Enregistrer
        </Button>
        <Button onClick={onClose} color="default">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddVisitModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onAddVisit: PropTypes.func,
  tripId: PropTypes.number, // Le tripId est maintenant requis
};

export default AddVisitModal;
