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
import { addVisit } from "../../../api/visitApi"; // Assurez-vous que cette fonction existe dans l'API visit

export function AddVisitModal({ isOpen, onClose, onAddVisit, tripId, placeId }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [comment, setComment] = useState("");
  const [note, setNote] = useState(3);
  const [geo, setGeo] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        console.error("Type de fichier non valide:", file.type);
        setError("Veuillez télécharger une image (JPEG, PNG, GIF).");
        return;
      }
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
    } else {
      setError("Aucun fichier sélectionné");
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title || !dateStart || !dateEnd || !comment || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    try {
      const imageData = await uploadImageToCloudinary(imageFile);

      const newVisit = {
        title,
        photo: imageData.secure_url,
        dateStart,
        dateEnd,
        comment,
        note,
        geo,
        trip_id: tripId,  // ID du voyage associé
        place_id: placeId, // ID du lieu associé
      };

      await addVisit(newVisit); // Fonction API pour ajouter une visite
      onAddVisit(newVisit);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la visite:", error);
      setError("Une erreur est survenue lors de l'ajout de la visite.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter une visite</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la visite"
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
              onChange={(date) => {
                setDateStart(date);
                if (dateEnd && date < dateEnd) {
                  setDateEnd(null); // Réinitialiser dateEnd si dateStart est modifiée
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de début"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={dateEnd}
              onChange={(date) => setDateEnd(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de fin"
              minDate={dateStart} // Empêche la sélection de dates antérieures à dateStart
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
            <FormLabel>Commentaire</FormLabel>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Commentaire de la visite"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Géolocalisation (optionnel)</FormLabel>
            <Input
              value={geo}
              onChange={(e) => setGeo(e.target.value)}
              placeholder="Coordonnées GPS"
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

AddVisitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddVisit: PropTypes.func.isRequired,
  tripId: PropTypes.number,  // Le tripId est nécessaire
  placeId: PropTypes.number, // Le placeId est optionnel
};
