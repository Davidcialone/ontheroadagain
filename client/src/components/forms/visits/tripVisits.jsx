import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import { addVisit, getVisitsForTrip } from '../../../api/visitApi'; 
import { fetchTrips } from '../../../api/tripApi';
import { Button, Grid, Typography, CircularProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import { AddVisitModal } from '../modals/addVisitModal';
import { UpdateVisitModal } from '../modals/updateVisitModal';
import { DeleteVisitModal } from '../modals/deleteVisitModal';
import { Visit } from '../visits/visit';    

export function TripVisits() {
    const { tripId } = useParams();
    const numericTripId = Number(tripId);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [trips, setTrips] = useState([]);
    const [trip, setTrip] = useState({});
    const [visits, setVisits] = useState([]);
    const [tripTitle, setTripTitle] = useState('');
    const [tripStart, setTripStart] = useState(null);
    const [tripEnd, setTripEnd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Modals states
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [updatedVisit, setUpdatedVisit] = useState(null);
    const [visitToDelete, setVisitToDelete] = useState(null);

    // Charge les voyages à l'initialisation
    useEffect(() => {
        const loadTrips = async () => {
            try {
                const tripsData = await fetchTrips();
                setTrips(tripsData);
                console.log("Trips Data:", tripsData);
            } catch (err) {
                setError(`Erreur lors du chargement des voyages: ${err.message}`);
                setSnackbarOpen(true);
            }
        };
        loadTrips();
    }, []);

    // Charge les visites et met à jour le voyage actuel
    useEffect(() => {
        const loadVisits = async () => {
            if (trips.length === 0) return;

            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                const foundTrip = trips.find((trip) => trip.id === numericTripId);

                if (foundTrip) {
                    setTrip(foundTrip);
                    setTripTitle(foundTrip.title);
                    setTripStart(new Date(foundTrip.dateStart));
                    setTripEnd(new Date(foundTrip.dateEnd));

                    const visitsData = await getVisitsForTrip(numericTripId);
                    setVisits(Array.isArray(visitsData) ? visitsData : []);
                } else {
                    console.error(`Voyage non trouvé pour l'ID ${numericTripId}`);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des visites:", err);
                setError(`Erreur lors du chargement des visites: ${err.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        loadVisits();
    }, [numericTripId, isAuthenticated, navigate, trips]);

    const handleAddVisit = async (newVisitData) => {
        const visitStart = new Date(newVisitData.dateStart);
        const visitEnd = new Date(newVisitData.dateEnd);

        // Validation des dates
        if (visitStart < tripStart || visitEnd > tripEnd) {
            setError(`Les dates doivent être comprises entre ${tripStart} et ${tripEnd}.`);
            return;
        }

        try {
            const addedVisit = await addVisit(newVisitData);
            setVisits((prevVisits) => [...prevVisits, addedVisit]);
            setOpenAddModal(false);
        } catch (err) {
            setError(`Erreur lors de l'ajout de la visite: ${err.message}`);
            setSnackbarOpen(true);
        }
    };

    const handleVisitUpdated = (updatedVisitData) => {
        setVisits((prevVisits) =>
            prevVisits.map((visit) => visit.id === updatedVisitData.id ? updatedVisitData : visit)
        );
        setOpenUpdateModal(false);
    };

    const handleVisitDeleted = (id) => {
        setVisits((prevVisits) => prevVisits.filter((visit) => visit.id !== id));
    };

    const handleSnackbarClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const currentTrip = trips.find((trip) => trip.id === numericTripId);

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Visites du voyage <strong>{currentTrip ? currentTrip.title : 'Nom du voyage inconnu'}</strong>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Dates : {currentTrip?.dateStart ? new Date(currentTrip.dateStart).toLocaleDateString() : 'Inconnue'} - {currentTrip?.dateEnd ? new Date(currentTrip.dateEnd).toLocaleDateString() : 'Inconnue'}
            </Typography>
            <Button
                variant="contained"
                onClick={() => setOpenAddModal(true)}
                disabled={isAdding}
            >
                Ajouter une visite
            </Button>
            <AddVisitModal 
                isOpen={openAddModal} 
                onClose={() => setOpenAddModal(false)} 
                onAddVisit={handleAddVisit} 
                tripStart={tripStart} 
                tripEnd={tripEnd} 
              
            />
            {loading ? (
                <CircularProgress />
            ) : (
                visits.length > 0 ? (
                    visits.map((visit) => (
                        <Visit key={visit.id}
                        visitId={visit.id} // Assurez-vous de passer `visit.id`
                         {...visit} onVisitUpdated={handleVisitUpdated} onVisitDeleted={handleVisitDeleted} />
                    ))
                ) : (
                    <Typography>Aucune visite trouvée.</Typography>
                )
            )}
            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity="error">{error}</MuiAlert>
            </Snackbar> */}
        </div>
    );
}
