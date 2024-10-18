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
  Text,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import { updateTrip } from "../../../api/tripApi";
import { uploadImageToCloudinary } from "../../../api/tripApi";

export function UpdateTripModal({ isOpen, onClose, onUpdateTrip }) {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rating, setRating] = useState(3); // correction du nom de variable
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

  const handleSave = async () => { // Ajout de async ici
    setError(null);

    if (!title || !startDate || !endDate || !description || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    console.log("Image File avant l'ajout:", imageFile);

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      console.log("Image URL après l'ajout:", imageUrl);
      const tripUpdateDetails = {
        title,
        photo: imageUrl,
        dateStart: startDate, // correction de la variable
        dateEnd: endDate, // correction de la variable
        note: rating, // correction de la variable
        description,
      };
      console.log(tripUpdateDetails);
      
      await updateTrip(tripUpdateDetails);
      onUpdateTrip(); // Assurez-vous que cette fonction est passée en prop
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du voyage:", error);
      setError("Une erreur s'est produite lors de l'ajout du voyage.");
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier un voyage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>} {/* Affichage de l'erreur */}
          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Input
              placeholder="Titre du voyage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Photo</FormLabel>
            <Input type="file" onChange={handlePhotoUpload} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Date de départ</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Évaluation</FormLabel>
            <ReactStars
              count={5}
              size={24}
              value={rating}
              onChange={(newRating) => setRating(newRating)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Commentaire</FormLabel>
            <Textarea
              placeholder="Ajoutez un commentaire"
              value={description} // Correction ici
              onChange={(e) => setDescription(e.target.value)} // Correction ici
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

UpdateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTrip: PropTypes.func, // Ajoutez cette prop pour la mise à jour
};


