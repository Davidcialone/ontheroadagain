import React, { useState, useEffect } from "react";
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
import { addTrip, uploadImageToCloudinary } from "../../../api/tripApi";

export function AddTripModal({ isOpen, onClose, onAddTrip }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(new Date()); // Aujourd'hui
  const [dateEnd, setDateEnd] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); // Demain
  const [rating, setRating] = useState(3); // Initialisation à 3 pour avoir une valeur de départ
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
    setDateStart(new Date()); // Aujourd'hui
    setDateEnd(new Date(new Date().setDate(new Date().getDate() + 1))); // Demain
    setRating(3); // Remise à 3
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
        rating: parseFloat(rating.toFixed(1)), // Assurez-vous que la valeur du rating est un nombre à une décimale
        description,
      };
  
      console.log("Nouvel itinéraire ajouté:", newTrip); // Ajout d'un log pour vérifier les données soumises
  
      const addedTrip = await addTrip(newTrip);
      onAddTrip(addedTrip); // Met à jour la liste des voyages localement
      onClose(); // Ferme le modal sans double fetch
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter un voyage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <FormControl isRequired>
            <FormLabel>Titre</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du voyage"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Photo</FormLabel>
            <Input type="file" onChange={handlePhotoUpload} />
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
          <FormControl mt={4} isRequired>
            <FormLabel>Date de début</FormLabel>
            <DatePicker
              selected={dateStart}
              onChange={(date) => {
                setDateStart(date);
                if (dateEnd && date < dateEnd) {
                  setDateEnd(null); // Réinitialiser la date de fin si elle devient invalide
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de début"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={dateEnd}
              onChange={(date) => setDateEnd(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de fin"
              minDate={dateStart} // Empêche de sélectionner une date antérieure à la date de début
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Évaluation</FormLabel>
            <ReactStars
              count={5} // Limité à 5 étoiles
              value={parseFloat(rating.toFixed(1))} // S'assurer qu'on passe bien un nombre à une décimale
              onChange={(newRating) => {setRating(newRating); // Laisser la valeur telle quelle pour afficher les demi-étoiles
              }}
              size={24}
              half={true} // Permet les étoiles en demi
              color2={"#ffd700"}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du voyage"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSave}
            isLoading={isSubmitting}
          >
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
};
