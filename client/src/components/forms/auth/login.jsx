import React, { useState, useEffect } from 'react';
import '../../../style/signup.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Assurez-vous que c'est bien la bonne importation
import Cookies from 'js-cookie'; // Bibliothèque pour gérer les cookies

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Utiliser useEffect pour vérifier si un token est présent dans les cookies
  useEffect(() => {
    const token = Cookies.get('token'); // Récupère le token dans les cookies
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Décoder le token
        console.log('Token déjà présent:', decodedToken);
        const userId = decodedToken.id; // Utilisez 'id' si c'est la clé correcte dans le token
        console.log('User ID:', userId);

        // Si le token est valide, redirige l'utilisateur directement vers la page protégée
        navigate(`/me/trips`);
      } catch (err) {
        console.error("Erreur lors du décodage du token:", err);
        Cookies.remove('token'); // Si le token est invalide, on le supprime
      }
    }
  }, [navigate]);

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

      // Vérifie si le token est présent avant de le stocker
      if (data.token) {
        // Stocker le token dans un cookie sécurisé
        Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
        console.log("Token stocké dans le cookie:", data.token);

        // Décodez le token pour obtenir l'id de l'utilisateur
        const decodedToken = jwtDecode(data.token);
        console.log('Decoded token:', decodedToken);
        const userId = decodedToken.id; // Utilisez 'id' si c'est la clé correcte dans le token
        console.log('User ID:', userId);

        // Rediriger l'utilisateur vers sa page de voyages
        navigate(`/me/trips`);
      } else {
        throw new Error("Token non reçu dans la réponse.");
      }
    } catch (err) {
      // Affiche le message d'erreur dans le console et met à jour l'état de l'erreur
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
