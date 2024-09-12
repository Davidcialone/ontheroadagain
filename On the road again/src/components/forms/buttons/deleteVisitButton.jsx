import React from "react";
import PropTypes from "prop-types";


export function DeleteVisitButton({ onClick }) {
  return (
    <button className="delete-visit-button" onClick={onClick}>
    <div>Supprimer</div>
    </button>
  );
}

DeleteVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};