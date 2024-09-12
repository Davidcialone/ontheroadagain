import React from "react";
import PropTypes from "prop-types";
import "bootstrap-icons/font/bootstrap-icons.css"; // Assurez-vous d'importer les styles

export function UpdateVisitButton({ onClick }) {
  return (
    <button className="update-visit-button" onClick={onClick}>
      <div>Modifier</div>
    </button>
  );
}

UpdateVisitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
