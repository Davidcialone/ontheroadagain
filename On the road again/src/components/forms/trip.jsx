import React from "react";
import PropTypes from "prop-types";

export function Trip({ photo, title, startDate, endDate, rating }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="trip">
      <img src={photo} alt={title} className="trip-photo" />
      <h2 className="trip-title">{title}</h2>
      <p className="trip-dates">
        Départ : {startDate} - Retour : {endDate}
      </p>
      <div className="trip-rating">{renderStars(rating)}</div>
    </div>
  );
}

Trip.propTypes = {
  photo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};
