import React, { useState } from 'react';
import '../../../style/signup.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous que c'est bien la bonne importation

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

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
      localStorage.setItem('token', data.token);
      
      // Decode the token to get userId
      const decodedToken = jwtDecode(data.token); 
      console.log('Decoded token:', decodedToken);
      const userId = decodedToken.id; // Utilisez 'id' si c'est la clé correcte dans le token
      console.log('User ID:', userId);

      // Navigation vers la page des voyages de l'utilisateur
      navigate(`/api/me/trips/${userId}`); 
    } catch (err) {
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
