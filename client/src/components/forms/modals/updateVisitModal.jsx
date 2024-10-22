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

export function UpdateVisitModal({ isOpen, onClose, visit, onUpdateVisit }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Utilisez useEffect pour pré-remplir le formulaire avec les données de la visite existante
  useEffect(() => {
    if (visit) {
      setTitle(visit.title);
      setStartDate(new Date(visit.startDate));
      setEndDate(new Date(visit.endDate));
      setRating(visit.rating);
      setComment(visit.comment);
    }
  }, [visit]);

  const handleSave = () => {
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
              onChange={(e) => setTitle(e.target.value)}
            />
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
  visit: PropTypes.object, // Un objet représentant la visite à mettre à jour
  onUpdateVisit: PropTypes.func.isRequired, // Fonction pour mettre à jour la visite
};
