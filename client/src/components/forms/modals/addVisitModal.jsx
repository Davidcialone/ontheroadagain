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
  // const [dateStart, setDateStart] = useState(tripStart ? new Date(tripStart) : new Date());
  // const [dateEnd, setDateEnd] = useState(tripEnd ? new Date(tripEnd) : new Date());
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
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

  // console.log("Before useEffect - tripStart:", tripStart);
  // console.log("Before useEffect - tripEnd:", tripEnd);


// Utilisez useEffect pour synchroniser les dates avec tripStart et tripEnd en fonction de tripId
useEffect(() => {
  if (tripId && tripStart && tripEnd) {
    // Créer les objets Date sans conversion vers les chaînes
    const start = new Date(tripStart);
    const end = new Date(tripEnd);

    // Vérifier que les dates sont valides avant de les enregistrer
    if (!isNaN(start.getTime())) {
      setDateStart(start); // Conserver l'objet Date
      console.log("Updated dateStart:", start);
    }

    if (!isNaN(end.getTime())) {
      setDateEnd(end); // Conserver l'objet Date
      console.log("Updated dateEnd:", end);
    }
  }
}, [tripId, tripStart, tripEnd]);



  const resetForm = () => {
    setTitle("");
    setPhoto(null);
    setImageFile(null);
    setComment("");
    setError(null);
    setIsSubmitting(false);
    setRating(3);
    setDateStart(new Date(tripStart || Date.now())); // Réinitialisation avec une date par défaut
    setDateEnd(new Date(tripEnd || Date.now())); // Réinitialisation avec une date par défaut
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
  
    // Utiliser directement les objets Date (pas de conversion en ISO)
    const visitStart = dateStart;
    const visitEnd = dateEnd;
  
    console.log("visitStart (Local):", visitStart);
    console.log("visitEnd (Local):", visitEnd);
  
    // Vérification des champs du formulaire
    if (!title || !visitStart || !visitEnd || !comment || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }
  
    // Vérification des dates du voyage
    if (!tripStart || !tripEnd) {
      setError("Les dates du voyage sont invalides.");
      return;
    }
  
    const parsedTripStart = new Date(tripStart);
    const parsedTripEnd = new Date(tripEnd);
  
    // Vérification des dates de voyage
    if (isNaN(parsedTripStart.getTime()) || isNaN(parsedTripEnd.getTime())) {
      setError("Les dates du voyage sont invalides.");
      return;
    }
  
    // Assurez-vous que la date de fin n'est pas avant la date de début
    if (visitEnd.toLocaleDateString("fr-FR") < visitStart.toLocaleDateString("fr-FR")) {
      setError("La date de fin ne peut pas être avant la date de début.");
      return;
    }
  
    // Assurez-vous que les dates de la visite sont dans la période du voyage
    if (visitStart.toLocaleDateString("fr-FR") < parsedTripStart.toLocaleDateString("fr-FR") || visitEnd.toLocaleDateString("fr-FR") > parsedTripEnd.toLocaleDateString("fr-FR")) {
      setError(`Les dates de la visite doivent être comprises entre ${parsedTripStart.toLocaleDateString()} et ${parsedTripEnd.toLocaleDateString()}.`);
      return;
    }
  
    // Si tout est valide, procéder à l'enregistrement de la visite
    if (isSubmitting) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const imageData = await uploadImageToCloudinary(imageFile);
  
      const newVisit = {
        title,
        photo: imageData.secure_url,
        dateStart: visitStart,
        dateEnd: visitEnd, 
        rating: parseFloat(rating.toFixed(1)),
        comment,
        tripId,
      };
      console.log(" dans addvisitmadal new visit", newVisit);
  
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
