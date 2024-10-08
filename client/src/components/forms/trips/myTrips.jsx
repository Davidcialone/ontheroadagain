import React, { useEffect, useState } from 'react';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch('/api/me/trips') // Assurez-vous que cette URL est correcte
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des voyages');
        }
        return response.json();
      })
      .then(data => setTrips(data))
      .catch(err => setError(err.message));
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
