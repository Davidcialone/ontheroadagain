import React from "react";
import PropTypes from "prop-types";
import { UpdateVisitButton } from "../forms/buttons/updateVisitButton";
import { DeleteVisitButton } from "../forms/buttons/deleteVisitButton";
import { AddIcon, StarIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Image,
  Box,
  Stack,
  StackDivider,
  Text,
  IconButton,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

// URL de l'image par défaut
const defaultPhoto = "https://www.magiclub.com/magiclub/visuals/carroussel-thailande.jpg";

// Trip Card Component
export function Visit({ title, photo = defaultPhoto, startDate, endDate, rating, comment, onUpdate, onDelete }) {
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
          <UpdateVisitButton onClick={onUpdate}/>
          <DeleteVisitButton onClick={onDelete}/>
        </Box>
      </CardHeader>

      <CardBody>
        <Box position="relative" width="100%">
          <Image src={photo} alt={title} className="visit-photo" borderRadius="md" mb={4} />
          <IconButton
            icon={<StarIcon />}
            variant="ghost"
            aria-label="Ajouter aux favoris"
            color={bookmarkColor}
            position="absolute"
            top="-1"
            right="-1"
            backgroundColor="rgba(255, 255, 255, 0.5)"
          />
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
  photo: PropTypes.string,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

// Main Component
export function VisitList({ visits, onAddVisit }) {
  return (
    <Flex wrap="wrap" gap={4} justifyContent="flex-start">
      {/* Add Trip Button */}
      <Button
        onClick={onAddVisit}
        leftIcon={<AddIcon />}
        colorScheme="blue"
        mb={4}
        width="10%"
        minWidth="120px" // Minimum width to ensure it displays correctly
        flex="1 1 10%"
      >
        Ajouter
      </Button>

      {/* Render Trip Cards */}
      {visits.map((visit, index) => (
        <Visit
          key={index}
          photo={visit.photo}
          title={visit.title}
          startDate={visit.startDate}
          endDate={visit.endDate}
          rating={visit.rating}
          comment={visit.comment}
        />
      ))}
    </Flex>
  );
}

VisitList.propTypes = {
  visits: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      photo: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ).isRequired,
  onAddVisit: PropTypes.func.isRequired,
};
