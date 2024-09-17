import React from 'react';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from './modals/addVisitModal';
import { VisitList } from './visit';


export function TripVisits() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Initialisez `visits` avec un tableau vide pour éviter les erreurs
    const visits = [
        { title: 'Visite du musée', photo: 'https://media.istockphoto.com/id/1096035138/fr/photo/beau-jeune-couple-d%C3%A9tente-apr%C3%A8s-la-randonn%C3%A9e-et-de-prendre-une-pause.webp?a=1&b=1&s=612x612&w=0&k=20&c=16uGRWfxUYrex0tYkXCB-HI298yfBPiNR45NzIe3ZeI=', startDate: '2024-09-20', endDate: '2024-09-21', rating: 4, comment: 'C\'était une expérience incroyable!' },
        { title: 'Promenade en forêt', photo: 'https://media.istockphoto.com/id/1299265795/fr/photo/vacances-en-famille-famille-heureuse-fonctionnant-sur-la-plage-dans-le-coucher-du-soleil-vue.webp?a=1&b=1&s=612x612&w=0&k=20&c=rdtwh9CtVu0JCbmPIJ_jPxz_OGTE4I-JZheXpQpHiGg=', startDate: '2024-09-22', endDate: '2024-09-23', rating: 5, comment: 'La nature était magnifique.' },
    ];

   return (
    <ChakraProvider>
        <h1>Visites du voyage</h1>
        <div className='tripVisits'>
            <AddVisitModal isOpen={isOpen} onClose={onClose} />
            <VisitList className='visits' visits={visits} onAddVisit={onOpen} />
            <button onClick={onOpen}>Ajouter une visite</button>
        </div>
    </ChakraProvider>
);

}
