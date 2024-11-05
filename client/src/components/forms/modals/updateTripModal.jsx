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
  FormHelperText,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Importer l'icône de calendrier
import CalendarToday from '@mui/icons-material/CalendarToday';
import { updateTrip, uploadImageToCloudinary } from "../../../api/tripApi";

export function UpdateTripModal({
  isOpen,
  onClose,
  onUpdateTrip,
  tripId,
  title: initialTitle,
  photo: initialPhoto,
  dateStart: initialdateStart,
  dateEnd: initialdateEnd,
  rating: initialRating,
  description: initialDescription,
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [photo, setPhoto] = useState(initialPhoto || null);
  const [dateStart, setDateStart] = useState(initialdateStart || null);
  const [dateEnd, setDateEnd] = useState(initialdateEnd || null);
  const [rating, setRating] = useState(initialRating || 3);
  const [description, setDescription] = useState(initialDescription || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateStartOpen, setDateStartOpen] = useState(false); // État pour l'ouverture du DatePicker de date de début
  const [dateEndOpen, setDateEndOpen] = useState(false); // État pour l'ouverture du DatePicker de date de fin

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || "");
      setPhoto(initialPhoto || null);
      setDateStart(initialdateStart || null);
      setDateEnd(initialdateEnd || null);
      setRating(Number(initialRating) || 3);
      setDescription(initialDescription || "");
      setImageFile(null);
      setError(null);
    }
  }, [isOpen, initialTitle, initialPhoto, initialdateStart, initialdateEnd, initialRating, initialDescription]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Veuillez télécharger une image (JPEG, PNG, GIF).");
        return;
      }
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title || !dateStart || !dateEnd || !description) {
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

      let imageUrl = initialPhoto; // Garde l'ancienne photo par défaut
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const tripUpdateDetails = {
        title,
        photo: imageUrl,
        dateStart: isodateStart,
        dateEnd: isodateEnd,
        rating: Number(rating),
        description,
      };

      const updatedTripData = await updateTrip(tripId, tripUpdateDetails);

      if (updatedTripData) {
        onUpdateTrip(updatedTripData);
        onClose();
      } else {
       setError("Les données mises à jour ne sont pas disponibles après la mise à jour.");
      }
    } catch (error) {
      
      setError("Une erreur est survenue lors de la mise à jour du voyage.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le voyage</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        
        <FormControl fullWidth margin="normal" error={!!error}>
          <TextField
            label="Titre"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Photo actuelle</Typography>
          {photo && <img src={photo} alt="Voyage actuel" style={{ width: "100%", marginBottom: "1em" }} />}
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Importer une nouvelle image (JPEG, PNG, GIF)</FormHelperText>
        </FormControl>

        {/* Date de début avec icône */}
        <FormControl fullWidth margin="normal">
          <Typography>Date de départ</Typography>
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
            onChange={(date) => {
              setDateStart(date);
              if (dateEnd && date > dateEnd) {
                setDateEnd(null); // Réinitialise dateEnd si dateStart change
              }
            }}
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
            minDate={dateStart} // Empêche de sélectionner des dates avant dateStart
            open={dateEndOpen}
            onClickOutside={() => setDateEndOpen(false)}
            onCalendarClose={() => setDateEndOpen(false)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Évaluation</Typography>
          <ReactStars
            count={5}
            size={24}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Commentaire"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          Sauvegarder
        </Button>
        <Button onClick={onClose} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UpdateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTrip: PropTypes.func.isRequired,
  tripId: PropTypes.number.isRequired,
  title: PropTypes.string,
  photo: PropTypes.string,
  dateStart: PropTypes.instanceOf(Date),
  dateEnd: PropTypes.instanceOf(Date),
  rating: PropTypes.number,
  description: PropTypes.string,
};

export default UpdateTripModal;
