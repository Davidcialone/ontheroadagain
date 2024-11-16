import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode'; // Corriger l'import si nécessaire
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Temps actuel en secondes

        // Vérification de l'expiration du token
        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setIsAuthenticated(true);

          // Récupération de l'utilisateur via `fetchUser`
          fetchUser()
            .then((data) => {
              setUser(data); // Assignez les données utilisateur
            })
            .catch((error) => {
              console.error("Erreur lors de la récupération de l'utilisateur:", error);
              logout(); // Déconnecte si la récupération échoue
            });
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 7, sameSite: "Lax" });
    setIsAuthenticated(true);
  };


  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
