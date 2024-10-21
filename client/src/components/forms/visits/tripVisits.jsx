import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { getVisitsForTrip } from '../../../api/visitApi'; // Utilisez la nouvelle fonction    
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from '../modals/addVisitModal';
import { Visit } from './Visit';
import { SimpleGrid } from "@chakra-ui/react";
import { AddVisitButton } from '../buttons/addVisitButton';

export function TripVisits() {
    const { tripId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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
    
                // Vérifie si le tripId est correct
                console.log("Chargement des visites pour le voyage avec l'ID:", tripId);
                const visitsData = await getVisitsForTrip(tripId);
                console.log("Visits loaded:", visitsData);
                setVisits(visitsData);
            } catch (err) {
                console.error("Error loading visits:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        loadVisits();
    }, [tripId, isAuthenticated, navigate]);
    
    

    const handleAddVisit = async (visitData) => {
        // Logique pour ajouter une visite
    };

    const handleVisitUpdated = (updatedVisit) => {
        // Logique pour mettre à jour une visite
    };

    const handleVisitDeleted = (visitId) => {
        // Logique pour supprimer une visite
    };

    return (
        <ChakraProvider>
            <h1>Visites du voyage</h1>
            <div className='tripVisits'>
                <div className='add-visit-button-layout'>
                    <AddVisitButton onClick={onOpen} />
                    {error && <div className="error-message">{error}</div>}
                    <AddVisitModal 
                        isOpen={isOpen} 
                        onClose={onClose}
                        onAddVisit={handleAddVisit} 
                    />
                </div>
                <SimpleGrid columns={[1, 1, 1, 2, 3]} spacing={5} className='tripsRoadbook'>
                    {loading ? (
                        <p>Chargement des visites...</p>
                    ) : (
                        visits.map(visit => (
                            <Visit
                                key={visit.id}
                                title={visit.title}
                                photos={visit.photo ? [visit.photo] : []} // Utilisez les photos comme tableau
                                startDate={visit.dateStart}
                                endDate={visit.dateEnd}
                                note={visit.note}
                                comment={visit.comment}
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
