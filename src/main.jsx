import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { LenisProvider } from './providers/LenisProvider';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LenisProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LenisProvider>
  </StrictMode>
);
