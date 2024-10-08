import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Box, Image, ChakraProvider, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"; // Chakra UI icons
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Previous Arrow
const PreviousArrow = ({ onClick }) => (
  <IconButton
    icon={<ChevronLeftIcon boxSize={8} />}
    onClick={onClick}
    aria-label="Previous Slide"
    position="absolute"
    left="-30px"
    top="50%"
    transform="translateY(-50%)"
    background="black"
    color="white"
    _hover={{ background: "gray.800" }}
    zIndex={2}
  />
);

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <IconButton
    icon={<ChevronRightIcon boxSize={8} />}
    onClick={onClick}
    aria-label="Next Slide"
    position="absolute"
    right="-30px"
    top="50%"
    transform="translateY(-50%)"
    background="black"
    color="white"
    _hover={{ background: "gray.800" }}
    zIndex={2}
  />
);

export function VisitPhotos({ photos = [] }) {
  // Carousel settings (from react-slick)
  const settings = {
    dots: true,            // Show dots under the carousel
    infinite: true,        // Infinite loop scrolling
    speed: 500,            // Animation speed
    slidesToShow: 1,       // How many slides to show at once
    slidesToScroll: 1,     // How many slides to scroll per swipe
    autoplay: true,        // Enable auto-scrolling
    autoplaySpeed: 3000,   // Auto-scroll every 3 seconds
    arrows: true,          // Show left/right arrows for manual navigation
    prevArrow: <PreviousArrow />,  // Custom Previous Arrow
    nextArrow: <NextArrow />,      // Custom Next Arrow
  };

  return (
    <ChakraProvider>
      <Box maxW="500px" mx="auto" mt={4} position="relative">
        {/* Render photos in the carousel */}
        <Slider {...settings}>
          {photos.map((photo, index) => (
            <Box key={index}>
              <Image
                src={photo}
                alt={`Visit photo ${index + 1}`}
                objectFit="cover"
                width="100%"
                height="300px"  // Customize the height as needed
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </ChakraProvider>
  );
}

VisitPhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired, // PropTypes definition for photos
};
