import React from "react";
import PropTypes from "prop-types";
import { DeleteIcon } from '@chakra-ui/icons'; // Importing from Chakra UI

export function DeleteVisitButton({ onClick }) {
  return (
    <button className="delete-visit-button" onClick={onClick}>
    <DeleteIcon/>
    </button>
  );
}

DeleteVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};