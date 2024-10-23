import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal'; 
import { DeleteVisitModal } from '../modals/deleteVisitModal'; 
import { Visit } from './visit';
import { SimpleGrid } from "@chakra-ui/react";
import { AddVisitButton } from '../buttons/addVisitButton';
import { UpdateVisitButton } from '../buttons/updateVisitButton';
import { DeleteVisitButton } from '../buttons/deleteVisitButton';

export function TripVisits() {
    const { tripId } = useParams();
    const numericTripId = Number(tripId); // Convertir en nombre
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); 
    const visitsFetched = useRef(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [updatedVisit, setUpdatedVisit] = useState(null); // État pour la visite à mettre à jour
    const [visitToDelete, setVisitToDelete] = useState(null); // État pour la visite à supprimer

    useEffect(() => {
        const loadVisits = async () => {
            if (visitsFetched.current) return;
            visitsFetched.current = true;

            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                const visitsData = await getVisitsForTrip(numericTripId);
                setVisits(Array.isArray(visitsData) ? visitsData : []); // Assure que visitsData est un tableau
            } catch (err) {
                setError("Erreur lors du chargement des visites: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadVisits();
    }, [numericTripId, isAuthenticated, navigate]);

    const handleAddVisit = async (visitData) => {
        setIsAdding(true);
    
        if (!numericTripId) {
            setError("tripId est manquant.");
            setIsAdding(false);
            return;
        }

        // Vérifie que visitData est un objet valide
        if (typeof visitData !== 'object' || visitData === null) {
            setError("Données de visite invalides.");
            setIsAdding(false);
            return;
        }

        try {
            const visitWithTripId = {
                ...visitData,
                tripId: numericTripId,
                rating: Number(visitData.rating) || 0,
            };
    
            const response = await addVisit(visitWithTripId);
    
            setVisits((prevVisits) => Array.isArray(prevVisits) ? [
                ...prevVisits,
                { ...response, rating: Number(response.rating) || 0 }
            ] : [{ ...response, rating: Number(response.rating) || 0 }]); // Assure que prevVisits est un tableau
    
            onAddClose();
        } catch (err) {
            setError("Erreur lors de l'ajout de la visite: " + err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleVisitUpdated = (updatedVisit) => {
        // Vérifie que updatedVisit est un objet valide
        if (typeof updatedVisit === 'object' && updatedVisit !== null) {
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? prevVisits.map((visit) => 
                    visit.id === updatedVisit.id ? { ...updatedVisit, rating: Number(updatedVisit.rating) || 0 } : visit
                ) : []
            );
            onUpdateClose(); // Fermer la modale de mise à jour après l'édition
        } else {
            console.error("Erreur: updatedVisit n'est pas un objet valide.", updatedVisit);
        }
    };

    const handleVisitDeleted = async () => {
        if (!visitToDelete) return; // Assurez-vous qu'il y a une visite à supprimer
        console.log("Tentative de suppression de la visite avec l'ID:", visitToDelete.id);
        try {
            // Ici, vous pourriez également appeler une API pour supprimer la visite du serveur
            setVisits((prevVisits) => 
                Array.isArray(prevVisits) ? prevVisits.filter((visit) => visit.id !== visitToDelete.id) : []
            );
            console.log("Visite supprimée avec succès:", visitToDelete.id);
            onDeleteClose(); // Fermez la modale après la suppression
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
                    <AddVisitButton onClick={onAddOpen} disabled={isAdding} />
                    {error && <div className="error-message">{error}</div>}

                    <AddVisitModal 
                        isOpen={isAddOpen} 
                        onClose={onAddClose}
                        onAddVisit={handleAddVisit} 
                        tripId={numericTripId} 
                    />

                    {/* Afficher le bouton de mise à jour uniquement si une visite est sélectionnée */}
                    {updatedVisit && (
                        <UpdateVisitModal
                            isOpen={isUpdateOpen}
                            onClose={onUpdateClose}
                            onUpdateVisit={handleVisitUpdated}
                            visit={updatedVisit}
                        />
                    )}

                    {/* Gérer la suppression de la visite */}
                    {visitToDelete && (
                        <DeleteVisitModal
                            isOpen={isDeleteOpen}
                            onClose={onDeleteClose}
                            onDeleteVisit={handleVisitDeleted}
                            visit={visitToDelete}
                        />
                    )}
                </div>

                Affichage des visites
                <SimpleGrid columns={[1, 1, 1, 2, 3]} spacing={5} className='tripsRoadbook'>
                    {loading ? (
                        <p>Chargement des visites...</p>
                    ) : (
                        Array.isArray(visits) && visits.length > 0 ? (
                            visits.map(visit => {
                                // Log each visit to debug
                                console.log('Visit:', visit);
                                return (
                                    <Visit
                                        key={visit.id}
                                        title={visit.title}
                                        photos={visit.photo ? [visit.photo] : []} 
                                        startDate={visit.dateStart}
                                        endDate={visit.dateEnd}
                                        rating={Number(visit.rating) || 0}
                                        comment={visit.comment || ""}
                                        onUpdate={() => {
                                            setUpdatedVisit(visit); // Met à jour la visite sélectionnée
                                            onUpdateOpen(); // Ouvre la modale de mise à jour
                                        }}
                                        onDelete={() => {
                                            setVisitToDelete(visit); // Définit la visite à supprimer
                                            onDeleteOpen(); // Ouvre la modale de suppression
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <p>Aucune visite trouvée.</p>
                        )
                    )}
                </SimpleGrid>
            </div>
        </ChakraProvider>
    );
}
