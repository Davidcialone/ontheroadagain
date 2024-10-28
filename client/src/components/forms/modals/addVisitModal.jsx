import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { addVisit, uploadImageToCloudinary } from "../../../api/visitApi";
import { useParams } from "react-router-dom";

export function AddVisitModal({ isOpen, onClose, onAddVisit }) {
  const { tripId } = useParams(); // Récupérer tripId depuis l'URL
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [dateStartOpen, setDateStartOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(3);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  

  const resetForm = () => {
    setTitle("");
    setPhoto(null);
    setDateStart(new Date());
    setDateEnd(new Date(new Date().setDate(new Date().getDate() + 1)));
    setRating(3);
    setComment("");
    setImageFile(null);
    setError(null);
    setIsSubmitting(false);
    console.log('Form reset'); // Log de réinitialisation
  };



  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Veuillez télécharger une image (JPEG, PNG, GIF).");
        console.log('Invalid file type:', file.type); // Log de type de fichier invalide
        return;
      }
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
      console.log('Photo uploaded:', URL.createObjectURL(file)); // Log de photo téléchargée
    }
  };

const handleSave = async () => {
    setError(null);
    console.log('Saving visit...'); // Log lors de la sauvegarde

    // Validation des champs
    if (!title || !dateStart || !dateEnd || !comment || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      console.log('Validation failed: Required fields are missing'); // Log d'erreur de validation
      return;
    }

    if (dateEnd <= dateStart) {
      setError("La date de fin doit être après la date de début.");
      console.log('Validation failed: End date must be after start date'); // Log d'erreur de date
      return;
    }

    // Vérifier si la soumission a déjà eu lieu
    if (isSubmitting) {
      console.log('Already submitting'); // Log si la soumission est déjà en cours
      return;
    }

    // Marquer comme soumis
    setIsSubmitting(true);
   

    try {
      const imageData = await uploadImageToCloudinary(imageFile); // Supposant que cette fonction soit définie ailleurs
      console.log('Image data received:', imageData); // Log des données de l'image

      const newVisit = {
        title,
        photo: imageData.secure_url,
        dateStart: dateStart.toISOString(),
        dateEnd: dateEnd.toISOString(),
        rating: parseFloat(rating.toFixed(1)),
        comment,
        tripId // Ajout direct de tripId depuis l'URL
      };
      console.log('New visit data:', newVisit); // Log des données de la nouvelle visite

      const addedVisit = await addVisit(newVisit);
      console.log('Visit added:', addedVisit); // Log de la visite ajoutée
      onAddVisit(addedVisit);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding visit:", error); // Log de l'erreur lors de l'ajout
      if (error.message.includes("Un voyage avec le même titre et les mêmes dates existe déjà")) {
        setError("Un voyage avec le même titre et les mêmes dates existe déjà.");
      } else {
        setError("Une erreur est survenue lors de l'ajout de la visite.");
      }
    } finally {
      setIsSubmitting(false);
      console.log('Submitting finished'); // Log de fin de soumission
    }
};

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    console.log('Title changed:', e.target.value); // Log du changement de titre
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
          <Typography>Photo actuelle</Typography>
          {photo && <img src={photo} alt="Voyage actuel" style={{ width: "100%", marginBottom: "1em" }} />}
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Importer une nouvelle image (JPEG, PNG, GIF)</FormHelperText>
        </FormControl>

        {/* Date de début */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de début"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateStart ? dateStart.toLocaleDateString() : ''}
            onClick={() => setDateStartOpen(true)}
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
                setDateEnd(null);
              }
            }}
            dateFormat="dd/MM/yyyy"
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
            onClick={() => setDateEndOpen(true)}
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
        <Button color="primary" onClick={handleSave} disabled={isSubmitting}>
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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddVisit: PropTypes.func.isRequired,
};

export default AddVisitModal;
