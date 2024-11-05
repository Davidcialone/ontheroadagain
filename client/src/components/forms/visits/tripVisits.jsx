import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { fetchTrips } from '../../../api/tripApi';
import { Button, Typography, CircularProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from '../visits/visit';    

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export function TripVisits() {
    const { tripId } = useParams(); // Récupérer tripId
    const numericTripId = Number(tripId);
    const [trips, setTrips] = useState([]);
    const [trip, setTrip] = useState({}); // Initialize trip state
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

    // Chargez les voyages à l'initialisation
    useEffect(() => {
        const loadTrips = async () => {
            try {
                const tripsData = await fetchTrips(); // Assurez-vous que cette fonction est définie
                setTrips(tripsData);
                console.log("Trips Data:", tripsData); // Vérifiez ici les données des voyages
            } catch (err) {
                setError(`Erreur lors du chargement des voyages: ${err.message}`);
                setSnackbarOpen(true);
            }
        };

        loadTrips();
    }, []);

    // Chargez les visites pour le voyage correspondant
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
                
                // Chargez le voyage correspondant
                const trip = trips.find((trip) => trip.id === numericTripId);
                setTrip(trip || {});
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
        setVisits((prevVisits) => [...prevVisits, visitData]);
        setSnackbarOpen(true);
        setOpenAddModal(false);
    };   

    const handleVisitUpdated = (updatedVisitData) => {
        setVisits((prevVisits) =>
            Array.isArray(prevVisits)
                ? prevVisits.map((visit) =>
                    visit.id === updatedVisitData.id
                        ? { ...updatedVisitData, rating: Number(updatedVisitData.rating) || 0 }
                        : visit
                )
                : []
        );
        setOpenUpdateModal(false);
    };

    const handleVisitDeleted = (id) => {
        setVisits((prevVisits) => {
            if (Array.isArray(prevVisits)) {
                return prevVisits.filter((visit) => visit.id !== id);
            } else {
                return [];
            }
        });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Vous pouvez maintenant utiliser `trips` ici ou dans le rendu
    console.log("Liste des voyages:", trips);
    const currentTrip = trips.find((trip) => trip.id === numericTripId);

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Visites du voyage <strong>{currentTrip ? currentTrip.title : 'Nom du voyage inconnu'}</strong>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Dates : {currentTrip?.dateStart ? new Date(currentTrip.dateStart).toLocaleDateString() : 'Inconnue'} - {currentTrip?.dateEnd ? new Date(currentTrip.dateEnd).toLocaleDateString() : 'Inconnue'}
            </Typography>
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
                        isOpen={openAddModal} 
                        onClose={() => setOpenAddModal(false)} 
                        onAddVisit={handleAddVisit} 
                        tripDateStart={currentTrip?.dateStart ? new Date(currentTrip.dateStart) : null} 
                        tripDateEnd={currentTrip?.dateEnd ? new Date(currentTrip.dateEnd) : null} 
                    />
                    <UpdateVisitModal 
                        isOpen={openUpdateModal} 
                        onClose={() => setOpenUpdateModal(false)} 
                        visit={updatedVisit} 
                        onUpdateVisit={handleVisitUpdated} 
                    />
                    <DeleteVisitModal 
                        isOpen={openDeleteModal} 
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
                                        id={visit.id}
                                        visitId={visit.id} 
                                        tripId={numericTripId}
                                        title={visit.title}
                                        photo={visit.photo}
                                        dateStart={visit.dateStart}
                                        dateEnd={visit.dateEnd}
                                        comment={visit.comment}
                                        rating={typeof visit.rating === 'number' && visit.rating >= 0 && visit.rating <= 5 ? visit.rating : 0} 
                                        geo={visit.geo}
                                        onVisitUpdated={handleVisitUpdated}
                                        onVisitDeleted={handleVisitDeleted}
                                        onDeleteClick={() => handleVisitDeleted(visit.id)} // Passer les IDs lors du clic
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
