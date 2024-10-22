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
  Text,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import { updateTrip, uploadImageToCloudinary } from "../../../api/tripApi";

export function UpdateTripModal({
  isOpen,
  onClose,
  onUpdateTrip,
  tripId,
  title: initialTitle,
  photo: initialPhoto,
  startDate: initialStartDate,
  endDate: initialEndDate,
  rating: initialRating,
  description: initialDescription,
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [photo, setPhoto] = useState(initialPhoto || null);
  const [startDate, setStartDate] = useState(initialStartDate || null);
  const [endDate, setEndDate] = useState(initialEndDate || null);
  const [rating, setRating] = useState(initialRating || 3);
  const [description, setDescription] = useState(initialDescription || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  // Réinitialiser les champs lorsque la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || "");
      setPhoto(initialPhoto || null);
      setStartDate(initialStartDate || null);
      setEndDate(initialEndDate || null);
      setRating(Number(initialRating) || 3); // Assurez-vous que c'est un nombre
      setDescription(initialDescription || "");
      setImageFile(null);
      setError(null);
    }
  }, [isOpen, initialTitle, initialPhoto, initialStartDate, initialEndDate, initialRating, initialDescription]);

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

    if (!title || !startDate || !endDate || !description || !imageFile) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    try {
      // Conversion des dates au format ISO avant de les envoyer
      const isoStartDate = startDate ? new Date(startDate).toISOString() : null;
      const isoEndDate = endDate ? new Date(endDate).toISOString() : null;

      // Upload de l'image vers Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const tripUpdateDetails = {
        title,
        photo: imageUrl, // URL de l'image uploadée
        dateStart: isoStartDate,
        dateEnd: isoEndDate,
        rating: Number(rating), // Conversion en nombre
        description,
      };

      // Envoi de la mise à jour à l'API
      const updatedTripData = await updateTrip(tripId, tripUpdateDetails);

      // Vérifiez si les données mises à jour sont définies
      if (updatedTripData) {
        onUpdateTrip(updatedTripData); // Assurez-vous que cette fonction reçoit les bonnes données
        onClose(); // Fermer la modale
      } else {
        console.error("Données mises à jour non disponibles après la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur lors de la modification du voyage:", error);
      setError("Une erreur s'est produite lors de la modification du voyage.");
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier un voyage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>}
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
              onChange={(date) => {
                setStartDate(date);
                if (endDate && date > endDate) {
                  setEndDate(null); // Réinitialiser endDate si startDate est modifiée
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de départ"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date de fin"
              minDate={startDate} // Empêche la sélection de dates antérieures à startDate
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Évaluation</FormLabel>
            <ReactStars
              count={5}
              size={24}
              value={rating}
              onChange={(newRating) => setRating(newRating)} // Assurez-vous que `newRating` est un nombre
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Commentaire</FormLabel>
            <Textarea
              placeholder="Ajoutez un commentaire"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
  onUpdateTrip: PropTypes.func.isRequired,
  tripId: PropTypes.number.isRequired,
  title: PropTypes.string, // Titre du voyage
  photo: PropTypes.string, // URL de la photo
  startDate: PropTypes.instanceOf(Date), // Date de début
  endDate: PropTypes.instanceOf(Date), // Date de fin
  rating: PropTypes.number, // Note du voyage
  description: PropTypes.string, // Description du voyage
};
