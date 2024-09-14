import React from "react";
import PropTypes from "prop-types";
import { AddIcon } from '@chakra-ui/icons'; // Importing from Chakra UI

export function AddVisitButton({ onClick }) {
  return (
    <button className="add-visit-button" onClick={onClick}>
      <AddIcon /> {/* Using Chakra UI's AddIcon directly */}
    </button>
  );
}

AddVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
