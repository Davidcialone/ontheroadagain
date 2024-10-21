import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from '../modals/addVisitModal';
import { Visit } from './Visit';
import { SimpleGrid } from "@chakra-ui/react";
import { AddVisitButton } from '../buttons/addVisitButton';

export function TripVisits() {
    const { tripId } = useParams(); // tripId est récupéré en tant que chaîne
    const numericTripId = Number(tripId); // Convertir en nombre
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); 
    const visitsFetched = useRef(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const loadVisits = async () => {
            if (visitsFetched.current) return;
            visitsFetched.current = true;

            try {
                if (!isAuthenticated) {
                    console.log("Utilisateur non authentifié, redirection vers la page de connexion.");
                    navigate('/login');
                    return;
                }

                console.log("Chargement des visites pour le voyage avec l'ID:", numericTripId);
                const visitsData = await getVisitsForTrip(numericTripId);
                console.log("Visites chargées:", visitsData);
                setVisits(visitsData);
            } catch (err) {
                console.error("Erreur lors du chargement des visites:", err);
                setError("Erreur lors du chargement des visites: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadVisits();
    }, [numericTripId, isAuthenticated, navigate]);

    const handleAddVisit = async (visitData) => {
        setIsAdding(true);
        console.log("handleAddVisit appelé avec visitData:", visitData);
    
        if (!numericTripId) {
            console.error("tripId est manquant.");
            setError("tripId est manquant.");
            setIsAdding(false);
            return;
        }

        console.log("Utilisation du tripId:", numericTripId);
    
        try {
            const visitWithTripId = {
                ...visitData,
                tripId: numericTripId,
                rating: Number(visitData.rating) || 0, // Assurez-vous que rating est un nombre
            };
    
            console.log("Objet de visite à ajouter:", visitWithTripId);
    
            const response = await addVisit(visitWithTripId);
            console.log("Visite ajoutée:", response);
    
            // Mettez à jour les visites avec la nouvelle visite
            setVisits((prevVisits) => [
                ...prevVisits,
                { ...response, rating: Number(response.rating) || 0 } // Assurez-vous que rating est un nombre
            ]);
    
            onClose();
        } catch (err) {
            console.error("Erreur lors de l'ajout de la visite:", err);
            setError("Erreur lors de l'ajout de la visite: " + err.message);
        } finally {
            setIsAdding(false);
            console.log("Processus d'ajout terminé, isAdding défini sur false.");
        }
    };

    const handleVisitUpdated = (updatedVisit) => {
        console.log("Visite mise à jour:", updatedVisit);
        setVisits((prevVisits) =>
            prevVisits.map((visit) => 
                visit.id === updatedVisit.id ? { ...updatedVisit, rating: Number(updatedVisit.rating) || 0 } : visit // Assurez-vous que rating est un nombre
            )
        );
    };

    const handleVisitDeleted = async (visitId) => {
        console.log("Tentative de suppression de la visite avec l'ID:", visitId);
        try {
            // Ici, vous pourriez également appeler une API pour supprimer la visite du serveur
            setVisits((prevVisits) => prevVisits.filter((visit) => visit.id !== visitId));
            console.log("Visite supprimée avec succès:", visitId);
        } catch (err) {
            console.error("Erreur lors de la suppression de la visite:", err);
            setError("Erreur lors de la suppression de la visite: " + err.message);
        }
    };

    return (
        <ChakraProvider>
            <h1>Visites du voyage</h1>
            <div className='tripVisits'>
                <div className='add-visit-button-layout'>
                    <AddVisitButton onClick={onOpen} disabled={isAdding} />
                    {error && <div className="error-message">{error}</div>}
                    <AddVisitModal 
                        isOpen={isOpen} 
                        onClose={onClose}
                        onAddVisit={handleAddVisit} 
                        tripId={numericTripId} // Passer le tripId sous forme de nombre
                    />
                </div>
                <SimpleGrid columns={[1, 1, 1, 2, 3]} spacing={5} className='tripsRoadbook'>
                    {loading ? (
                        <p>Chargement des visites...</p>
                    ) : (
                        visits.map(visit => (
                            <Visit
                                key={visit.id} // Assurez-vous que l'ID est unique
                                title={visit.title}
                                photos={visit.photo ? [visit.photo] : []} 
                                startDate={visit.dateStart}
                                endDate={visit.dateEnd}
                                rating={Number(visit.rating) || 0} // Assurez-vous que rating est un nombre
                                comment={visit.comment || ""} // Prévoir un commentaire par défaut
                                onUpdate={handleVisitUpdated}
                                onDelete={handleVisitDeleted}
                            />
                        ))
                    )}
                </SimpleGrid>
            </div>
        </ChakraProvider>
    );
}
