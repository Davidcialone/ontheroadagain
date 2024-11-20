import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { fetchTrips } from '../../../api/tripApi';
import { Button, Grid, Typography, CircularProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from '../visits/visit';    

// const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

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
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [tripStart, setTripStart] = useState(null);
    const [tripEnd, setTripEnd] = useState(null);
    
    

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
            if (trips.length === 0) return;
    
            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }
    
                // Debug logs
                console.log("Current numericTripId:", numericTripId);
                console.log("All trips:", trips);
    
                const foundTrip = trips.find((trip) => trip.id === numericTripId);
                               
                // More detailed debug logging
                console.log("Found trip:", foundTrip);
                console.log("Found trip dateStart:", foundTrip?.dateStart);
                console.log("Found trip dateEnd:", foundTrip?.dateEnd);
    
                const visitsData = await getVisitsForTrip(numericTripId);
                setVisits(Array.isArray(visitsData) ? visitsData : []);
    
                if (foundTrip) {
                    setTrip(foundTrip);
                    setTripTitle(foundTrip.title);
    
                    // Ensure dates are properly converted
                    const startDate = new Date(foundTrip.dateStart);
                    const endDate = new Date(foundTrip.dateEnd);    
                    setTripStart(startDate);
                    setTripEnd(endDate);
                }
    
            } catch (err) {
                console.error("Error in loadVisits:", err);
                setError(`Erreur lors du chargement des visites: ${err.message}`);
                setSnackbarOpen(true); 
            } finally {
                setLoading(false);
            }
        };
    
        loadVisits();
    }, [numericTripId, isAuthenticated, navigate, trips]);

    useEffect(() => {
        if (tripStart && tripEnd) {
            // Assurez-vous que tripStart et tripEnd sont des objets Date
            setDateStart(new Date(tripStart));
            setDateEnd(new Date(tripEnd));
        }

    }, [tripStart, tripEnd]);
  
    const handleAddVisit = async (newVisitData) => {
        const visitStart = new Date(newVisitData.dateStart);
        const visitEnd = new Date(newVisitData.dateEnd);
        console.log("visitStart:", visitStart);
        console.log("visitEnd:", visitEnd);
      
        // Validation des dates : elles doivent être comprises dans celles du voyage
        if (visitStart < tripStart || visitEnd > tripEnd) {
            setError(
              `Les dates doivent être comprises entre ${tripStart.toLocaleDateString(
                "fr-FR"
              )} et ${tripEnd.toLocaleDateString("fr-FR")}.`
            );
            return;
          }
      
      
          try {
            // Ajouter la visite via l'API
            const addedVisit = await addVisit(visitData); // Assurez-vous que visitData est passé correctement à l'API
        
            // Mettre à jour l'état local avec la nouvelle visite
            setVisits((prevVisits) => [...prevVisits, addedVisit]);

            const updatedVisits = await fetchVisits();
            setVisits(updatedVisits);

               
            // Fermer le modal après ajout de la visite
            setOpenAddModal(false);
                  
          } catch (err) {
            setError(`Erreur lors de l'ajout de la visite: ${err.message}`);
            setSnackbarOpen(true);
          }
        };

    const handleVisitUpdated = (updatedVisitData) => {
        setVisits((prevVisits) =>
            Array.isArray(prevVisits)
                ? prevVisits.map((visit) =>
                    visit.id === updatedVisitData.id
                        ? { ...updatedVisitData, rating: parseFloat(updatedVisitData.rating) || 0 }
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
    // console.log("Liste des voyages:", trips);
    const currentTrip = trips.find((trip) => trip.id === numericTripId);

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Visites du voyage <strong>{currentTrip ? currentTrip.title : 'Nom du voyage inconnu'}</strong>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Dates : {currentTrip?.dateStart ? new Date(currentTrip.dateStart).toLocaleDateString() : 'Inconnue'} - {currentTrip?.dateEnd ? new Date(currentTrip.dateEnd).toLocaleDateString() : 'Inconnue'}
            </Typography>
            <div className='tripVisits' >
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
                    {/* {error && <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>} */}
                    
                    <AddVisitModal 
                        isOpen={openAddModal} 
                        onClose={() => setOpenAddModal(false)} 
                        onAddVisit={handleAddVisit} 
                        tripStart={tripStart} 
                        tripEnd={tripEnd} 
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
    
                <Grid container sx={{ display: 'flex', width: '100%', alignItems:"center", justifyContent:"center" }} spacing={3}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        Array.isArray(visits) && visits.length > 0 ? (
                            visits.map((visit) => {
                                const rating = Number(visit.rating); // Convertir en nombre
                                const validRating = !isNaN(rating) && rating >= 0 && rating <= 5 ? rating : 0; // Vérifier la validité
                        
                                return (
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
                                            rating={validRating} // Passer la note validée
                                            geo={visit.geo}
                                            onVisitUpdated={handleVisitUpdated}
                                            onVisitDeleted={handleVisitDeleted}
                                            onDeleteClick={() => handleVisitDeleted(visit.id)} // Passer les IDs lors du clic
                                        />
                                    </Grid>
                            )})
                        ) : (
                            <Typography variant="body1" sx={{ margin: '2rem' }}>Aucune visite trouvée pour ce voyage.</Typography>
                        )
                    )}
                </Grid>
            </div>
    
            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar> */}
        </div>
    );
}
