import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi';
import { Button, Grid, Typography, Snackbar } from '@mui/material';
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from './visit';
import { Alert } from '@mui/material';

export function TripVisits() {
    const { tripId } = useParams();
    const numericTripId = Number(tripId);
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const visitsFetched = useRef(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [updatedVisit, setUpdatedVisit] = useState(null);
    const [visitToDelete, setVisitToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
                setVisits(Array.isArray(visitsData) ? visitsData : []);
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
            ] : [{ ...response, rating: Number(response.rating) || 0 }]);

            onAddClose();
        } catch (err) {
            setError("Erreur lors de l'ajout de la visite: " + err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleVisitUpdated = (updatedVisit) => {
        if (typeof updatedVisit === 'object' && updatedVisit !== null) {
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? prevVisits.map((visit) =>
                    visit.id === updatedVisit.id ? { ...updatedVisit, rating: Number(updatedVisit.rating) || 0 } : visit
                ) : []
            );
            onUpdateClose();
        } else {
            console.error("Erreur: updatedVisit n'est pas un objet valide.", updatedVisit);
        }
    };

    const handleVisitDeleted = async () => {
        if (!visitToDelete) return;
        try {
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? prevVisits.filter((visit) => visit.id !== visitToDelete.id) : []
            );
            onDeleteClose();
        } catch (err) {
            console.error("Erreur lors de la suppression de la visite:", err);
            setError("Erreur lors de la suppression de la visite: " + err.message);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Visites du voyage
            </Typography>
            <div className='tripVisits'>
                <div className='add-visit-button-layout'>
                    <Button variant="contained" onClick={onAddOpen} disabled={isAdding}>
                        Ajouter une visite
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}

                    <AddVisitModal
                        isOpen={isAddOpen}
                        onClose={onAddClose}
                        onAddVisit={handleAddVisit}
                        tripId={numericTripId}
                    />

                    {updatedVisit && (
                        <UpdateVisitModal
                            isOpen={isUpdateOpen}
                            onClose={onUpdateClose}
                            onUpdateVisit={handleVisitUpdated}
                            visit={updatedVisit}
                        />
                    )}

                    {visitToDelete && (
                        <DeleteVisitModal
                            isOpen={isDeleteOpen}
                            onClose={onDeleteClose}
                            onDeleteVisit={handleVisitDeleted}
                            visit={visitToDelete}
                        />
                    )}
                </div>

                <Typography variant="h6">Affichage des visites</Typography>
                <Grid container spacing={2}>
                    {loading ? (
                        <Typography variant="body1">Chargement des visites...</Typography>
                    ) : (
                        Array.isArray(visits) && visits.length > 0 ? (
                            visits.map(visit => (
                                <Grid item xs={12} sm={6} md={4} key={visit.id}>
                                    <Visit
                                        title={visit.title}
                                        photos={visit.photo ? [visit.photo] : []}
                                        startDate={visit.dateStart}
                                        endDate={visit.dateEnd}
                                        rating={Number(visit.rating) || 0}
                                        comment={visit.comment || ""}
                                        onUpdate={() => {
                                            setUpdatedVisit(visit);
                                            onUpdateOpen();
                                        }}
                                        onDelete={() => {
                                            setVisitToDelete(visit);
                                            onDeleteOpen();
                                        }}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1">Aucune visite trouvée.</Typography>
                        )
                    )}
                </Grid>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Action effectuée avec succès !
                </Alert>
            </Snackbar>
        </div>
    );
}
