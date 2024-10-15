import React, { useEffect, useState } from 'react';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips } from '../../../api/tripApi';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is imported

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (!token) throw new Error("Token not found."); // Handle case when token is not found
        
        const decodedToken = jwtDecode(token); // Decode the token to get user ID
        const userId = decodedToken.id; // Assuming 'id' is the property for user ID

        const tripsData = await fetchTrips(userId); // Pass user ID to fetchTrips
        setTrips(tripsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips(); // Load trips when the component mounts
  }, []);

  if (loading) return <div>Chargement des voyages...</div>; // Loading state
  if (error) return <div>Erreur: {error}</div>; // Error state

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
              startDate={trip.dateStart} 
              endDate={trip.dateEnd} 
              rating={trip.note} 
            />
          ))}
        </div>
      </div>
    </ChakraProvider>
  );
}
