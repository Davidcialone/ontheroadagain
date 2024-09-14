import React from "react";
import PropTypes from "prop-types";
import { EditIcon } from "@chakra-ui/icons";

export function UpdateVisitButton({ onClick }) {
  return (
    <button className="update-visit-button" onClick={onClick}>
      <EditIcon/>
    </button>
  );
}

UpdateVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
