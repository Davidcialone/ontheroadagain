import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import '../src/style/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CssBaseline /> {/* Normalisation des styles avec MUI */}
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
