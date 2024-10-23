import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {App} from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import '../src/style/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
