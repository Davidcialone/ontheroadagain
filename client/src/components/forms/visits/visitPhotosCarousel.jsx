import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Image } from '@chakra-ui/react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export function VisitPhotoCarousel({ photos }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleImageClick = (photo) => {
        setSelectedPhoto(photo);
        onOpen();
    };

    return (
        <>
            <Carousel
                showThumbs={false}
                infiniteLoop={false}
                showStatus={false}
                autoPlay={false}
                centerMode={true}
                centerSlidePercentage={33.33}
                showArrows={true}
                emulateTouch={true}
            >
                {photos.map((photo, index) => (
                    <div key={index} onClick={() => handleImageClick(photo)}>
                        <img 
                            src={photo} 
                            alt={`Visit photo ${index + 1}`} 
                            style={{
                                width: '100%',
                                height: '300px',
                                objectFit: 'cover',
                                cursor: 'pointer' // Change cursor to pointer to indicate it's clickable
                            }}
                        />
                    </div>
                ))}
            </Carousel>

            {/* Modal for full-screen image */}
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent backgroundColor="transparent" boxShadow="none">
                    <ModalBody display="flex" justifyContent="center" alignItems="center">
                        <Image src={selectedPhoto} alt="Full screen photo" maxHeight="90vh" maxWidth="90vw" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
