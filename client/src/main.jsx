import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import '../src/style/index.css';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
      <CssBaseline /> {/* Normalisation des styles avec MUI */}
      <App />

  </StrictMode>,
);
