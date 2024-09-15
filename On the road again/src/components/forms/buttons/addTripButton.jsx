import React from "react";
import PropTypes from "prop-types";
import { AddTripModal } from "../modals/addTripModal";


export function AddTripButton({ onClick }) {
  return (
    <button className="add-trip-button" onClick={onClick}>
      <div>Ajouter un voyage</div>
      <div className="plus-button">+</div>
    </button>
  );
}

AddTripButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};


AddTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};