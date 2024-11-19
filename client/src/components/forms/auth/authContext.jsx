import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Si nécessaire
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../../api/userApi"; // Assurez-vous que cette fonction est correcte

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nouvel état pour gérer le chargement
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Temps actuel en secondes

        if (decodedToken.exp < currentTime) {
          logout(); // Déconnexion si le token est expiré
        } else {
          setIsAuthenticated(true);
          fetchUser() // Récupération de l'utilisateur
            .then((data) => {
              setUser(data);
            })
            .catch((error) => {
              console.error("Erreur lors de la récupération de l'utilisateur:", error);
              logout();
            });
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false); // Fin du processus de chargement
  }, []);

  // Récupération de l'utilisateur dès que isAuthenticated devient true
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser() // Appel API pour récupérer les informations de l'utilisateur
        .then((data) => {
          setUser(data); // Assigner les données utilisateur
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'utilisateur:", error);
          logout();
        });
    }
  }, [isAuthenticated]); // Ce useEffect se déclenche lorsque isAuthenticated change

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return null; // Vous pouvez ajouter un loader ici si nécessaire
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
