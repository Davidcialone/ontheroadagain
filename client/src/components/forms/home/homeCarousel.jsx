import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, Typography, Container } from '@mui/material';

const baseSlides = [
  { img: '/Rome.png', label: 'Rome' },
  { img: '/Paris.png', label: 'Paris' },
  { img: '/Porto.png', label: 'Porto' },
  { img: '/New York.png', label: 'New York' },
  { img: '/Seville.png', label: 'Seville' }
];

// Dupliquer les slides pour créer un effet infini
const slides = [...baseSlides, ...baseSlides, ...baseSlides];

export const HomeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 3;
  const height = "40vh";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // Revenir au début quand on atteint la fin
        if (nextIndex > slides.length - slidesToShow) {
          return 0;
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Calculer les slides visibles actuellement
  const visibleSlides = slides.slice(currentIndex, currentIndex + slidesToShow);

  return (
    <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 1s ease-in-out',
          width: '100%',
        }}
      >
        {visibleSlides.map((slide, index) => (
          <Box
            key={`${slide.label}-${currentIndex}-${index}`}
            sx={{
              width: `${100 / slidesToShow}%`,
              flexShrink: 0,
              height: height,
              padding: 0.2
            }}
          >
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardMedia
                component="img"
                image={slide.img}
                alt={slide.label}
                sx={{
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: 1,
                  textAlign: 'center'
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