import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode'; // Corriger l'import si nécessaire
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Temps actuel en secondes

        // Si le jeton est expiré, redirigez vers la page de connexion
        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de la décodage du token", error);
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
