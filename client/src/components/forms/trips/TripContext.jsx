import React, { createContext, useContext, useState } from "react";

// Création du contexte
const TripContext = createContext();

// Fournisseur de contexte
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]); // État pour les voyages
  const [error, setError] = useState(null); // État pour les erreurs
  const [loading, setLoading] = useState(true); // État de chargement

  return (
    <TripContext.Provider
      value={{ trips, setTrips, error, setError, loading, setLoading }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useTrips = () => {
  return useContext(TripContext);
};
