import React from "react";
import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";
import { Visit } from "./visit"; // Import Visit component

export function VisitList({ visits }) {
  return (
    <Flex wrap="wrap" gap={4} justifyContent="flex-start">
      {/* Render Trip Cards */}
      {visits.map((visit, index) => (
        <Visit
          key={index}
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
      photo: PropTypes.string, // Optional single photo
      photos: PropTypes.arrayOf(PropTypes.string), // Photos array for VisitPhotos
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ).isRequired,
};
