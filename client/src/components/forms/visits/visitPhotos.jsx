import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel"; // Assurez-vous d'avoir un carrousel comme react-material-ui-carousel

export function VisitPhotos({ photos }) {
  console.log("Photos de visite:", photos);
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {photos.length > 0 ? (
        <Carousel>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo.url} // Assurez-vous que le format des URLs de photos correspond
              alt={`Photo ${index + 1}`}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          ))}
        </Carousel>
      ) : (
        <p>Aucune photo disponible</p>
      )}
    </Box>
  );
}

VisitPhotos.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
    })
  ),
};
