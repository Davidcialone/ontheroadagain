import React, { useEffect, useState } from 'react';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips } from '../../../api/tripApi';

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const tripsData = await fetchTrips(); // Appel de la fonction pour récupérer les voyages
        setTrips(tripsData); // Mettre à jour l'état avec les voyages récupérés
      } catch (err) {
        setError(err.message); // Gérer les erreurs
      }
    };

    loadTrips(); // Charger les voyages lors du montage du composant
  }, []);

  if (error) return <div>Erreur: {error}</div>;

  return (
    <ChakraProvider>
      <h1>Mes voyages</h1>
      <div className='roadbook'>
        <div className='add-trip-button-layout'>
          <AddTripButton onClick={onOpen} />
          <AddTripModal isOpen={isOpen} onClose={onClose} />
        </div>
        <div className='tripsRoadbook'> 
          {trips.map(trip => (
            <Trip 
              key={trip.id} 
              id={trip.id} 
              photo={trip.photo} 
              title={trip.title} 
              startDate={trip.startDate} 
              endDate={trip.endDate} 
              rating={trip.rating} 
            />
          ))}
        </div>
      </div>
    </ChakraProvider>
  );
}
