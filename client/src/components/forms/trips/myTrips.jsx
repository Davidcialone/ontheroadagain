import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips, addTrip } from '../../../../src/api/tripApi';
import {jwtDecode} from 'jwt-decode';

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const tripsFetched = useRef(false);

  // État pour le nouveau voyage
  const [newTripData, setNewTripData] = useState({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    photo: '',
    note: 0,
  });

  // Charger les voyages
  useEffect(() => {
    const loadTrips = async () => {
      if (tripsFetched.current) return;
      tripsFetched.current = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        console.log("Token décodé:", decodedToken);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const tripsData = await fetchTrips();
        console.log("Voyages chargés:", tripsData);
        setTrips(tripsData);
      } catch (err) {
        console.error("Erreur lors du chargement des voyages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [navigate]);

  // Ajouter un nouveau voyage
  const handleAddTrip = async (tripData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token non trouvé, veuillez vous connecter.");
      }

      const decodedToken = jwtDecode(token);
      console.log("Token décodé:", decodedToken);

      const userId = decodedToken.id 
      console.log("ID d'utilisateur:", userId);

      if (!userId) {
        throw new Error("Erreur d'authentification, ID utilisateur manquant.");
      }

      const tripWithUserId = {
        ...tripData,
        user_id: userId,
      };

      console.log("Données du nouveau voyage à envoyer:", tripWithUserId);

      const response = await addTrip(tripWithUserId);
      console.log("Voyage ajouté:", response);
      setTrips((prevTrips) => [...prevTrips, response]);
      onClose();
      setNewTripData({ title: '', description: '', dateStart: '', dateEnd: '', photo: '', note: 0 });
      setError(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout du voyage:", err);
      setError("Erreur lors de l'ajout du voyage: " + err.message);
    }
  };

  return (
    <ChakraProvider>
      <h1>Mes voyages</h1>
      <div className='roadbook'>
        <div className='add-trip-button-layout'>
          <AddTripButton onClick={onOpen} />
          {error && <div className="error-message">{error}</div>}
          <AddTripModal
            isOpen={isOpen}
            onClose={onClose}
            onAddTrip={handleAddTrip}
          />
        </div>
        <div className='tripsRoadbook'>
          {loading ? (
            <p>Chargement des voyages...</p>
          ) : (
            trips.map(trip => (
              <Trip
                key={trip.id}
                id={trip.id}
                photo={trip.photo}
                title={trip.title}
                dateStart={trip.dateStart}
                dateEnd={trip.dateEnd}
                description={trip.description}
                note={trip.note}
              />
            ))
          )}
        </div>
      </div>
    </ChakraProvider>
  );
}
