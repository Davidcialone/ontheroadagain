import React from 'react';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from './modals/addVisitModal';
import { VisitList } from './visitList';

export function TripVisits() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const visits = [
        {
            title: 'Visite du musée',
            photos: [
                'https://media.istockphoto.com/id/1096035138/fr/photo/beau-jeune-couple-d%C3%A9tente-apr%C3%A8s-la-randonn%C3%A9e-et-de-prendre-une-pause.webp?a=1&b=1&s=612x612&w=0&k=20&c=16uGRWfxUYrex0tYkXCB-HI298yfBPiNR45NzIe3ZeI=',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjYz2LWxjpNoHuc-jfn837uJGiQPyktJqECQ&s',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEZny_32N4LkYTLshSE_qCI1WxdQcEl2r9RQ&s',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0suklXx5gEjFIWt_vLTZFuo2nNAsaRDdbWQ&s',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-8cQrm3oVN-0OYAN0Y6Jc6p5wbby4iB8_VA&s'
            ],
            startDate: '2024-09-20',
            endDate: '2024-09-21',
            rating: 4,
            comment: 'C\'était une expérience incroyable!',
        },
        // Autres visites...
    ];
    
    visits.forEach((visit, index) => {
        console.log(`Photos for visit ${index + 1}:`, visit.photos);
    });

   return (
    <ChakraProvider>
        <h1>Visites du voyage</h1>
        <button onClick={onOpen}>Ajouter une visite</button>
        <div className='tripVisits'>
            <AddVisitModal isOpen={isOpen} onClose={onClose} />
            <VisitList className='visits' visits={visits} onAddVisit={onOpen} />
            
        </div>
    </ChakraProvider>
);

}
