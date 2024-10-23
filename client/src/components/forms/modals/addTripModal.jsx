import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
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

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    console.log("Form reset");
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
      console.log("Photo uploaded: ", file);
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title || !dateStart || !dateEnd || !description || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    if (isSubmitting) {
      return; // Empêche une double soumission
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

      console.log("Nouvel itinéraire ajouté:", newTrip);

      const addedTrip = await addTrip(newTrip);
      onAddTrip(addedTrip);
      onClose();
      resetForm();
    } catch (error) {
      if (error.message.includes("Un voyage avec le même titre et les mêmes dates existe déjà")) {
        setError("Un voyage avec le même titre et les mêmes dates existe déjà.");
      } else {
        console.error("Erreur lors de l'ajout du voyage:", error);
        setError("Une erreur est survenue lors de l'ajout du voyage.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Ajouter un voyage</DialogTitle>
      <DialogContent>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <FormControl fullWidth margin="normal" required>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Titre"
            placeholder="Titre du voyage"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <input
            type="file"
            onChange={handlePhotoUpload}
            accept="image/jpeg, image/png, image/gif"
          />
          {photo && (
            <img
              src={photo}
              alt="Aperçu"
              style={{
                marginTop: "10px",
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          )}
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <TextField
            label="Date de début"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateStart ? dateStart.toLocaleDateString() : ''}
            onClick={() => setDateStart(dateStart)}
            readOnly
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
            isClearable
            wrapperClassName="react-datepicker-wrapper"
            popperClassName="react-datepicker-popper"
          />
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <TextField
            label="Date de fin"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dateEnd ? dateEnd.toLocaleDateString() : ''}
            onClick={() => setDateEnd(dateEnd)}
            readOnly
          />
          <DatePicker
            selected={dateEnd}
            onChange={(date) => setDateEnd(date)}
            dateFormat="dd/MM/yyyy"
            minDate={dateStart}
            isClearable
            wrapperClassName="react-datepicker-wrapper"
            popperClassName="react-datepicker-popper"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormHelperText>Évaluation</FormHelperText>
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            placeholder="Description du voyage"
            variant="outlined"
            multiline
            rows={4}
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

AddTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTrip: PropTypes.func.isRequired,
};

export default AddTripModal;
