import React from "react";
import PropTypes from "prop-types";


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
