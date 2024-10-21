import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from './Trip'; // Assurez-vous que le chemin est correct
import { AddTripButton } from '../buttons/AddTripButton'; // Assurez-vous que le chemin est correct
import { ChakraProvider, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { AddTripModal } from '../modals/addTripModal'; // Assurez-vous que le chemin est correct
import { fetchTrips, addTrip } from '../../../../src/api/tripApi'; // Assurez-vous que le chemin est correct
import { AuthContext } from '../auth/authContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { AddVisitModal } from '../modals/addVisitModal';

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null); // Ajout d'un état pour le tripId
  const { isOpen: isAddTripModalOpen, onOpen: onOpenAddTripModal, onClose: onCloseAddTripModal } = useDisclosure();
  const { isOpen: isAddVisitModalOpen, onOpen: onOpenAddVisitModal, onClose: onCloseAddVisitModal } = useDisclosure();
  const navigate = useNavigate();
  const tripsFetched = useRef(false);
  const { isAuthenticated } = useContext(AuthContext);

  const [newTripData, setNewTripData] = useState({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    photo: '',
    rating: 0,
  });

  useEffect(() => {
    const loadTrips = async () => {
      if (tripsFetched.current) return; // Évite un fetch multiple
      tripsFetched.current = true;

      try {
        if (!isAuthenticated) {
          console.log("Utilisateur non authentifié, redirection vers la page de connexion.");
          navigate('/login'); 
          return;
        }

        console.log("Chargement des voyages...");
        const tripsData = await fetchTrips(); 
        console.log("Voyages chargés:", tripsData);
        
        const formattedTripsData = tripsData.map(trip => ({
          ...trip,
          rating: Number(trip.rating) || 0,
        }));

        setTrips(formattedTripsData);
      } catch (err) {
        console.error("Erreur lors du chargement des voyages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [isAuthenticated, navigate]);

  const handleAddTrip = async (tripData) => {
    if (isAdding) return;
    setIsAdding(true);
  
    try {
      const existingTrip = trips.find(trip =>
        trip.title === tripData.title &&
        trip.dateStart === tripData.dateStart &&
        trip.dateEnd === tripData.dateEnd
      );
  
      if (existingTrip) {
        throw new Error("Un voyage avec le même titre et les mêmes dates existe déjà.");
      }
  
      const token = Cookies.get('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id || decodedToken.user_id;
  
      const tripWithUserId = {
        ...tripData,
        user_id: userId,
        rating: Number(tripData.rating) || 0,
      };
  
      const response = await addTrip(tripWithUserId);
      console.log("Voyage ajouté:", response);
  
      // Ajoute le nouveau voyage à l'état local
      setTrips((prevTrips) => [
        ...prevTrips,
        { ...response, rating: Number(response.rating) },
      ]);
  
      onCloseAddTripModal();
      setNewTripData({
        title: '',
        description: '',
        dateStart: '',
        dateEnd: '',
        photo: '',
        rating: 0,
      });
      setError(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout du voyage:", err);
      setError("Erreur lors de l'ajout du voyage: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };
  

  const handleTripDeleted = (id) => {
    setTrips((prevTrips) => prevTrips.filter(trip => trip.id !== id));
  };

  const handleTripUpdated = (updatedTripData) => {
    setTrips((prevTrips) =>
      prevTrips.map(trip => (trip.id === updatedTripData.id ? { ...updatedTripData, rating: Number(updatedTripData.rating) } : trip))
    );
  };

  const handleAddVisit = (tripId) => {
    setCurrentTripId(tripId); // Définit l'ID du voyage courant
    onOpenAddVisitModal(); // Ouvre la modale d'ajout de visite
  };

  return (
    <ChakraProvider>
      <h1>Mes voyages</h1>
      <div className='roadbook'>
        <div className='add-trip-button-layout'>
          <AddTripButton onClick={onOpenAddTripModal} />
          {error && <div className="error-message">{error}</div>}
          <AddTripModal
            isOpen={isAddTripModalOpen}
            onClose={onCloseAddTripModal}
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
                rating={trip.rating}
                onTripDeleted={handleTripDeleted}
                onTripUpdated={handleTripUpdated}
                onAddVisit={() => handleAddVisit(trip.id)} // Ajout de la fonction pour ouvrir la modale d'ajout de visite
              />
            ))
          )}
        </SimpleGrid>

        {/* Modale pour ajouter une visite */}
        <AddVisitModal 
          tripId={currentTripId} 
          isOpen={isAddVisitModalOpen}
          onClose={onCloseAddVisitModal} 
        />
      </div>
    </ChakraProvider>
  );
}
