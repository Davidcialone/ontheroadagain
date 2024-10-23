import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { AuthContext } from '../auth/authContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; 
import { fetchTrips, addTrip } from '../../../../src/api/tripApi'; 
import { Trip } from './trip'; 
import { AddTripModal } from '../modals/addTripModal'; 
import { AddVisitModal } from '../modals/addVisitModal';
import { AddTripButton } from '../buttons/addTripButton'; 

export function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [currentTripId, setCurrentTripId] = useState(null);
    
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
            console.log("Début du chargement des voyages...");
            if (tripsFetched.current) {
                console.log("Voyages déjà chargés, évitant le double appel.");
                return; // Évite un fetch multiple
            }
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

                // Vérification et formatage des données
                const formattedTripsData = Array.isArray(tripsData) ? tripsData.map(trip => ({
                    ...trip,
                    rating: Number(trip.rating).toFixed(1) || 0,
                })) : [];

                setTrips(formattedTripsData);
            } catch (err) {
                console.error("Erreur lors du chargement des voyages:", err);
                setError(err.message);
            } finally {
                console.log("Chargement des voyages terminé.");
                setLoading(false);
            }
        };

        loadTrips();
    }, [isAuthenticated, navigate]);

    const handleAddTrip = async (tripData) => {
        console.log("handleAddTrip appelé avec tripData:", tripData);
        if (isAdding) {
            console.log("Ajout en cours, évitant un appel supplémentaire.");
            return;
        }
        setIsAdding(true);

        try {
            if (typeof tripData !== 'object' || tripData === null) {
                throw new Error("tripData doit être un objet valide.");
            }

            // Vérification des doublons
            const existingTrip = Array.isArray(trips) ? trips.find(trip =>
                trip.title === tripData.title &&
                trip.dateStart === tripData.dateStart &&
                trip.dateEnd === tripData.dateEnd
            ) : null;

            if (existingTrip) {
                console.log("Voyage existant trouvé:", existingTrip);
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

            console.log("Appel API pour ajouter un voyage avec les données:", tripWithUserId);
            const response = await addTrip(tripWithUserId);
            console.log("Voyage ajouté:", response);

            // Mise à jour des voyages localement
            setTrips((prevTrips) => Array.isArray(prevTrips) ? [
                ...prevTrips,
                { ...response, rating: Number(response.rating) },
            ] : [response]);

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
            console.log("Ajout terminé.");
            setIsAdding(false);
        }
    };

    const handleTripDeleted = (id) => {
        console.log("Suppression du voyage avec l'ID:", id);
        setTrips((prevTrips) => {
            if (Array.isArray(prevTrips)) {
                return prevTrips.filter(trip => trip.id !== id);
            } else {
                console.error("Erreur: prevTrips n'est pas un tableau.", prevTrips);
                return [];
            }
        });
    };

    const handleTripUpdated = (updatedTripData) => {
        console.log("Mise à jour du voyage:", updatedTripData);
        if (typeof updatedTripData === 'object' && updatedTripData !== null) {
            setTrips((prevTrips) =>
                Array.isArray(prevTrips) ? prevTrips.map(trip => (trip.id === updatedTripData.id ? { ...updatedTripData, rating: Number(updatedTripData.rating) } : trip)) : []
            );
        } else {
            console.error("Erreur: updatedTripData n'est pas un objet valide.", updatedTripData);
        }
    };

    const handleAddVisit = (tripId) => {
        setCurrentTripId(tripId);
        onOpenAddVisitModal();
    };

    return (
        <ChakraProvider>
            <h1>Mes voyages</h1>
            <div className='roadbook'>
                <div className='add-trip-button-layout'>
                    <AddTripButton onClick={onOpenAddTripModal} disabled={isAdding} />
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
                        Array.isArray(trips) && trips.length > 0 ? (
                            trips.map(trip => (
                                <Trip
                                    key={trip.id}
                                    id={trip.id}
                                    photo={trip.photo}
                                    title={trip.title}
                                    dateStart={trip.dateStart}
                                    dateEnd={trip.dateEnd}
                                    description={trip.description}
                                    rating={Number(trip.rating)}
                                    onTripDeleted={handleTripDeleted}
                                    onTripUpdated={handleTripUpdated}
                                    onAddVisit={() => handleAddVisit(trip.id)}
                                />
                            ))
                        ) : (
                            <p>Aucun voyage trouvé.</p>
                        )
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
