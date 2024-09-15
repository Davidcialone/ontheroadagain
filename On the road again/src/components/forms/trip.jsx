import React from "react";
import PropTypes from "prop-types";
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
const defaultPhoto =
  "https://media.istockphoto.com/id/539115110/fr/photo/colis%C3%A9e-de-rome-en-italie-et-du-soleil-du-matin.jpg?s=612x612&w=0&k=20&c=-x2jy7JBLHmU6Srs--5kkaW4aiGCcK98bwmRCQpCfZI=";

// Trip Card Component
export function Trip({ photo = defaultPhoto, title, startDate, endDate, rating }) {
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
    <Card className="responsive-card" mb={4} boxShadow="md" >
    <CardHeader>
      <Heading size="md">{title}</Heading>
    </CardHeader>
 
      <CardBody>
        <Box position="relative" width="100%">
          <Image src={photo} alt={title} className="trip-photo" borderRadius="md" mb={4} />
          <IconButton
            icon={<StarIcon />}
            variant="ghost"
            aria-label="Ajouter aux favoris"
            color={bookmarkColor}
            position="absolute"
            top="2"
            right="2"
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
            <Textarea placeholder="Ajoutez un commentaire..." size="sm" />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}

Trip.propTypes = {
  photo: PropTypes.string,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};

// Main Component
export function TripsList({ trips, onAddTrip }) {
  return (
    <Flex wrap="wrap" gap={4} justifyContent="flex-start">
      {/* Add Trip Button */}
      <Button
        onClick={onAddTrip}
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
      {trips.map((trip, index) => (
        <Trip
          key={index}
          photo={trip.photo}
          title={trip.title}
          startDate={trip.startDate}
          endDate={trip.endDate}
          rating={trip.rating}
        />
      ))}
    </Flex>
  );
}

TripsList.propTypes = {
  trips: PropTypes.arrayOf(
    PropTypes.shape({
      photo: PropTypes.string,
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
  onAddTrip: PropTypes.func.isRequired,
};
