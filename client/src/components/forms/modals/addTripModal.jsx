import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import { uploadImageToCloudinary } from "../../../api/tripApi";

export function AddTripModal({ isOpen, onClose, onAddTrip, userId }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [note, setNote] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // Stocke le fichier image
  const [error, setError] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Pour prévisualiser
      setImageFile(file); // Stocke le fichier pour l'upload
    }
  };

  const handleSave = async () => {
    try {
      setError(null); // Réinitialise l'erreur avant de commencer
      let imageUrl = "";

      if (imageFile instanceof File || imageFile instanceof Blob) {
        // Si c'est un fichier, upload via Cloudinary
        const imageData = await uploadImageToCloudinary(imageFile);
        imageUrl = imageData.secure_url;
      }

      // Vérification si l'utilisateur est bien passé en prop
      if (!userId) {
        throw new Error("ID utilisateur non disponible");
      }

      // Sauvegardez le voyage avec l'URL de l'image
      const tripData = {
        title,
        photo: imageUrl,
        dateStart,
        dateEnd,
        note,
        description,
        user_id: userId, // Utilisation de l'ID utilisateur passé en prop
      };

      await onAddTrip(tripData); // Appelle la fonction d'ajout du voyage
    } catch (error) {
      console.error("Erreur lors de l'ajout du voyage:", error);
      setError(error.message || "Une erreur est survenue");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter un voyage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du voyage"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Photo</FormLabel>
            <Input type="file" onChange={handlePhotoUpload} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Date de début</FormLabel>
            <DatePicker
              selected={dateStart}
              onChange={(date) => setDateStart(date)}
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={dateEnd}
              onChange={(date) => setDateEnd(date)}
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Note</FormLabel>
            <ReactStars
              count={5}
              value={note}
              onChange={(newRating) => setNote(newRating)}
              size={24}
              color2={"#ffd700"}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du voyage"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Enregistrer
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

AddTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTrip: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired, // Déclarez userId comme prop nécessaire
};
