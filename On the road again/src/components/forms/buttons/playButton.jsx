import React from "react";
import PropTypes from "prop-types";
import { ArrowForwardIcon } from '@chakra-ui/icons'; // Importing from Chakra UI

export function PlayButton({ onClick }) {
  return (
    <button className="delete-visit-button" onClick={onClick}>
    <ArrowRightIcon/>
    </button>
  );
}

PlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};