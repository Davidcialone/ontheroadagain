import React from "react";
import PropTypes from "prop-types";
import { VisitPhotos } from "./VisitPhotos";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, Textarea, VStack, Divider } from "@chakra-ui/react"
import { UpdateVisitButton } from "../forms/buttons/updateVisitButton";
import { DeleteVisitButton } from "../forms/buttons/deleteVisitButton";
import { StarIcon } from "@chakra-ui/icons";
import { VisitPhotoCarousel } from "../visitPhotosCarousel";

export function Visit({ title, photos, startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const handleUpdate = onUpdate || (() => console.log('Fonction onUpdate non définie'));

  function renderStars(rating) {
    return Array(5).fill("").map((_, i) => (
      <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
    ));
  }

  return (
    <Card className="responsive-card" mb={4} boxShadow="md">
      <CardHeader display="flex" alignItems="center" justifyContent="space-between">
        <Heading size="md">{title}</Heading>
        <Box>
          <UpdateVisitButton onClick={handleUpdate} />
          <DeleteVisitButton onClick={onDelete} />
        </Box>
      </CardHeader>

      <CardBody>
        <VStack spacing={4} align="stretch" divider={<Divider />}>
          <Box>
            <Heading size="xs" textTransform="uppercase">Dates</Heading>
            <Text pt="2" fontSize="sm">
              Départ : {startDate} - Retour : {endDate}
            </Text>
          </Box>

          <Box>
            <Heading size="xs" textTransform="uppercase">Évaluation</Heading>
            <Box pt="2">{renderStars(rating)}</Box>
          </Box>

          <Box>
            <Heading size="xs" textTransform="uppercase">Commentaire</Heading>
            <Textarea value={comment} placeholder="Ajoutez un commentaire..." size="sm" readOnly />
          </Box>

          <Box>
            <Heading size="xs" textTransform="uppercase">Photos</Heading>
            <VisitPhotos photos={photos} />
            {/* <VisitPhotoCarousel photos={photos} /> */}
          </Box>
        </VStack>
      </CardBody>
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
