import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import des styles du carousel
import { Image } from '@chakra-ui/react'

export const HomeCarousel = () => {
  return (
    <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000}>
   <div>
        <Image src="On the road again/public/lisbonne.jpg" alt="lisbonne" style={{ width: '100%' }}/>
        </div>
      <div>
        <img src="On the road again/public/mexique.jpg" alt="mexique" style={{ width: '100%' }}/>
      </div>
      <div>
        <img src="On the road again/public/porto.jpg" alt="porto" style={{ width: '100%' }}/>
      </div>
      <div>
        <img src="On the road again/public/verone.jpg" alt="verone" style={{ width: '100%' }}/>
      </div>
    </Carousel>
  );
}

