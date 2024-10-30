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
import { updateVisit } from "../../../api/visitApi"; // Assuming you have an API function for updating visits
import { useParams } from "react-router-dom";

export function UpdateVisitModal({ 
  isOpen, 
  onClose,
  onUpdateVisit,
  visit, // Accept the entire visit object for easier state management
}) {
  // Vérification si la fonction onUpdateVisit est bien passée
  if (typeof onUpdateVisit !== "function") {
    console.error("La prop onUpdateVisit n'est pas une fonction :", onUpdateVisit);
  }

  const { tripId } = useParams(); // Assuming you need to update tripId as well
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(() => {
    const today = new Date();
    return !isNaN(today) ? today : null;
  });
  
  const [dateEnd, setDateEnd] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return !isNaN(tomorrow) ? tomorrow : null;
  });
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [dateStartOpen, setDateStartOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log pour vérifier le tripId
  // console.log('tripId:', tripId);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen && visit) {
      setTitle(visit.title || "");
      setPhoto(visit.photo || null);
      setDateStart(visit.dateStart ? new Date(visit.dateStart) : null);
      setDateEnd(visit.dateEnd ? new Date(visit.dateEnd) : null);
      setRating(Number(visit.rating) || 0);
      setComment(visit.comment || "");
      setImageFile(null);
      console.log("Champs réinitialisés avec les données de la visite:", visit);
    }
  }, [isOpen, visit]);

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
      console.log("Image téléchargée avec succès:", file);
    }
  };

  const handleSave = async () => {
    setError(null);

    // Validation des champs
    if (!title || !dateStart || !dateEnd || dateEnd < dateStart || !comment) {
      setError("Veuillez remplir tous les champs requis.");
      console.warn("Validation échouée:", { title, dateStart, dateEnd, comment });
      return;
    }

    if (isSubmitting) {
      console.log("Soumission déjà en cours, sortie de handleSave.");
      return; // Empêche une double soumission
    }

    setIsSubmitting(true);
    console.log("Début de la soumission, isSubmitting est défini sur true");

    try {
      // Conversion des dates en ISOString
      const isodateStart = dateStart ? new Date(dateStart).toISOString() : null;
      const isodateEnd = dateEnd ? new Date(dateEnd).toISOString() : null;

      const visitUpdateDetails = {
        title,
        dateStart: isodateStart,
        dateEnd: isodateEnd,
        rating: Number(rating),
        comment,
        tripId, // Mise à jour de tripId si nécessaire
      };

      console.log("Appel de updateVisit avec les détails suivants :", visitUpdateDetails);

      const updatedVisitData = await updateVisit(visit.id, visitUpdateDetails, tripId);
      
      // Vérification des données de retour de updateVisit
      console.log("Réponse de updateVisit : ", updatedVisitData);

      if (updatedVisitData) {
        onUpdateVisit(updatedVisitData); // Met à jour l'état
        console.log("Mise à jour réussie, fermeture de la modale");
        if (typeof onClose === "function") {
          onClose();
        } else {
          console.warn("La fonction onClose n'est pas définie ou n'est pas une fonction.");
        }
      } else {
        console.warn("updateVisit n'a pas retourné de données.");
        setError("Erreur lors de la mise à jour de la visite.");
      }
    } catch (err) {
      console.error("Erreur dans handleSave:", err);
      setError("Erreur lors de la mise à jour de la visite: " + err.message);
    } finally {
      console.log("Fin de la soumission, isSubmitting est réinitialisé à false");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier la visite</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>} {/* Affiche le message d'erreur */}
        
        <FormControl fullWidth margin="normal">
          <TextField
            label="Titre"
            variant="outlined"
            placeholder="Titre de la visite"
            value={title}
            onChange={(e) => setTitle(e.target.value || "")}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Photo actuelle</Typography>
          {photo && <img src={photo} alt="Voyage actuel" style={{ width: "100%", marginBottom: "1em" }} />}
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Importer une nouvelle image (JPEG, PNG, GIF)</FormHelperText>
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
              } else {
                setError("La date de début n'est pas valide");
                console.warn("La date de début sélectionnée n'est pas valide :", date);
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
              } else {
                setError("La date de fin n'est pas valide");
                console.warn("La date de fin sélectionnée n'est pas valide :", date);
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
            onChange={(e) => setComment(e.target.value || "")}
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

UpdateVisitModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdateVisit: PropTypes.func,
  visit: PropTypes.object, // Updated to expect a visit object
};
