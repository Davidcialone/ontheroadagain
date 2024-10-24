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
import ReactStars from "react-stars"; // Importer ReactStars

export function Trip({ id, photo, title, dateStart, dateEnd, description, rating, onTripDeleted, onTripUpdated }) {
  const [updatedTrip, setUpdatedTrip] = useState({});

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

  const handleUpdateClick = () => {
    onUpdateOpen(); // Ouvrir la modale de mise à jour
  };

  const handleUpdateTrip = (updatedTripData) => {
    if (updatedTripData) {
      const { userId, ...tripDataWithoutUserId } = updatedTripData;
      setUpdatedTrip(tripDataWithoutUserId); // Enregistrer les nouvelles données du voyage
      onTripUpdated(tripDataWithoutUserId); // Appeler la fonction pour mettre à jour le voyage dans le parent
      onUpdateClose(); // Fermer la modale
    } else {
      console.error("updatedTripData is undefined");
    }
  };

  const handleDeleteClick = () => {
    onDeleteOpen(); // Ouvrir la modale de suppression
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id); // Suppression via l'API
      onTripDeleted(id); // Notifie le composant parent que le trip a été supprimé
      onDeleteClose(); // Fermer la modale de suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du voyage:", error);
    }
  };

  const colorTheme = "gray";

  return (
    <div>
      <Card data-set-id={id} borderTopRadius="lg" overflow="hidden">
        <CardHeader p={0} borderTopRadius="lg">
          <Box flex={1} minWidth={["100%", "100%", "50%"]}>
            <Link
              as={RouterLink}
              to={`/trips/${id}/visits`}
              style={{ textDecoration: "none" }}
            >
              <Image
                src={photo || updatedTrip.photo || "default-image-url"} // Utiliser la photo mise à jour ou une image par défaut
                alt={title || updatedTrip.title || "Titre non disponible"}
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
            <Heading size="md">{title || updatedTrip.title || "Titre non disponible"}</Heading>
            <Box>
              <UpdateTripButton onClick={handleUpdateClick} />
              <UpdateTripModal
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                onUpdateTrip={handleUpdateTrip} // Utilisation de la fonction de mise à jour
                tripId={id}
                title={title}
                photo={photo}
                startDate={new Date(dateStart)}
                endDate={new Date(dateEnd)}
                rating={typeof rating === "number" ? Number(rating) : 0} // Vérification de la note
                description={description}
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
                <Badge
                  colorScheme={colorTheme}
                  rounded="full"
                  textTransform="uppercase"
                  px="2"
                  mb={2}
                >
                  Dates
                </Badge>
                <Text pt="2" fontSize="sm">
                  Du{" "}
                  {new Date(dateStart).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  au{" "}
                  {new Date(dateEnd).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Box>

              <Box>
                <Badge
                  colorScheme={colorTheme}
                  rounded="full"
                  textTransform="uppercase"
                  px="2"
                  mb={2}
                >
                  Description
                </Badge>
                <Text pt="2" fontSize="sm">
                  {description || updatedTrip.description || "Aucune description disponible"}
                </Text>
              </Box>
              <Box>
                <Badge
                  colorScheme={colorTheme}
                  rounded="full"
                  textTransform="uppercase"
                  px="2"
                  mb={2}
                >
                  Évaluation
                </Badge>
                <Box pt="2">
                  <ReactStars
                    count={5}
                    value={typeof rating === "number" ? Number(rating) : 0} // Assurez-vous que la note est un nombre
                    size={24}
                    half={true} // Permet d'afficher des étoiles à moitié remplies
                    color2={"#ffd700"} // Couleur pour les étoiles pleines
                    color1={"#a9a9a9"} // Couleur pour les étoiles vides
                    edit={false} // Empêche l'édition (utilisateur ne peut pas changer la note)
                  />
                </Box>
              </Box>
            </VStack>
          </Flex>
          <Flex mt="2" alignItems="center" justifyContent="flex-end">
            <Link
              as={RouterLink}
              to={`/me/trips/${id}/visits`}
              style={{ textDecoration: "none" }}
            >
              <Button
                leftIcon={<ViewIcon />}
                colorScheme={colorTheme}
                variant="outline"
                size="sm"
              >
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
  photo: PropTypes.string, // Peut être une chaîne vide
  title: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  description: PropTypes.string,
  rating: PropTypes.number, // Note du voyage, peut être nulle
  onTripDeleted: PropTypes.func.isRequired, // Ajout de la prop pour la gestion de la suppression
  onTripUpdated: PropTypes.func.isRequired, // Ajout de la prop pour la gestion de la mise à jour
};

// Valeurs par défaut pour les props
Trip.defaultProps = {
  photo: "default-image-url", // URL d'image par défaut
  description: "Aucune description disponible", // Valeur par défaut pour la description
  rating: 0, // Valeur par défaut pour la note
};
