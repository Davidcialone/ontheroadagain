import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { fetchTrips } from '../../../api/tripApi';
import { Button, Typography, CircularProgress, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from '../visits/visit';    
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export function TripVisits() {
    const { tripId, setCurrentTripId } = useParams(); // Assurez-vous que le nom de la variable est correct
    const numericTripId = Number(tripId);
    const [trips, setTrips] = useState([]);
    const [visits, setVisits] = useState([]);
    const [tripTitle, setTripTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const visitsFetched = useRef(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    
    // State pour gérer les modaux
    const [openAddModal, setOpenAddModal] = useState(false); 
    const [openUpdateModal, setOpenUpdateModal] = useState(false); 
    const [openDeleteModal, setOpenDeleteModal] = useState(false); 
    const [updatedVisit, setUpdatedVisit] = useState(null);
    const [visitToDelete, setVisitToDelete] = useState(null);

    // useEffect pour récupérer les voyages
    useEffect(() => {
        const loadTrips = async () => {
            try {
                const tripsData = await fetchTrips(); // Récupérer les voyages
                setTrips(tripsData); 
            } catch (err) {
                setError(`Erreur lors du chargement des voyages: ${err.message}`);
                setSnackbarOpen(true); 
            }
        };

        loadTrips();
    }, []);

    useEffect(() => {
        const loadVisits = async () => {
            if (visitsFetched.current) return;
            visitsFetched.current = true;

            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                console.log(`Fetching visits for tripId: ${numericTripId}`); // Journal de débogage
                const visitsData = await getVisitsForTrip(numericTripId);
                console.log('Visits data:', visitsData); // Journal de débogage

                setVisits(Array.isArray(visitsData) ? visitsData : []);
                const trip = trips.find((trip) => trip.id === numericTripId);
                setTripTitle(trip ? trip.title : 'Nom du voyage inconnu');

            } catch (err) {
                setError(`Erreur lors du chargement des visites: ${err.message}`);
                setSnackbarOpen(true); 
            } finally {
                setLoading(false);
            }
        };

        loadVisits();
    }, [numericTripId, isAuthenticated, navigate, trips]);

    const handleAddVisit = async (visitData) => {
        setIsAdding(true);

        if (!numericTripId) {
            setError('tripId est manquant.');
            setIsAdding(false);
            return;
        }

        try {
            const visitWithTripId = {
                ...visitData,
                tripId: numericTripId,
                rating: Number(visitData.rating) || 0,
            };
            console.log('Adding visit:', visitWithTripId); // Journal de débogage

            const response = await addVisit(visitWithTripId);
            setVisits((prevVisits) =>
                Array.isArray(prevVisits) ? [...prevVisits, { ...response, rating: Number(response.rating) || 0 }] 
                : [{ ...response, rating: Number(response.rating) || 0 }]
            );
            setOpenAddModal(false);
        } catch (err) {
            setError(`Erreur lors de l'ajout de la visite: ${err.message}`);
            setSnackbarOpen(true); 
        } finally {
            setIsAdding(false);
        }
    };

    const handleVisitUpdated = (updatedVisit) => {
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
    };

    const handleVisitDeleted = async () => {
        if (!visitToDelete) return;
        try {
            // Remplacez cette partie par l'appel réel à l'API pour supprimer la visite
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

    console.log('openAddModal:', openAddModal); // Vérifiez la valeur de openAddModal

    return (
        <div>
            <Typography variant="h5" gutterBottom>Visites du voyage <strong>{tripTitle}</strong></Typography>
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
                    {/* Modals pour ajouter, mettre à jour et supprimer des visites */}
                    <AddVisitModal 
                        open={openAddModal} 
                        onClose={() => setOpenAddModal(false)} 
                        onAddVisit={handleAddVisit} 
                    />
                    <UpdateVisitModal 
                        isOpen={openUpdateModal} 
                        onClose={() => setOpenUpdateModal(false)} 
                        visit={updatedVisit} 
                        onUpdateVisit={handleVisitUpdated} 
                    />
                    <DeleteVisitModal 
                        open={openDeleteModal} 
                        onClose={() => setOpenDeleteModal(false)} 
                        visit={visitToDelete} 
                        onDelete={handleVisitDeleted} 
                    />
                </div>
    
                <Grid container sx={{ display: 'flex', width: '100%' }} spacing={3}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        Array.isArray(visits) && visits.length > 0 ? (
                            visits.map((visit) => (
                                <Grid item xs={12} sm={12} md={12} key={visit.id}>
                                    <Visit
                                        visitId={visit.id} 
                                        title={visit.title}
                                        photo={visit.photo}
                                        dateStart={visit.dateStart}
                                        dateEnd={visit.dateEnd}
                                        comment={visit.comment}
                                        rating={typeof visit.rating === 'number' && visit.rating >= 0 && visit.rating <= 5 ? visit.rating : 0} 
                                        geo={visit.geo}
                                        onEditVisit={() => {
                                            setUpdatedVisit(visit);
                                            setOpenUpdateModal(true);
                                        }}
                                        onDeleteVisit={() => {
                                            setVisitToDelete(visit);
                                            setOpenDeleteModal(true);
                                        }}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1">Aucune visite trouvée pour ce voyage.</Typography>
                        )
                    )}
                </Grid>
            </div>
    
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}
