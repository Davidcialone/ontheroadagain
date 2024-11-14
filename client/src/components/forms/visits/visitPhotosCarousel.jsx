import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Box, IconButton, Paper } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Previous Arrow
const PreviousArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    aria-label="Previous Slide"
    sx={{
      position: "absolute",
      left: "-30px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "black",
      color: "white",
      "&:hover": {
        background: "gray.800",
      },
      zIndex: 2,
    }}
  >
    <ChevronLeftIcon fontSize="small" />
  </IconButton>
);

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    aria-label="Next Slide"
    sx={{
      position: "absolute",
      right: "-30px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "black",
      color: "white",
      "&:hover": {
        background: "gray.800",
      },
      zIndex: 2,
    }}
  >
    <ChevronRightIcon fontSize="small" />
  </IconButton>
);

export function VisitPhotos({ photos}) {
  // Carousel settings (from react-slick)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <PreviousArrow />,  // Custom Previous Arrow
    nextArrow: <NextArrow />,      // Custom Next Arrow
  };

  return (
    <Box maxWidth="800px" mx="auto" mt={4} position="relative">
      <Slider {...settings}>
        {photos.map((photo, index) => (
          <Box key={index}>
            <Paper
              component="img"
              src={photo}
              alt={`Visit photo ${index + 1}`}
              sx={{
                objectFit: "cover",
                width: "100%",
                height: "500px",  // Customize the height as needed
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

VisitPhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
};
