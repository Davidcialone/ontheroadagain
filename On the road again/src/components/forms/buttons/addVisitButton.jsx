import React from "react";
import PropTypes from "prop-types";


export function AddVisitButton({ onClick }) {
  return (
    <button className="add-visit-button" onClick={onClick}>
    <div>Ajouter</div>
    </button>
  );
}

AddVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};