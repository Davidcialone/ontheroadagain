import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { uploadImageToCloudinary } from "../../../api/photosApi";

export function AddPhotosModal({ isOpen, onClose, onAddPhotos, visitId }) {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setImageFiles([]);
    setError(null);
    setIsSubmitting(false);
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const filteredFiles = files.filter((file) =>
      validTypes.includes(file.type)
    );

    if (filteredFiles.length !== files.length) {
      setError("Certains fichiers sont invalides (seuls JPEG, PNG, GIF et webp sont acceptés).");
      return;
    }

    setImageFiles(filteredFiles);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (imageFiles.length === 0) {
        setError("Veuillez sélectionner au moins une image.");
        return;
      }

      const uploadedPhotos = await Promise.all(
        imageFiles.map(file => uploadImageToCloudinary(file))
      );

      const photosData = uploadedPhotos.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      onAddPhotos(photosData);
      resetForm();
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
          onChange={handlePhotosUpload}
        />
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
