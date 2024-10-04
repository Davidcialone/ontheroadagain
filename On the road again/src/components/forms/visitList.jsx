import React from "react";
import PropTypes from "prop-types";
<<<<<<< HEAD
import { Flex } from "@chakra-ui/react";
import { Visit } from "./visit"; // Import Visit component

export function VisitList({ visits }) {
  return (
    <Flex wrap="wrap" gap={4} justifyContent="flex-start">
      {/* Render Trip Cards */}
      {visits.map((visit, index) => (
        <Visit
          key={index}
=======
import { AddIcon } from "@chakra-ui/icons";
import { Visit } from "./visit";
import {
  Button,
  Flex,
} from "@chakra-ui/react";

export function VisitList({ visits, onAddVisit }) {
  return (
    <Flex wrap="wrap" gap={4} justifyContent="flex-start">
      {/* Bouton pour ajouter une visite */}
      <Button
        onClick={onAddVisit}
        leftIcon={<AddIcon />}
        colorScheme="blue"
        mb={4}
        width="10%"
        minWidth="120px"
        flex="1 1 10%"
      >
        Ajouter
      </Button>

      {/* Affichage des cartes de visite */}
      {visits.map((visit, index) => (
        <Visit
          key={index}
          photos={visit.photos}
>>>>>>> 39b1c5d5d105dce86d895a831934c3c5b3313d6c
          title={visit.title}
          photo={visit.photo} // Optional photo
          photos={visit.photos} // Pass photos array to VisitPhotos
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
<<<<<<< HEAD
      photo: PropTypes.string, // Optional single photo
      photos: PropTypes.arrayOf(PropTypes.string), // Photos array for VisitPhotos
=======
      photos: PropTypes.arrayOf(PropTypes.string).isRequired,
>>>>>>> 39b1c5d5d105dce86d895a831934c3c5b3313d6c
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ).isRequired,
<<<<<<< HEAD
=======
  onAddVisit: PropTypes.func.isRequired,
>>>>>>> 39b1c5d5d105dce86d895a831934c3c5b3313d6c
};
