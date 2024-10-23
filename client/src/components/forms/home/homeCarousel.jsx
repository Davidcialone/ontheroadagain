import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, Typography, Container } from '@mui/material';

const baseSlides = [
  { img: '/ontheroadagain/Rome.png', label: 'Rome' },
  { img: '/ontheroadagain/Paris.png', label: 'Paris' },
  { img: '/ontheroadagain/Porto.png', label: 'Porto' },
  { img: '/ontheroadagain/New York.png', label: 'New York' },
  { img: '/ontheroadagain/Seville.png', label: 'Seville' }
];

const slides = [];
for (let i = 0; i < 10; i++) {
  slides.push(...baseSlides); // Ajoute le contenu de baseSlides à chaque itération
}

export const HomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3; // Nombre d'images à afficher
  const height = "40vh"; // Hauteur du carousel en pourcentage de la hauteur de la fenêtre

  // Effet pour le défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slides.length - slidesToShow + 1)); // Modulo pour revenir au début
    }, 4000); // Défilement toutes les 4 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle à la désactivation du composant
  }, [slides.length, slidesToShow]);

  return (
    <Container maxWidth="lg" sx={{ overflow: 'hidden', position: 'relative' }}>
      <Box
        display="flex"
        transition="transform 1s ease"
        transform={`translateX(-${(currentSlide * 100) / slidesToShow}%)`}
        width="100%"
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            width={`${100 / slidesToShow}%`}
            flexShrink={0}
            height={height}
            position="relative"
            padding={0}
            margin={0}
          >
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardMedia
                component="img"
                image={slide.img}
                alt={slide.label}
                sx={{
                  objectFit: 'cover',
                  height: '100%',
                  width: '100%',
                  transition: 'opacity 0.5s ease',
                }}
              />
              <Typography
                variant="h6"
                component="div"
                textAlign="center"
                position="absolute"
                bottom="8px"
                left="0"
                right="0"
                color="white"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.5rem',
                }}
              >
                {slide.label}
              </Typography>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
