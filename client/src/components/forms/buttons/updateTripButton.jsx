import React from "react";
import PropTypes from "prop-types";
import { EditIcon } from "@chakra-ui/icons";

export function UpdateTripButton({ onClick }) {
  return (
    <button className="update-visit-button" onClick={onClick}>
      <EditIcon/>
    </button>
  );
}

UpdateTripButton.propTypes = {
  onClick: PropTypes.func,
};
