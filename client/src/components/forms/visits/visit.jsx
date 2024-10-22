import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Flex,
  Image,
  useDisclosure
} from "@chakra-ui/react";
import { StarIcon, AddIcon } from "@chakra-ui/icons"; 
import { UpdateVisitButton } from "../buttons/updateVisitButton";
import { DeleteVisitButton } from "../buttons/deleteVisitButton";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function Visit({ title, photos = [], startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const {
    isOpen: isLightboxOpen,
    onOpen: onLightboxOpen,
    onClose: onLightboxClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Function to render rating stars
  const renderStars = (rating) => {
    return Array(5)
      .fill("")
      .map((_, i) => (
        <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
      ));
  };

  return (
    <Card width="100%" className="responsive-card" mb={4} boxShadow="md">
    <CardHeader display="flex" alignItems="center" justifyContent="space-between">
  <Heading size="md">{title}</Heading>
  <Box>
    <UpdateVisitButton onClick={() => { onUpdate(); onUpdateOpen(); }} /> {/* Appel de la fonction onUpdate ici */}
    <DeleteVisitButton onClick={() => { onDelete(); onDeleteOpen(); }} /> {/* Appel de la fonction onDelete ici */}
  </Box>
</CardHeader>

      <CardBody>
        <Flex direction={["column", "column", "row"]} gap={4}>
          <VStack spacing={4} align="stretch" flex={1}>
            {/* Visit dates */}
            <Box>
              <Heading size="xs" textTransform="uppercase">Dates</Heading>
              <Text pt="2" fontSize="sm">
                Départ : {startDate} - Retour : {endDate}
              </Text>
            </Box>

            {/* Visit rating */}
            <Box>
              <Heading size="xs" textTransform="uppercase">Évaluation</Heading>
              <Box pt="2">{renderStars(rating)}</Box>
            </Box>

            {/* Visit comment */}
            <Box>
              <Heading size="xs" textTransform="uppercase">Commentaire</Heading>
              <Text size="sm">
                {comment || "Aucun commentaire disponible"} {/* Default comment */}
              </Text>
            </Box>
          </VStack>

          {/* Visit photos */}
          <Box flex={1} minWidth={["100%", "100%", "50%"]}>
            <Flex flexWrap="wrap" gap={2} mb={4}>
              {photos.length > 0 ? (
                photos.map((photo, index) => (
                  <Box key={index} cursor="pointer" onClick={() => { setPhotoIndex(index); onLightboxOpen(); }}>
                    <Image src={photo} alt={`Photo ${index + 1}`} boxSize="100px" objectFit="cover" />
                  </Box>
                ))
              ) : (
                <Text>Aucune photo disponible</Text>
              )}
            </Flex>

            {/* Button to add new photo */}
            <Button leftIcon={<AddIcon />} onClick={() => console.log("Ajouter une photo")}>
              Ajouter une photo
            </Button>
          </Box>
        </Flex>
      </CardBody>

      {/* Lightbox for photo preview */}
      <Lightbox
        open={isLightboxOpen}
        close={onLightboxClose}
        slides={photos.map(src => ({ src }))}
        index={photoIndex}
      />

      {/* Add Update and Delete Modal Logic Here if needed */}
    </Card>
  );
}

Visit.propTypes = {
  title: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Visit;
