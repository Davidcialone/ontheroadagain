import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  FormControl,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Importer l'icône de calendrier
import { updateVisit } from "../../../api/visitApi"; // Assuming you have an API function for updating visits

export function UpdateVisitModal({ 
  isOpen, 
  onClose,
  onUpdateVisit,
  visit, // Accept the entire visit object for easier state management
}) {
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [dateStartOpen, setDateStartOpen] = useState(false); // État pour l'ouverture du DatePicker de date de début
  const [dateEndOpen, setDateEndOpen] = useState(false); // État pour l'ouverture du DatePicker de date de fin
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle submission state

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen && visit) {
      setTitle(visit.title || "");
      setDateStart(visit.dateStart ? new Date(visit.dateStart) : null);
      setDateEnd(visit.dateEnd ? new Date(visit.dateEnd) : null);
      setRating(Number(visit.rating) || 0);
      setComment(visit.comment || "");
    }
  }, [isOpen, visit]);

  const handleSave = async () => {
    setError(null);

    if (!title || !dateStart || !dateEnd || dateEnd < dateStart || !comment) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    if (isSubmitting) {
      return; // Empêche une double soumission
    }
    setIsSubmitting(true);

    try {
      const isodateStart = dateStart ? new Date(dateStart).toISOString() : null;
      const isodateEnd = dateEnd ? new Date(dateEnd).toISOString() : null;

      const visitUpdateDetails = {
        title,
        dateStart: isodateStart,
        dateEnd: isodateEnd,
        rating: Number(rating),
        comment,
      };

      const updatedVisitData = await updateVisit(visit.id, visitUpdateDetails); // Assuming visit has an id property

      if (updatedVisitData) {
        onUpdateVisit(updatedVisitData);
        onClose();
      } else {
        setError("Erreur lors de la mise à jour de la visite.");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de la visite: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier la visite</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
        
        <FormControl fullWidth margin="normal">
          <TextField
            label="Titre"
            variant="outlined"
            placeholder="Titre de la visite"
            value={title}
            onChange={(e) => setTitle(e.target.value || "")}
          />
        </FormControl>

        {/* Date de début avec icône */}
        <FormControl fullWidth margin="normal">
          <Typography>Date de début</Typography>
          <TextField
            variant="outlined"
            placeholder="Sélectionner une date"
            value={dateStart ? dateStart.toLocaleDateString() : ""}
            readOnly
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setDateStartOpen(true)}>
                  <CalendarTodayIcon />
                </IconButton>
              ),
            }}
            onClick={() => setDateStartOpen(true)} // Ouvre le calendrier
          />
          <DatePicker
            selected={dateStart}
            onChange={(date) => setDateStart(date)}
            dateFormat="dd/MM/yyyy"
            open={dateStartOpen}
            onClickOutside={() => setDateStartOpen(false)}
            onCalendarClose={() => setDateStartOpen(false)}
          />
        </FormControl>

        {/* Date de fin avec icône */}
        <FormControl fullWidth margin="normal">
          <Typography>Date de fin</Typography>
          <TextField
            variant="outlined"
            placeholder="Sélectionner une date"
            value={dateEnd ? dateEnd.toLocaleDateString() : ""}
            readOnly
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setDateEndOpen(true)}>
                  <CalendarTodayIcon />
                </IconButton>
              ),
            }}
            onClick={() => setDateEndOpen(true)} // Ouvre le calendrier
          />
          <DatePicker
            selected={dateEnd}
            onChange={(date) => setDateEnd(date)}
            dateFormat="dd/MM/yyyy"
            minDate={dateStart}
            open={dateEndOpen}
            onClickOutside={() => setDateEndOpen(false)}
            onCalendarClose={() => setDateEndOpen(false)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Note</Typography>
          <ReactStars
            count={5}
            size={24}
            value={rating}
            onChange={(newRating) => setRating(Number(newRating))}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Commentaire"
            variant="outlined"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value || "")}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave} disabled={isSubmitting}>
          Sauvegarder
        </Button>
        <Button onClick={onClose} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UpdateVisitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateVisit: PropTypes.func.isRequired,
  visit: PropTypes.object.isRequired, // Updated to expect a visit object
};
