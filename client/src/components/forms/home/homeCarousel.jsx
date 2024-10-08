import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import des styles du carousel
import { Image } from '@chakra-ui/react';

export const HomeCarousel = () => {
  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000}>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/lisbonne.jpg" alt="lisbonne" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/mexique.jpg" alt="mexique" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/porto.jpg" alt="porto" />
        </div>
        <div className="image-wrapper">
          <Image src="/ontheroadagain/verone.jpg" alt="verone" />
        </div>
      </Carousel>
    </div>
  );
}

