import React from 'react'
import ReactPlayer from 'react-player'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import des styles du carousel
import { Image } from '@chakra-ui/react';
import '../../../style/HomeCarousel.css'

export const HomeCarousel = () => {
  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000} transitionTime={1500}>
      <div className="player-wrapper">
          <ReactPlayer className="home-player"
          url={"/ontheroadagain/video New York.mp4"}
          playing
          muted />
        </div>
        <div className="image-wrapper" >
          <Image src="/ontheroadagain/New York.png" alt="New York" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/Paris.png" alt="Paris" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/Porto.png" alt="Porto" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/Rome.png" alt="Rome" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/Seville.png" alt="Seville" />
        </div>
      </Carousel>
    </div>
  );
}

