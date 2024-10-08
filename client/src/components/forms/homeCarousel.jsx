import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import des styles du carousel
import { Image } from '@chakra-ui/react'

export const HomeCarousel = () => {
  return (
    <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000}>
   <div>
        <Image src="/ontheroadagain/lisbonne.jpg" alt="lisbonne" style={{ width: '80%' }}/>
        </div>
      <div>
        <img src="/ontheroadagain/mexique.jpg" alt="mexique" style={{ width: '80%' }}/>
      </div>
      <div>
        <img src="/ontheroadagain/porto.jpg" alt="porto" style={{ width: '80%' }}/>
      </div>
      <div>
        <img src="/ontheroadagain/verone.jpg" alt="verone" style={{ width: '80%' }}/>
      </div>
    </Carousel>
  );
}

