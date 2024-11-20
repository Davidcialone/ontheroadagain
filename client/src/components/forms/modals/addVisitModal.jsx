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

export function AddVisitModal({ isOpen, onClose, onAddVisit, tripStart, tripEnd }) {
  const { tripId } = useParams(); // Récupérer tripId depuis l'URL
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(new Date(tripStart));
  const [dateEnd, setDateEnd] = useState(new Date(tripEnd));
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
    if (tripStart && tripEnd) {
      // Assurez-vous que tripStart et tripEnd sont des objets Date
      setDateStart(new Date(tripStart));
      setDateEnd(new Date(tripEnd));
    }
  }, [tripStart, tripEnd]);

  
  const resetForm = () => {
    setTitle("");
    setPhoto(null);
    setImageFile(null);
    setComment("");
    setError(null);
    setIsSubmitting(false);
    setRating(3);
    setDateStart(new Date(tripStart));
    setDateEnd(new Date(tripEnd));
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
  
    // Assurez-vous que dateStart et dateEnd sont des objets Date
    const visitStart = new Date(dateStart);
    const visitEnd = new Date(dateEnd);
    console.log(visitStart, visitEnd);
  
    // Validation des champs
    if (!title || !visitStart || !visitEnd || !comment || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }
  
    // Vérifier si la date de fin est après la date de début
    if (visitEnd < visitStart) {
      setError("La date de fin doit être après la date de début.");
      return;
    }
  
    if (visitStart < tripStart || visitEnd > tripEnd) {
      setError(`Les dates de la visite doivent être comprises entre ${tripStart.toLocaleDateString()} et ${tripEnd.toLocaleDateString()}.`);
      return;
    }
  
    // Vérifier si la soumission est déjà en cours
    if (isSubmitting) {
      return;
    }
  
    // Marquer comme soumis
    setIsSubmitting(true);
  
    try {
      // Télécharger l'image et récupérer son URL
      const imageData = await uploadImageToCloudinary(imageFile);
  
      // Créer un objet de la visite avec les données valides
      const newVisit = {
        title,
        photo: imageData.secure_url,
        dateStart: visitStart.toISOString().split('T')[0],  // Formater la date en ISO (yyyy-mm-dd)
        dateEnd: visitEnd.toISOString().split('T')[0],
        rating: parseFloat(rating.toFixed(1)),  // Assurez-vous que la note est un nombre flottant
        comment,
        tripId, // Ajout du tripId à partir de l'URL
      };
  
      // Ajouter la visite via l'API
      const addedVisit = await addVisit(newVisit);
  
      // Appeler la fonction pour mettre à jour la liste des visites
      onAddVisit(addedVisit);
    
      // Fermer le modal et réinitialiser le formulaire
      onClose();
      resetForm();
  
    } catch (error) {
      // Gérer l'erreur spécifique ou générique
      if (error.message.includes("Un voyage avec le même titre et les mêmes dates existe déjà")) {
        setError("Un voyage avec le même titre et les mêmes dates existe déjà.");
      } else {
        setError("Une erreur est survenue lors de l'ajout de la visite.");
      }
    } finally {
      setIsSubmitting(false); // Remettre le statut de soumission à false
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
            placeholder="Mettre le nom de la ville"
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
            value={dateEnd instanceof Date && !isNaN(dateEnd) ? dateEnd.toLocaleDateString("fr-FR")  : ""}
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
            selected={dateEnd instanceof Date && !isNaN(dateEnd) ? dateEnd: null}
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
        <Button onClick={onClose} >
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
  tripStart: PropTypes.instanceOf(Date),
  tripEnd: PropTypes.instanceOf(Date),
};

export default AddVisitModal;
