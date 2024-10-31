import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { addPhotosToVisit, uploadImageToCloudinary } from "../../../api/photosApi";

export function AddPhotosModal({ isOpen, onClose, onAddPhotos, visitId }) {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setPhotos([]);
    setImageFiles([]);
    setError(null);
    setIsSubmitting(false);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files); // Support for multiple files
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const filteredFiles = files.filter((file) =>
      validTypes.includes(file.type)
    );

    if (filteredFiles.length !== files.length) {
      setError("Certains fichiers sont invalides (seuls JPEG, PNG, GIF sont acceptés).");
      return;
    }

    setImageFiles(filteredFiles);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (imageFiles.length === 0) {
        setError("Veuillez sélectionner au moins une image.");
        return;
      }
  
      const uploadedPhotos = [];
      for (const file of imageFiles) {
        const result = await uploadImageToCloudinary(file);
        uploadedPhotos.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    
      console.log("visitId:", visitId); // Doit afficher un nombre
      console.log("uploadedPhotos:", uploadedPhotos); // Affichez le tableau de photos

      // Assurez-vous que la fonction est appelée avec le bon paramètre
      await addPhotosToVisit(visitId, uploadedPhotos); // Retirer le tripId
      onAddPhotos(uploadedPhotos);
      resetForm(); // Réinitialise le formulaire
    } catch (error) {
      setError(`Erreur lors de l'ajout des photos : ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Ajouter des photos</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
        />
        {/* Display previews of selected photos */}
        {imageFiles.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                style={{ width: "100px", height: "auto", borderRadius: "4px" }}
              />
            ))}
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
          Ajouter
        </Button>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddPhotosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddPhotos: PropTypes.func.isRequired,
  visitId: PropTypes.number.isRequired,
};
