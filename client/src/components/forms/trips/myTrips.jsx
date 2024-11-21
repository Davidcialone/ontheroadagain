import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Snackbar, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { AuthContext } from '../auth/authContext';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode'; 
import { fetchTrips, addTrip } from '../../../../src/api/tripApi'; 
import { Trip } from './trip'; 
import { AddTripModal } from '../modals/addTripModal'; 


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

export function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false); // State for AddTripModal
    
    const navigate = useNavigate();
    const tripsFetched = useRef(false);
    const { isAuthenticated, user } = useContext(AuthContext);
      
    useEffect(() => {
        const loadTrips = async () => {
            if (tripsFetched.current) {
                return; // Évite un fetch multiple
            }
            tripsFetched.current = true;

            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                const tripsData = await fetchTrips(); 
                const formattedTripsData = Array.isArray(tripsData) ? tripsData.map(trip => ({
                    ...trip,
                    rating: Number(trip.rating).toFixed(1) || 0,
                })) : [];

                setTrips(formattedTripsData);
            } catch (err) {
                console.error("Erreur lors du chargement des voyages:", err);
                setError(err.message);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        loadTrips();
    }, [isAuthenticated, navigate]);
  
    const handleAddTrip = (tripData) => {
        // Ajout des données du voyage sans appel réseau
        setTrips((prevTrips) => [...prevTrips, tripData]);
        setSnackbarOpen(true); // Affichage du snackbar de confirmation
        setIsAddTripModalOpen(false); // Ferme le modal
    };   

    const handleTripUpdated = (updatedTripData) => {
        if (typeof updatedTripData === 'object' && updatedTripData !== null) {
            setTrips((prevTrips) =>
                Array.isArray(prevTrips) ? prevTrips.map(trip => (trip.id === updatedTripData.id ? { ...updatedTripData, rating: Number(updatedTripData.rating) } : trip)) : []
        );
    }
    };

    const handleTripDeleted = (id) => {
        setTrips((prevTrips) => {
            if (Array.isArray(prevTrips)) {
                return prevTrips.filter(trip => trip.id !== id);
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

    // Modal control functions
    const onOpenAddTripModal = () => setIsAddTripModalOpen(true);
    const onCloseAddTripModal = () => setIsAddTripModalOpen(false);
  
    return (
        <Container>
            {/* <Typography >Les voyages de
                <strong> {user ? user.pseudo : 'Pas de pseudo'}</strong>
                </Typography> */}
            <div className='roadbook'>
                <div>
                    liste des voyages
                </div>
                <div className='add-trip-button-layout'>
                <Button 
                    variant="contained" 
                    sx={{ 
                        width: 'auto',                      // Largeur à 100%
                        color: '#333',                      // Couleur du texte (gris foncé)
                        backgroundColor: '#87CEEB',        // Couleur de fond (bleu clair)
                        margin: '1rem',                    // Marges
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', // Ombre portée
                        borderRadius: '4px',               // Bords arrondis
                        transition: 'background-color 0.3s, box-shadow 0.3s', // Transition pour l'effet hover
                        '&:hover': {
                            color: 'black',                 // Couleur du texte au survol
                            backgroundColor: '#bdbdbd',    // Couleur de fond au survol (gris plus foncé)
                            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)', // Ombre plus forte au survol
                        },
                    }}
                    onClick={onOpenAddTripModal} 
                    disabled={isAdding}
                >   Ajouter un voyage
                </Button>
                    {/* {error && <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>} */}
                    <AddTripModal
                        isOpen={isAddTripModalOpen}
                        onClose={onCloseAddTripModal}
                        onAddTrip={handleAddTrip}
                    />
                </div>

                <Grid container spacing={3}>
                    {loading ? (
                        <Typography>Chargement des voyages...</Typography>
                    ) : (
                        Array.isArray(trips) && trips.length > 0 ? (
                            trips.map(trip => (
                                <Grid item
                                xs={12}          // 1 carte (plein écran sur mobile)
                                sm={6}           // 2 cartes pour les écrans ≥ 1000px
                                md={4}           // 3 cartes pour les écrans ≥ 1280px
                                key={trip.id}
                                sx={{
                                    width: '100%', // S'assurer qu'elle occupe toute la largeur disponible
                                    maxWidth: '100%', // Pas de dépassement de l'écran
                                    margin: 'auto', // Centre la carte si elle a une marge
                                  }}>
                                    <Trip
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
                                </Grid>
                            ))
                        ) : (
                            <Typography>Aucun voyage trouvé.</Typography>
                        )
                    )}
                </Grid>
            </div>

            {/* Snackbar pour afficher les messages d'erreur */}
            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {error}
                </Alert>
            </Snackbar> */}
        </Container>
    );
}
