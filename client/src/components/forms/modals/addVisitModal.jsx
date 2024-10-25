import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Importer l'icône
import { addVisit } from "../../../api/visitApi"; // Assurez-vous que cette fonction existe

export function AddVisitModal({ open, onClose, onAddVisit, tripId }) {
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [dateStartOpen, setDateStartOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (!title || !dateStart || !dateEnd || !comment) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }
    if (dateEnd <= dateStart) {
      setError("La date de fin doit être après la date de début.");
      return;
    }
    if (!tripId) {
      setError("Le tripId est manquant. Veuillez sélectionner un voyage.");
      return;
    }
    try {
      const newVisit = { title, dateStart, dateEnd, comment, tripId };
      const response = await addVisit(newVisit);
      onAddVisit(response);
      onClose();
    } catch (error) {
      setError("Une erreur est survenue lors de l'ajout de la visite.");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setComment(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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

        {/* Date de début */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de début"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateStart ? dateStart.toLocaleDateString() : ''}
            onClick={() => setDateStartOpen(true)} // Ouvre le calendrier
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => setDateStartOpen(true)}>
                  <CalendarTodayIcon />
                </IconButton>
              ),
            }}
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
            minDate={new Date()} // Date minimum
            open={dateStartOpen}
            onClickOutside={() => setDateStartOpen(false)}
            onCalendarClose={() => setDateStartOpen(false)}
          />
        </FormControl>

        {/* Date de fin */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de fin"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateEnd ? dateEnd.toLocaleDateString() : ''}
            onClick={() => setDateEndOpen(true)} // Ouvre le calendrier
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => setDateEndOpen(true)}>
                  <CalendarTodayIcon />
                </IconButton>
              ),
            }}
          />
          <DatePicker
            selected={dateEnd}
            onChange={setDateEnd}
            dateFormat="dd/MM/yyyy"
            minDate={dateStart}
            open={dateEndOpen}
            onClickOutside={() => setDateEndOpen(false)}
            onCalendarClose={() => setDateEndOpen(false)}
          />
        </FormControl>

        {/* Commentaire */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Commentaire"
            variant="outlined"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire"
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
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddVisit: PropTypes.func.isRequired,
  tripId: PropTypes.number.isRequired,
};

export default AddVisitModal;
