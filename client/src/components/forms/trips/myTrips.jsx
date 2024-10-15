import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips } from '../../../../src/api/tripApi'; // API pour récupérer les trips
import { jwtDecode } from 'jwt-decode'; // Import correct de jwt-decode

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate(); // Utilisation du hook pour redirection

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Si pas de token, redirection vers la page de connexion
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Assurez-vous que cette ligne est bien ici

        // Vérifier si le token est expiré
        if (decodedToken.exp < currentTime) {
          // Si le token est expiré, supprimer le token et rediriger vers la page de login
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // Sinon, continuer à charger les voyages
        const tripsData = await fetchTrips(); // Utilisation de fetchTrips sans passer l'ID
        setTrips(tripsData);
      } catch (err) {
        console.error("Erreur lors du chargement des voyages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [navigate]); // Ajout de navigate comme dépendance

  if (loading) return <div>Chargement des voyages...</div>;
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

