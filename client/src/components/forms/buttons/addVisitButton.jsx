import React from "react";
import PropTypes from "prop-types";
import { AddIcon } from '@chakra-ui/icons'; 

export function AddVisitButton({ onClick }) {
  return (
    <button className="add-visit-button" onClick={onClick}>
      <AddIcon />
    </button>
  );
}

AddVisitButton.propTypes = {
  onClick: PropTypes.func,
};
