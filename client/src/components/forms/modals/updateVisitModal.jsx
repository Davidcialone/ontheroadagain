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

export function UpdateVisitModal({ isOpen, onClose, visit, onUpdateVisit }) {
  const [title, setTitle] = useState(""); // Initialisé à une chaîne vide
  const [startDate, setStartDate] = useState(null); // Null est acceptable pour le DatePicker
  const [endDate, setEndDate] = useState(null); // Null est acceptable pour le DatePicker
  const [rating, setRating] = useState(0); // Initialisé à 0, donc un nombre
  const [comment, setComment] = useState(""); // Initialisé à une chaîne vide

  useEffect(() => {
    if (visit) {
      setTitle(visit.title || ""); // Assure que la chaîne n'est jamais null
      setStartDate(visit.startDate ? new Date(visit.startDate) : null);
      setEndDate(visit.endDate ? new Date(visit.endDate) : null);
      setRating(Number(visit.rating) || 0); // Conversion explicite en nombre
      setComment(visit.comment || ""); // Assure que la chaîne n'est jamais null
    }
  }, [visit]);

  const handleSave = () => {
    if (!startDate || !endDate || endDate < startDate) {
      console.error("Date de départ ou de fin invalide");
      return;
    }

    const visitDetails = {
      title,
      startDate,
      endDate,
      rating,
      comment,
    };
    console.log(visitDetails);
    onUpdateVisit(visitDetails); // Appel de la fonction de mise à jour
    onClose(); // Fermer le modal après la mise à jour
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier une visite</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Input
              placeholder="Titre de la visite"
              value={title}
              onChange={(e) => setTitle(e.target.value || "")} // Assure une chaîne vide si null
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Date de départ</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Date de fin</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
              minDate={startDate}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Évaluation</FormLabel>
            <ReactStars
              count={5}
              size={24}
              value={rating} // Assure que c'est un nombre
              onChange={(newRating) => setRating(Number(newRating))} // Conversion explicite en nombre
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Commentaire</FormLabel>
            <Textarea
              placeholder="Ajoutez un commentaire"
              value={comment}
              onChange={(e) => setComment(e.target.value || "")} // Assure une chaîne vide si null
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

UpdateVisitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  visit: PropTypes.object,
  onUpdateVisit: PropTypes.func.isRequired,
};
