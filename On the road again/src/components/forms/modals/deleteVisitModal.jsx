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

export function DeleteVisitModal({ isOpen, onClose, onDelete }) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Supprimer la visite</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Êtes-vous sûr de vouloir supprimer cette visite ? <br />Cette action est irréversible.</Text>
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

DeleteVisitModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
