import React from "react";
import PropTypes from "prop-types";
import { Visit } from "../forms/visit";
import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";

// Composant VisitList
export function VisitList({ visits, onAddVisit, onUpdateVisit, onDeleteVisit }) {
  return (
    <Flex wrap="nowrap" gap={4} justifyContent="flex-start" flexDirection="row" overflowX="auto">
      {/* Bouton pour ajouter une visite */}
      <Button
        onClick={onAddVisit}
        leftIcon={<AddIcon />}
        colorScheme="blue"
        mb={4}
        minWidth="120px" // Largeur minimale pour assurer un affichage correct
        flex="0 0 auto"
      >
        Ajouter
      </Button>

      {/* Affichage des cartes de visite */}
      {visits.map((visit, index) => (
        <Visit
          key={index}
          photo={visit.photo}
          title={visit.title}
          startDate={visit.startDate}
          endDate={visit.endDate}
          rating={visit.rating}
          comment={visit.comment}
          onUpdateVisit={onUpdateVisit}
          onDeleteVisit={onDeleteVisit}
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
  onUpdateVisit: PropTypes.func,
  onDeleteVisit: PropTypes.func,
};
