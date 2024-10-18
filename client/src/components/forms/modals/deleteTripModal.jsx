import React from "react";
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
} from "@chakra-ui/react";

export function DeleteTripModal({ isOpen, onClose, onDelete, tripId }) {
  const handleDelete = () => {
    if (tripId) {
      onDelete(tripId); // Passer l'ID du voyage à la fonction onDelete
    }
    onClose(); // Fermer la modal après l'appel à onDelete
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Supprimer le voyage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Êtes-vous sûr de vouloir supprimer ce voyage ? <br />
            Cette action est irréversible.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Supprimer
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

DeleteTripModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func, // Assurez-vous que la fonction onDelete est une prop
  tripId: PropTypes.number, // Ajoutez la prop pour l'ID du voyage
};
