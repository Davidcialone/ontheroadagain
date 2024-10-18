import React, { useState, useEffect } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

const baseSlides = [
  { img: '/ontheroadagain/Rome.png', label: 'Rome' },
  { img: '/ontheroadagain/Paris.png', label: 'Paris' },
  { img: '/ontheroadagain/Porto.png', label: 'Porto' },
  { img: '/ontheroadagain/New York.png', label: 'New York' },
  { img: '/ontheroadagain/Seville.png', label: 'Seville' }
];

const slides = [];
for (let i = 1; i <= 10; i++) {
  slides.push(...baseSlides); // Ajoute le contenu de baseSlides à chaque itération
}


export const HomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3; // Nombre d'images à afficher
  const height = "40vh"; // Hauteur du carousel en pourcentage de la hauteur de la fenêtre

  // Effet pour le défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev + 1 <= slides.length - slidesToShow ? prev + 1 : 0 // Revenir au début
      );
    }, 4000); // Défilement toutes les 4 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle à la désactivation du composant
  }, [slides.length, slidesToShow]);

  return (
    <Box width="100vw" overflow="hidden" position="relative">
      <Box
        display="flex"
        transition="transform 1s ease" // Augmenter la durée de transition pour plus de fluidité
        transform={`translateX(-${(currentSlide * 100) / slidesToShow}%)`}
        width="100%"
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            width={`${100 / slidesToShow}%`} // Largeur de chaque image en pourcentage
            flexShrink={0}
            height={height} // Utiliser la hauteur fixe ici
            position="relative"
            padding={0}
            margin={0}
          >
            <Image
              src={slide.img}
              alt={slide.label}
              objectFit="cover"
              width="100%"
              height="100%"
              margin="0 auto"
              transition="opacity 0.5s ease" // Ajout d'une transition pour l'opacité
            />
            <Text
              textAlign="center"
              position="absolute"
              bottom="8px"
              left="0"
              right="0"
              color="white"
              bg="rgba(0, 0, 0, 0.2)"
              fontSize="2vh"
            >
              {slide.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
