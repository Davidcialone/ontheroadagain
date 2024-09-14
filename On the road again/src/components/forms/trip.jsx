import React from "react";
import PropTypes from "prop-types";
import { AddVisitButton } from "./buttons/addVisitButton";
import { DeleteVisitButton } from "./buttons/deleteVisitButton";
import { UpdateVisitButton } from "./buttons/updateVisitButton";
import { StarIcon } from "@chakra-ui/icons"; // Utiliser l'icône de marque-page
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Image,
  Box,
  Stack,
  StackDivider,
  Text,
  Flex,
  Textarea,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

// URL de l'image par défaut
const defaultPhoto =
  "https://media.istockphoto.com/id/539115110/fr/photo/colis%C3%A9e-de-rome-en-italie-et-du-soleil-du-matin.jpg?s=612x612&w=0&k=20&c=-x2jy7JBLHmU6Srs--5kkaW4aiGCcK98bwmRCQpCfZI=";

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

  // Utilisez useColorModeValue pour gérer les couleurs en mode clair/sombre
  const bookmarkColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Card mb={4} boxShadow="md"> {/* Ajoute un espacement vertical entre les cartes */}
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">{title}</Heading>
          <Flex>
            <div className="modify-visit">
              <AddVisitButton />
              <DeleteVisitButton />
              <UpdateVisitButton />
            </div>
            {/* Icône de marque-page */}
            <IconButton
              icon={<StarIcon />} // Icône de marque-page
              variant="ghost"
              aria-label="Ajouter aux favoris"
              color={bookmarkColor}
              mr={2}
            />
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody>
        <Image src={photo} alt={title} className="trip-photo" borderRadius="md" mb={4} />
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
