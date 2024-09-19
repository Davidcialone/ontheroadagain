import React from "react";
import PropTypes from "prop-types";
import { UpdateVisitButton } from "../forms/buttons/updateVisitButton";
import { DeleteVisitButton } from "../forms/buttons/deleteVisitButton";
import { AddIcon, StarIcon } from "@chakra-ui/icons";
import { VisitPhotoCarousel } from "../visitPhotosCarousel";
import {
  Button,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Stack,
  StackDivider,
  Text,
  IconButton,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

// Trip Card Component
export function Visit({ title, photos, startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const bookmarkColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Card className="responsive-card" mb={4} boxShadow="md">
      <CardHeader display="flex" alignItems="center" justifyContent="space-between">
        <Heading size="md">{title}</Heading>
        <Box>
          <UpdateVisitButton onClick={onUpdate} />
          <DeleteVisitButton onClick={onDelete} />
        </Box>
      </CardHeader>

      <CardBody>
        <Box position="relative" width="100%">
          {/* Utilisation du carousel pour les photos */}
          <VisitPhotoCarousel photos={photos} />
     
        </Box>

        <Stack divider={<StackDivider />} spacing={4}>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Dates
            </Heading>
            <Text pt="2" fontSize="sm">
              Départ : {startDate} - Retour : {endDate}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Évaluation
            </Heading>
            <div className="trip-rating">{renderStars(rating)}</div>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Commentaire
            </Heading>
            <Textarea value={comment} placeholder="Ajoutez un commentaire..." size="sm" readOnly />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}

Visit.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired, // Modification pour photos
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};
