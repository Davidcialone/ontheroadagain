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
  FormHelperText,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Importer l'icône de calendrier
import CalendarToday from '@mui/icons-material/CalendarToday';
import { addTrip, uploadImageToCloudinary } from "../../../api/tripApi";

export function AddTripModal({ isOpen, onClose, onAddTrip }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [rating, setRating] = useState(3);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateStartOpen, setDateStartOpen] = useState(false); // État pour l'ouverture du DatePicker de date de début
  const [dateEndOpen, setDateEndOpen] = useState(false); // État pour l'ouverture du DatePicker de date de fin

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
    setDescription("");
    setImageFile(null);
    setError(null);
    setIsSubmitting(false);
  };

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
    console.log("Tentative de sauvegarde du voyage...");
    setError(null);

    if (!title || !dateStart || !dateEnd || !description || !imageFile) {
        setError("Veuillez remplir tous les champs requis.");
        return;
    }
    if (dateEnd <= dateStart) {
        setError("La date de fin doit être après la date de début.");
        return;
    }

    if (isSubmitting) {
        console.log("Soumission déjà en cours, retour.");
        return;
    }

    setIsSubmitting(true);

    try {
        const imageData = await uploadImageToCloudinary(imageFile);
        const newTrip = {
            title,
            photo: imageData.secure_url,
            dateStart,
            dateEnd,
            rating: parseFloat(rating.toFixed(1)),
            description,
        };

        const addedTrip = await addTrip(newTrip); // Appel à l'API pour ajouter le voyage

        // Ajoutez `addedTrip` au composant parent
        onAddTrip(addedTrip);
        onClose();
        resetForm();
    } catch (error) {
        console.error("Erreur lors de l'ajout du voyage :", error);
        setError("Une erreur est survenue lors de l'ajout du voyage.");
    } finally {
        setIsSubmitting(false);
    }
};

  
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un voyage</DialogTitle>
      <DialogContent>
        {error && <FormHelperText error>{error}</FormHelperText>}
        
        <FormControl fullWidth margin="normal" required>
          <TextField
            label="Titre"
            variant="outlined"
            placeholder="Titre du voyage"
            value={title}
            onChange={(e) => setTitle(e.target.value || "")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography>Photo actuelle</Typography>
          {photo && <img src={photo} alt="Voyage actuel" style={{ width: "100%", marginBottom: "1em" }} />}
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Importer une nouvelle image (JPEG, PNG, GIF, WEBP)</FormHelperText>
        </FormControl>

        {/* Date de début avec icône */}
        <FormControl fullWidth margin="normal" required>
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

        {/* Date de fin avec icône */}
        <FormControl fullWidth margin="normal" required>
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
          <Typography>Évaluation</Typography>
          <ReactStars
            count={5}
            value={parseFloat(rating.toFixed(1))}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            half={true}
            color2={"#ffd700"}
          />
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value || "")}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
      <Button 
        color="primary" 
        onClick={(e) => {
          e.preventDefault(); // Empêche le comportement par défaut
          handleSave(); // Appel de votre fonction de sauvegarde
        }}
      >
        Enregistrer
      </Button>
        <Button onClick={onClose} >

          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTrip: PropTypes.func.isRequired,
};

export default AddTripModal;
