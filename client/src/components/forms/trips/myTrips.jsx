import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from './trip';
import { AddTripButton } from '../buttons/addTripButton';
import { ChakraProvider, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal';
import { fetchTrips, addTrip } from '../../../../src/api/tripApi';
import { jwtDecode } from 'jwt-decode'; // Notez l'import correct
import Cookies from 'js-cookie'; // Utiliser js-cookie pour gérer les cookies

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
      if (tripsFetched.current) return; // Éviter de charger plusieurs fois
      tripsFetched.current = true;

      try {
        const token = Cookies.get('token'); // Récupérer le token depuis le cookie
        console.log("Token récupéré depuis le cookie:", token); // Log du token

        if (!token) {
          console.log("Aucun token trouvé, redirection vers la page de connexion.");
          navigate('/login'); // Rediriger vers la page de connexion si aucun token n'est trouvé
          return;
        }

        const decodedToken = jwtDecode(token);
        console.log("Token décodé:", decodedToken); // Log du token décodé

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          Cookies.remove('token'); // Supprimer le token expiré
          console.log("Token expiré, suppression du cookie et redirection vers la page de connexion.");
          navigate('/login'); // Rediriger vers la page de connexion si le token a expiré
          return;
        }

        const tripsData = await fetchTrips(); // Appel à l'API pour récupérer les voyages
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
      const token = Cookies.get('token'); // Récupérer le token du cookie
      console.log("Token pour ajouter un voyage:", token); // Log du token pour ajouter un voyage
      if (!token) {
        throw new Error("Token non trouvé, veuillez vous connecter.");
      }

      const decodedToken = jwtDecode(token);
      console.log("Token décodé pour ajout de voyage:", decodedToken); // Log du token décodé

      const userId = decodedToken.id || decodedToken.user_id; // Récupérer l'ID de l'utilisateur depuis le token
      console.log("ID d'utilisateur pour ajout de voyage:", userId); // Log de l'ID d'utilisateur

      if (!userId) {
        throw new Error("Erreur d'authentification, ID utilisateur manquant.");
      }

      const tripWithUserId = {
        ...tripData,
        user_id: userId, // Ajouter l'ID utilisateur dans les données du voyage
      };

      console.log("Données du nouveau voyage à envoyer:", tripWithUserId);

      const response = await addTrip(tripWithUserId);
      console.log("Voyage ajouté:", response);
      setTrips((prevTrips) => [...prevTrips, response]); // Mettre à jour l'état des voyages avec le nouveau voyage
      onClose();
      setNewTripData({ title: '', description: '', dateStart: '', dateEnd: '', photo: '', note: 0 }); // Réinitialiser les données du nouveau voyage
      setError(null); // Réinitialiser l'erreur
    } catch (err) {
      console.error("Erreur lors de l'ajout du voyage:", err);
      setError("Erreur lors de l'ajout du voyage: " + err.message); // Afficher l'erreur
    }
  };

  return (
    <ChakraProvider>
      <h1>Mes voyages</h1>
      <div className='roadbook'>
        <div className='add-trip-button-layout'>
          <AddTripButton onClick={onOpen} />
          {error && <div className="error-message">{error}</div>} {/* Afficher l'erreur si elle existe */}
          <AddTripModal
            isOpen={isOpen}
            onClose={onClose}
            onAddTrip={handleAddTrip}
          />
        </div>

        {/* Grid layout for trips */}
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
              />
            ))
          )}
        </SimpleGrid>
      </div>
    </ChakraProvider>
  );
}
