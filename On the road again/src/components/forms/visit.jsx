import React, { useState } from "react";
import PropTypes from "prop-types";
import { VisitPhotos } from "./VisitPhotos"; // Import the VisitPhotos component
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, Textarea } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
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
export function Visit({ title, startDate, endDate, rating, comment }) {
  // Initial state for photos (can be empty or pre-populated)
  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", 
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    "https://images.unsplash.com/photo-1530629013299-6cbcfb7d1e86",
    "https://images.unsplash.com/photo-1535914254981-b5012eebbd15",
    "https://images.unsplash.com/photo-1558979158-65a1eaa08691",
    "https://images.unsplash.com/photo-1494475673543-6a15f1c7ff4e",
    "https://images.unsplash.com/photo-1519821172141-b5d8a4e7a42e",
    "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    "https://images.unsplash.com/photo-1530629013299-6cbcfb7d1e86",
    "https://images.unsplash.com/photo-1535914254981-b5012eebbd15",
    "https://images.unsplash.com/photo-1558979158-65a1eaa08691",
    "https://images.unsplash.com/photo-1494475673543-6a15f1c7ff4e",
    "https://images.unsplash.com/photo-1519821172141-b5d8a4e7a42e",
  ]);

  // Function to handle adding a new photo (could be from user input)
  const addPhoto = (newPhotoUrl) => {
    setPhotos((prevPhotos) => [...prevPhotos, newPhotoUrl]);
  };

  // Render stars based on rating
export function Visit({ title, photos, startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const renderStars = (rating) => {
    return Array(5).fill("").map((_, i) => (
      <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
    ));
  };

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
        <Box>
          <Text>
            Départ : {startDate} - Retour : {endDate}
          </Text>
          <Text fontSize="sm">Évaluation : {renderStars(rating)}</Text>
          <Textarea value={comment} placeholder="Ajoutez un commentaire..." size="sm" readOnly />

          {/* Display VisitPhotos component with current photos */}
          <VisitPhotos photos={photos} />

          {/* Example of how to add a new photo */}
          <Button mt={4} onClick={() => addPhoto("https://via.placeholder.com/700")}>
            Ajouter une nouvelle photo
          </Button>
        </Box>
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
};
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};
