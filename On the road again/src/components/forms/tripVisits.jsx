import React from 'react';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from './modals/addVisitModal';
import { VisitList } from './visit';


export function TripVisits() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Initialisez `visits` avec un tableau vide pour éviter les erreurs
    const visits = [
        { title: 'Visite du musée', photo: 'url_image_1.jpg', startDate: '2024-09-20', endDate: '2024-09-21', rating: 4, comment: 'C\'était une expérience incroyable!' },
        { title: 'Promenade en forêt', photo: 'url_image_2.jpg', startDate: '2024-09-22', endDate: '2024-09-23', rating: 5, comment: 'La nature était magnifique.' },
    ];

    return (
        <ChakraProvider>
            <h1>Visites du voyage</h1>
            <div >
               <AddVisitModal isOpen={isOpen} onClose={onClose} />
                <VisitList className='visits' visits={visits} onAddVisit={onOpen} />
            </div>
         
        </ChakraProvider>
    );
}
