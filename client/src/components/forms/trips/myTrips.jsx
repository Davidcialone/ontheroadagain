// MyTrips.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips, addTrip } from '../../../../src/api/tripApi';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const tripsFetched = useRef(false);

  const [newTripData, setNewTripData] = useState({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    photo: '',
    note: 0,
  });

  useEffect(() => {
    const loadTrips = async () => {
      if (tripsFetched.current) return; 
      tripsFetched.current = true;

      try {
        const token = Cookies.get('token');
        console.log("Token récupéré depuis le cookie:", token);

        if (!token) {
          console.log("Aucun token trouvé, redirection vers la page de connexion.");
          navigate('/login'); 
          return;
        }

        const decodedToken = jwtDecode(token);
        console.log("Token décodé:", decodedToken);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          Cookies.remove('token'); 
          console.log("Token expiré, suppression du cookie et redirection vers la page de connexion.");
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

  const handleAddTrip = async (tripData) => {
    try {
      const token = Cookies.get('token');
      console.log("Token pour ajouter un voyage:", token);
      if (!token) {
        throw new Error("Token non trouvé, veuillez vous connecter.");
      }

      const decodedToken = jwtDecode(token);
      console.log("Token décodé pour ajout de voyage:", decodedToken);

      const userId = decodedToken.id || decodedToken.user_id;
      console.log("ID d'utilisateur pour ajout de voyage:", userId);

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

  const handleTripDeleted = (id) => {
    setTrips((prevTrips) => prevTrips.filter(trip => trip.id !== id)); // Met à jour l'état en excluant le voyage supprimé
  };

  const handleTripUpdated = (updatedTripData) => {
    setTrips((prevTrips) =>
      prevTrips.map(trip => (trip.id === updatedTripData.id ? updatedTripData : trip))
    );
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

        <SimpleGrid columns={[1, 1, 1, 2, 3]} spacing={5} className='tripsRoadbook'>
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
                onTripDeleted={handleTripDeleted} // Passe la fonction pour mettre à jour l'état
                onTripUpdated={handleTripUpdated} // Passe la fonction pour mettre à jour l'état
              />
            ))
          )}
        </SimpleGrid>
      </div>
    </ChakraProvider>
  );
}
