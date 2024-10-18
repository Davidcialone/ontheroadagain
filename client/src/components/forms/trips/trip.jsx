// Trip.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Flex,
  Image,
  useDisclosure,
  Link,
  Button
} from "@chakra-ui/react";
import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import { UpdateTripButton } from "../buttons/updateTripButton";
import { DeleteTripButton } from "../buttons/deleteTripButton";
import { UpdateTripModal } from "../modals/updateTripModal";
import { DeleteTripModal } from "../modals/deleteTripModal";
import { Link as RouterLink } from "react-router-dom";
import { deleteTrip } from "../../../api/tripApi";

export function Trip({ id, photo, title, dateStart, dateEnd, description, note, onTripDeleted }) {
  const [photoIndex, setPhotoIndex] = useState(0);

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

  const [tripId, setTripId] = useState(null);

  const handleUpdateClick = (id) => {
    console.log("Update trip ID:", id);
    setTripId(id); // Définit l'ID du voyage à mettre à jour
    onUpdateOpen(); // Ouvre le modal de mise à jour
  };

  const handleDeleteClick = () => {
    console.log("Delete trip ID:", id);
    onDeleteOpen(); // Ouvre le modal de suppression
  };

  const handleUpdateTrip = (updatedTrip) => {
    console.log("Updating trip ID:", tripId);
    console.log("Updated trip:", updatedTrip);
    onUpdateClose(); // Ferme le modal de mise à jour
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id); // Fonction pour supprimer le voyage
      onTripDeleted(id); // Appelle la fonction pour mettre à jour la liste dans MyTrips
      onDeleteClose(); // Ferme le modal de suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du voyage:", error);
    }
  };

  function renderStars(rating) {
    return Array(5).fill("").map((_, i) => (
      <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
    ));
  }

  const colorTheme = "gray";

  return (
    <div>
      <Card data-set-id={id} borderTopRadius="lg" overflow="hidden">
        <CardHeader p={0} borderTopRadius="lg">
          <Box flex={1} minWidth={["100%", "100%", "50%"]}>
            <Link as={RouterLink} to={`/trips/${id}/visits`} style={{ textDecoration: 'none' }}>
              <Image
                src={photo}
                alt={title}
                className="trip-image"
                objectFit="cover"
                width="100%"
                height="400px"
                cursor="pointer"
                data-trip-id={id}
              />
            </Link>
          </Box>
          <Flex justifyContent="space-between" alignItems="center" padding={4}>
            <Heading size="md">{title}</Heading>
            <Box>
              <UpdateTripButton onClick={() => handleUpdateClick(id)} />
              <UpdateTripModal
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                onUpdateTrip={handleUpdateTrip}
                tripId={tripId} // Passe l'ID du voyage ici
              />
              <DeleteTripButton onClick={handleDeleteClick} />
              <DeleteTripModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                tripId={id}
                onDelete={handleDeleteTrip}
              />
            </Box>
          </Flex>
        </CardHeader>

        <CardBody>
          <Flex direction={["column", "column", "row"]} gap={4}>
            <VStack spacing={4} align="stretch" flex={1}>
              <Box>
                <Badge colorScheme={colorTheme} rounded="full" textTransform="uppercase" px="2" mb={2}>
                  Dates
                </Badge>
                <Text pt="2" fontSize="sm">
                  Du {new Date(dateStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} au {new Date(dateEnd).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </Box>

              <Box>
                <Badge colorScheme={colorTheme} rounded="full" textTransform="uppercase" px="2" mb={2}>
                  Description
                </Badge>
                <Text pt="2" fontSize="sm">{description}</Text>
              </Box>
              <Box>
                <Badge colorScheme={colorTheme} rounded="full" textTransform="uppercase" px="2" mb={2}>
                  Évaluation
                </Badge>
                <Box pt="2">{renderStars(note)}</Box>
              </Box>
            </VStack>
          </Flex>
          <Flex mt="2" alignItems="center" justifyContent="flex-end">
            <Link as={RouterLink} to={`/trips/${id}/visits`} style={{ textDecoration: 'none' }}>
              <Button leftIcon={<ViewIcon />} colorScheme={colorTheme} variant="outline" size="sm">
                Voir les visites
              </Button>
            </Link>
          </Flex>
        </CardBody>
      </Card>
    </div>
  );
}

// Définir les types de props
Trip.propTypes = {
  id: PropTypes.number.isRequired,
  photo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  note: PropTypes.number,
  onTripDeleted: PropTypes.func.isRequired, // Ajout de la prop pour la gestion de la suppression
};
