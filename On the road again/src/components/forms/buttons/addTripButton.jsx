import React from "react";
import PropTypes from "prop-types";
import { AddTripModal } from "../modals/addTripModal";
import { AddIcon } from "@chakra-ui/icons";


export function AddTripButton({ onClick }) {
  return (
    <button className="add-trip-button" onClick={onClick}>
      <div>Ajouter un voyage</div>
      <div className="plus-button"><AddIcon/></div>
    </button>
  );
}

AddTripButton.propTypes = {
  onClick: PropTypes.func,
};


AddTripModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};