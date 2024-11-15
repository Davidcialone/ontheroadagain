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
import ReactStars from "react-stars";
import { addVisit, uploadImageToCloudinary } from "../../../api/visitApi";
import { useParams } from "react-router-dom";

export function AddVisitModal({ isOpen, onClose, onAddVisit, tripDateStart, tripDateEnd }) {
  const { tripId } = useParams(); // Récupérer tripId depuis l'URL
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(new Date(tripDateStart));
  const [dateEnd, setDateEnd] = useState(new Date(tripDateEnd));
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

  useEffect(() => {
    setDateStart(tripDateStart);
    setDateEnd(tripDateEnd);
  }, [tripDateStart, tripDateEnd]);
  // console.log("dans addVisitModal tripDateStart ", tripDateStart);
  // console.log("dans addVisitModal tripDateEnd", tripDateEnd);

  const resetForm = () => {
    setTitle("");
    setPhoto(null);
    setImageFile(null);
    setComment("");
    setError(null);
    setIsSubmitting(false);
    setRating(3);
    setDateStart(new Date(tripDateStart));
    setDateEnd(new Date(tripDateEnd));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Veuillez télécharger une image (JPEG, PNG, GIF ou WEBP).");
        return;
      }
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    setError(null);

    // Validation des champs
    if (!title || !dateStart || !dateEnd || !comment || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    if (dateEnd <= dateStart) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    // Vérifier si la soumission a déjà eu lieu
    if (isSubmitting) {
      return;
    }

   // Vérifier les dates dans les limites du voyage
   const tripStartDate = new Date(tripDateStart);
   const tripEndDate = new Date(tripDateEnd);

   if (dateStart < tripStartDate || dateEnd > tripEndDate) {
     setError("Les dates de la visite doivent être comprises dans les dates du voyage.");
     return;
   }

    // Marquer comme soumis
    setIsSubmitting(true);

    try {
      const imageData = await uploadImageToCloudinary(imageFile);
      const newVisit = {
        title,
        photo: imageData.secure_url,
        dateStart: new Date(dateStart).toISOString().split('T')[0],
        dateEnd: new Date(dateEnd).toISOString().split('T')[0],
        rating: parseFloat(rating.toFixed(1)),
        comment,
        tripId // Ajout direct de tripId depuis l'URL
      };
console.log("newVisit", newVisit);
      const addedVisit = await addVisit(newVisit);
      onAddVisit(addedVisit);
      onClose();
      resetForm();
    } catch (error) {
      if (error.message.includes("Un voyage avec le même titre et les mêmes dates existe déjà")) {
        setError("Un voyage avec le même titre et les mêmes dates existe déjà.");
      } else {
        setError("Une erreur est survenue lors de l'ajout de la visite.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Ajouter une visite</DialogTitle>
      <DialogContent>
        {error && <FormHelperText error>{error}</FormHelperText>}
        
        <FormControl fullWidth margin="normal">
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Titre"
            placeholder="Titre de la visite"
            variant="outlined"
            required
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Photo actuelle</Typography>
          {photo && <img src={photo} alt="Visite actuelle" style={{ width: "100%", marginBottom: "1em" }} />}
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Importer une nouvelle image (JPEG, PNG, GIF ou WEBP)</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de début"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateStart instanceof Date && !isNaN(dateStart) ? dateStart.toLocaleDateString("fr-FR") : ""}
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
            selected={dateStart instanceof Date && !isNaN(dateStart) ? dateStart : null}
            onChange={(date) => {
              if (date && date instanceof Date && !isNaN(date)) {
                setDateStart(date);
                if (dateEnd && date > dateEnd) {
                  setDateEnd(null); // Réinitialise si la date de début est postérieure
                }
              }
            }}
            dateFormat="dd/MM/yyyy"
            open={dateStartOpen}
            onClickOutside={() => setDateStartOpen(false)}
            onCalendarClose={() => setDateStartOpen(false)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Date de fin"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateEnd instanceof Date && !isNaN(dateEnd) ? dateEnd.toLocaleDateString("fr-FR") : ""}
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
            selected={dateEnd instanceof Date && !isNaN(dateEnd) ? dateEnd : null}
            onChange={(date) => {
              if (date && date instanceof Date && !isNaN(date)) {
                setDateEnd(date);
              }
            }}
            dateFormat="dd/MM/yyyy"
            minDate={dateStart instanceof Date && !isNaN(dateStart) ? dateStart : undefined}
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
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button 
          color="primary" 
          onClick={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
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
  tripDateStart: PropTypes.instanceOf(Date),
  tripDateEnd: PropTypes.instanceOf(Date),
};

export default AddVisitModal;
