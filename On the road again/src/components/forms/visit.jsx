import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Card, CardBody, CardHeader, Heading, Text, Textarea, VStack, Flex, Button, Input, Divider } from "@chakra-ui/react"
import { UpdateVisitButton } from "../forms/buttons/updateVisitButton";
import { DeleteVisitButton } from "../forms/buttons/deleteVisitButton";
import { StarIcon, AddIcon } from "@chakra-ui/icons";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Image } from "@chakra-ui/react";

export function Visit({ title, photos: initialPhotos, startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleUpdate = onUpdate || (() => console.log('Fonction onUpdate non définie'));

  function renderStars(rating) {
    return Array(5).fill("").map((_, i) => (
      <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
    ));
  }

  const handleAddPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos, reader.result];
        setPhotos(newPhotos);
        // Ici, vous devriez également appeler une fonction pour mettre à jour les photos sur le serveur
        if (onUpdate) {
          onUpdate({ ...initialPhotos, photos: newPhotos });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card w="100%" className="responsive-card" mb={4} boxShadow="md">
      <CardHeader display="flex" alignItems="center" justifyContent="space-between">
        <Heading size="md">{title}</Heading>
        <Box>
          <UpdateVisitButton onClick={handleUpdate} />
          <DeleteVisitButton onClick={onDelete} />
        </Box>
      </CardHeader>

      <CardBody>
        <Flex direction={["column", "column", "row"]} gap={4}>
          <VStack spacing={4} align="stretch" flex={1}>
            <Box>
              <Heading size="xs" textTransform="uppercase">Dates</Heading>
              <Text pt="2" fontSize="sm">
                Départ : {startDate} - Retour : {endDate}
              </Text>
            </Box>
            <Divider />
            <Box>
              <Heading size="xs" textTransform="uppercase">Évaluation</Heading>
              <Box pt="2">{renderStars(rating)}</Box>
            </Box>
            <Divider />
            <Box>
              <Heading size="xs" textTransform="uppercase">Commentaire</Heading>
              <Textarea value={comment} placeholder="Ajoutez un commentaire..." size="sm" readOnly />
            </Box>
          </VStack>

          <Box flex={1} minWidth={["100%", "100%", "50%"]}>
            <Flex flexWrap="wrap" gap={2} mb={4}>
              {photos.map((photo, index) => (
                <Box key={index} cursor="pointer" onClick={() => { setPhotoIndex(index); setIsOpen(true); }}>
                  <Image src={photo} alt={`Photo ${index + 1}`} boxSize="100px" objectFit="cover" />
                </Box>
              ))}
            </Flex>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              display="none"
              onChange={handleAddPhoto}
            />
            <Button leftIcon={<AddIcon />} onClick={() => fileInputRef.current.click()}>
              Ajouter une photo
            </Button>
          </Box>
        </Flex>
      </CardBody>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={photos.map(src => ({ src }))}
        index={photoIndex}
      />
    </Card>
  );
}

Visit.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};
