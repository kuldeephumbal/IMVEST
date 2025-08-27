import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App';
import Dashboard from './pages/Dashboard';
import ClientManagement from './pages/ClientManagement';
import ClientDetails from './pages/ClientDetails';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { ToastProvider } from './contexts/ToastContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<App>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-management" element={<ClientManagement />} />
            <Route path="/client-details/:clientId" element={<ClientDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </App>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);
