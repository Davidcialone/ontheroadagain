import React from "react";
import PropTypes from "prop-types";
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
      photos: PropTypes.arrayOf(PropTypes.string).isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ).isRequired,
  onAddVisit: PropTypes.func.isRequired,
};
