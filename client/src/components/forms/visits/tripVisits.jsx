import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi';
import { Trip } from '../trips/trip'; // Assurez-vous que Trip est bien une source de données (array ou API)
import { Button, Typography, CircularProgress, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from './visit';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function TripVisits() {
    const { tripId } = useParams();
    const numericTripId = Number(tripId); // Convertir en nombre
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [tripTitle, setTripTitle] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const visitsFetched = useRef(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [updatedVisit, setUpdatedVisit] = useState(null); // Pour la visite à mettre à jour
    const [visitToDelete, setVisitToDelete] = useState(null); // Pour la visite à supprimer
    const [openAddModal, setOpenAddModal] = useState(false); 
    const [openUpdateModal, setOpenUpdateModal] = useState(false); 
    const [openDeleteModal, setOpenDeleteModal] = useState(false); 

    useEffect(() => {
        const loadVisits = async () => {
            if (visitsFetched.current) return;
            visitsFetched.current = true;

            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                // Charger les visites pour le voyage
                const visitsData = await getVisitsForTrip(numericTripId);
                setVisits(Array.isArray(visitsData) ? visitsData : []);

                // Trouver le titre du voyage (supposant que Trip est un tableau d'objets)
                const tripData = Trip.find(trip => trip.id === numericTripId);
                setTripTitle(tripData?.title || 'Nom du voyage inconnu');

            } catch (err) {
                setError(`Erreur lors du chargement des visites: ${err.message}`);
                setSnackbarOpen(true); // Ouvrir le snackbar en cas d'erreur
            } finally {
                setLoading(false);
            }
        };

        loadVisits();
    }, [numericTripId, isAuthenticated, navigate]);

    const handleAddVisit = async (visitData) => {
        setIsAdding(true);

        if (!numericTripId) {
            setError('tripId est manquant.');
            setIsAdding(false);
            return;
        }

        if (typeof visitData !== 'object' || visitData === null) {
            setError('Données de visite invalides.');
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
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? [
                    ...prevVisits,
                    { ...response, rating: Number(response.rating) || 0 },
                ] : [{ ...response, rating: Number(response.rating) || 0 }]
            );
            setOpenAddModal(false);
        } catch (err) {
            setError(`Erreur lors de l'ajout de la visite: ${err.message}`);
            setSnackbarOpen(true); // Ouvrir le snackbar en cas d'erreur
        } finally {
            setIsAdding(false);
        }
    };

    const handleVisitUpdated = (updatedVisit) => {
        if (typeof updatedVisit === 'object' && updatedVisit !== null) {
            setVisits((prevVisits) =>
                Array.isArray(prevVisits)
                    ? prevVisits.map((visit) =>
                        visit.id === updatedVisit.id
                            ? { ...updatedVisit, rating: Number(updatedVisit.rating) || 0 }
                            : visit
                    )
                    : []
            );
            setOpenUpdateModal(false);
        } else {
            console.error('Erreur: updatedVisit n\'est pas un objet valide.', updatedVisit);
        }
    };

    const handleVisitDeleted = async () => {
        if (!visitToDelete) return;
        try {
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? prevVisits.filter((visit) => visit.id !== visitToDelete.id) : []
            );
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Erreur lors de la suppression de la visite:', err);
            setError(`Erreur lors de la suppression de la visite: ${err.message}`);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Visites du voyage {tripTitle}</Typography>
            <div className='tripVisits'>
                <div className='add-visit-button-layout'>
                    <Button 
                        variant="contained" 
                        sx={{ 
                            color: '#333',
                            backgroundColor: '#87CEEB',
                            margin: '1rem',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                color: 'black',
                                backgroundColor: '#bdbdbd',
                                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                            },
                        }}
                        onClick={() => setOpenAddModal(true)} 
                        disabled={isAdding}
                    >
                        Ajouter une visite
                    </Button>
                    {error && <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>}

                    <AddVisitModal
                        open={openAddModal}
                        onClose={() => setOpenAddModal(false)}
                        onAddVisit={handleAddVisit}
                        tripId={numericTripId}
                    />

                    {updatedVisit && (
                        <UpdateVisitModal
                            open={openUpdateModal}
                            onClose={() => setOpenUpdateModal(false)}
                            onUpdateVisit={handleVisitUpdated}
                            visit={updatedVisit}
                        />
                    )}

                    {visitToDelete && (
                        <DeleteVisitModal
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onDeleteVisit={handleVisitDeleted}
                            visit={visitToDelete}
                        />
                    )}
                </div>

                <Grid container spacing={3}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        Array.isArray(visits) && visits.length > 0 ? (
                            visits.map((visit) => (
                                <Grid item xs={12} sm={6} md={4} key={visit.id}>
                                    <Visit
                                        title={visit.title}
                                        photos={visit.photo ? [visit.photo] : []}
                                        startDate={visit.dateStart}
                                        endDate={visit.dateEnd}
                                        rating={Number(visit.rating) || 0}
                                        comment={visit.comment || ''}
                                        onUpdate={() => {
                                            setUpdatedVisit(visit);
                                            setOpenUpdateModal(true);
                                        }}
                                        onDelete={() => {
                                            setVisitToDelete(visit);
                                            setOpenDeleteModal(true);
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

            {/* Snackbar pour afficher les messages d'erreur */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}
