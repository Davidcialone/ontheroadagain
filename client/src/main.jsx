import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { CssBaseline } from '@mui/material'; // Importation pour le style global de Material UI
import '../src/style/index.css'; // Assurez-vous que ce fichier CSS ne contient pas de styles de Bootstrap

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CssBaseline /> {/* Normalisation des styles avec MUI */}
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
