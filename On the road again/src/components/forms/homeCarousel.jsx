import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import des styles du carousel

export const HomeCarousel = () => {
  return (
    <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000}>
      <div>
        <img src="/ontheroadagain/public/lisbonne.jpg" alt="lisbonne" style={{ width: '100%' }}/>
      </div>
      <div>
        <img src="/ontheroadagain/public/mexique.jpg" alt="mexique" style={{ width: '100%' }}/>
      </div>
      <div>
        <img src="/ontheroadagain/public/porto.jpg" alt="porto" style={{ width: '100%' }}/>
      </div>
      <div>
        <img src="/ontheroadagain/public/verone.jpg" alt="verone" style={{ width: '100%' }}/>
      </div>
    </Carousel>
  );
}
