// modals/addVisitModal.js
import React, { useState } from 'react';
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

export function AddVisitModal({ isOpen, onClose }) {
    // State pour gérer les champs du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);

    // Gestion des fichiers sélectionnés
    const handlePhotoUpload = (event) => {
        setPhotos([...event.target.files]);
    };

    // Gestion de la notation
    const handleRatingClick = (index) => {
        setRating(index + 1);
    };

    // Gestion de la soumission du formulaire
    const handleSave = () => {
        const visitData = {
            title,
            description,
            startDate,
            endDate,
            rating,
            comment,
            photos,
        };
        console.log('Visit Data:', visitData);
        // Ajoutez votre logique d'enregistrement ici

        // Réinitialiser les champs
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setRating(0);
        setComment('');
        setPhotos([]);

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Ajouter une visite</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormLabel>Titre de la visite</FormLabel>
                    <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre de la visite" 
                        mb={4} 
                    />

                    <FormLabel>Description</FormLabel>
                    <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la visite" 
                        mb={4} 
                    />

                    <FormLabel>Date de début</FormLabel>
                    <Input 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Date de début" 
                        mb={4} 
                        type="date" 
                    />

                    <FormLabel>Date de fin</FormLabel>
                    <Input 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="Date de fin" 
                        mb={4} 
                        type="date" 
                    />

                    <FormLabel>Photos</FormLabel>
                    <Input 
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        mb={4}
                    />

                    <FormLabel>Note</FormLabel>
                    <Box mb={4}>
                        {[...Array(5)].map((_, index) => (
                            <StarIcon 
                                key={index} 
                                boxSize={6} 
                                color={index < rating ? "yellow.400" : "gray.300"}
                                onClick={() => handleRatingClick(index)}
                                cursor="pointer"
                            />
                        ))}
                    </Box>

                    <FormLabel>Commentaire</FormLabel>
                    <Textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Commentaire" 
                        mb={4} 
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>
                        Sauvegarder
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

AddVisitModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
  };
  
