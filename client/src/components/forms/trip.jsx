import React, { useState } from "react";
import PropTypes from "prop-types";
import {
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
import { UpdateTripButton } from "./buttons/updateTripButton";
import { DeleteTripButton } from "./buttons/deleteTripButton";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Link as RouterLink } from "react-router-dom";

// URL de l'image par défaut
const defaultPhoto =
  "https://media.istockphoto.com/id/539115110/fr/photo/colis%C3%A9e-de-rome-en-italie-et-du-soleil-du-matin.jpg?s=612x612&w=0&k=20&c=-x2jy7JBLHmU6Srs--5kkaW4aiGCcK98bwmRCQpCfZI=";

// Trip Card Component
export function Trip({ id, photo = defaultPhoto, title, startDate, endDate, rating }) {
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

  function renderStars(rating) {
    return Array(5).fill("").map((_, i) => (
      <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
    ));
  }

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Link as={RouterLink} to={`/trips/${id}/visits`}>
            <Heading size="md">{title}</Heading>
          </Link>
          <Box>
            <UpdateTripButton onClick={(e) => { e.preventDefault(); onUpdateOpen(); }} />
            <DeleteTripButton onClick={(e) => { e.preventDefault(); onDeleteOpen(); }} />
          </Box>
        </Flex>
      </CardHeader>

      <CardBody>
        <Box flex={1} minWidth={["100%", "100%", "50%"]}>
          <Image 
            src={photo} 
            alt={title} 
            objectFit="cover" 
            width="100%" 
            height="200px"
            cursor="pointer"
            onClick={(e) => { e.preventDefault(); setPhotoIndex(0); onLightboxOpen(); }}
          />
        </Box>
        <Flex direction={["column", "column", "row"]} gap={4}>
          <VStack spacing={4} align="stretch" flex={1}>
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
          </VStack>
        </Flex>
        <Flex mt="2" alignItems="center" justifyContent="flex-end">
            <Link as={RouterLink} to={`/trips/${id}/visits`} style={{ textDecoration: 'none' }}>
            <Button leftIcon={<ViewIcon />} colorScheme="teal" variant="outline" size="sm">
              Voir les visites
            </Button>
          </Link>
        </Flex>
      </CardBody>
    </Card>
  );
}

Trip.propTypes = {
  id: PropTypes.string,
  photo: PropTypes.string,
  title: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  rating: PropTypes.number,
};

import { ArrowRightIcon } from '@chakra-ui/icons';

export function VisitLink() {
    return (
        <Link to="/tripVisits">
            <div style={{ margin: '0.5rem', display: 'flex', alignItems: 'center', justifyContent:"flex-end" }}>
                Par ici la visite ...<ArrowRightIcon />
            </div>
        </Link>
    );
}

