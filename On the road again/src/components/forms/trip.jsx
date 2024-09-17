import React from "react";
import PropTypes from "prop-types";
import { UpdateTripButton } from "../forms/buttons/updateTripButton";
import { DeleteTripButton } from "../forms/buttons/deleteTripButton";
import { UpdateTripModal } from "./modals/updateTripModal";
import { DeleteTripModal } from "./modals/deleteTripModal";
import { AddIcon, StarIcon } from "@chakra-ui/icons";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
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
          <div>
            <UpdateTripButton onClick={onUpdateOpen} />
            <UpdateTripModal isOpen={isUpdateOpen} onClose={onUpdateClose} />
          </div>
          <div>
            <DeleteTripButton onClick={onDeleteOpen} />
            <DeleteTripModal isOpen={isDeleteOpen} onClose={onDeleteClose} />
          </div>
        </Box>
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
            <Textarea placeholder="Ajoutez un commentaire..." size="sm" />
          </Box>
        </Stack>
        <VisitLink />
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



import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@chakra-ui/icons';

export function VisitLink() {
    return (
        <Link to="/tripVisits">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Par ici la visite... <ArrowRightIcon />
            </div>
        </Link>
    );
}

