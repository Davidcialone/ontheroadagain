import React from 'react';
import { Trip } from './trip';
import { AddTripButton } from './buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { ModalAddTrip } from "./modals/modalAddTrip";

export function MyTrips() {
    // Utiliser useDisclosure pour gérer l'état de la modale
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <ChakraProvider>
        <h1>Mes voyages</h1>
          <div className='roadbook'>
            <div className='addTripButton'>
          {/* Passer la fonction onOpen à AddTripButton pour ouvrir la modale */}
          <AddTripButton onClick={onOpen} /> 
          
          {/* Inclure la modale ici */}
          <ModalAddTrip isOpen={isOpen} onClose={onClose} />
          </div>
          <div className='tripsRoadbook'> 
            <Trip />
            <Trip />
            <Trip />
            <Trip />
            <Trip />
            </div>
          </div>
      
      </ChakraProvider>
    );
}
