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
import { addTrip } from "../../../api/tripApi";
import { uploadImageToCloudinary } from "../../../api/tripApi";

export function AddTripModal({ isOpen, onClose, onAddTrip }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [note, setNote] = useState(3);
  const [description, setDescription] = useState("");
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
      console.log("Fichier image sélectionné:", file);
    } else {
      setError("Aucun fichier sélectionné");
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title || !dateStart || !dateEnd || !description || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    console.log("Image File avant l'ajout:", imageFile);

    try {
      const imageData = await uploadImageToCloudinary(imageFile);

      const newTrip = {
        title,
        photo: imageData.secure_url,
        dateStart,
        dateEnd,
        note,
        description,
      };

      await addTrip(newTrip);
      onAddTrip(newTrip);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du voyage:", error);
      setError("Une erreur est survenue lors de l'ajout du voyage.");
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
};
