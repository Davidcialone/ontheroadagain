import React, { useState, useEffect, useContext } from 'react';
import '../../../style/signup.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corriger l'import si nécessaire
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/authContext'; // Import du contexte d'authentification

export function Login() {
  const { login } = useContext(AuthContext); // Récupérer la fonction de login du contexte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Vérifier si un token est déjà présent
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token déjà présent:', decodedToken);
        navigate(`/me/trips`); // Redirige l'utilisateur si déjà connecté
      } catch (err) {
        console.error("Erreur lors du décodage du token:", err);
        Cookies.remove('token'); // Supprimer le token si invalide
      }
    }
  }, [navigate]);

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/ontheroadagain/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la connexion: ${errorText}`);
      }

      const data = await response.json();

      if (data.token) {
        // Stocker le token dans les cookies
        Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
        const decodedToken = jwtDecode(data.token);

        console.log('Decoded token:', decodedToken);

        // Mettre à jour l'état global d'authentification via le contexte
        login(data.token);

        // Rediriger l'utilisateur
        navigate(`/me/trips`);
      } else {
        throw new Error("Token non reçu dans la réponse.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 style={{ textAlign: 'center' }}>Connexion</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </div>
  );
}
