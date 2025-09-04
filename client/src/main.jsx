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
import ContractAndDocuments from './pages/ContractAndDocuments';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CommunicationSystem from './pages/CommunicationSystem';
import SchedulingAutomation from './pages/SchedulingAutomation';
import Operations from './pages/Operations';
import FinancialReports from './pages/FinancialReports';
import Monitoring from './pages/Monitoring';
import ComplianceSecurity from './pages/ComplianceSecurity';
import ReferralManagement from './pages/ReferralManagement';
import ReportingDashboard from './pages/ReportingDashboard';
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/*" element={<App>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-management" element={<ClientManagement />} />
              <Route path="/client-details/:clientId" element={<ClientDetails />} />
              <Route path="/communication" element={<CommunicationSystem />} />
              <Route path="/scheduling" element={<SchedulingAutomation />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/financial-reports" element={<FinancialReports />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/compliance-security" element={<ComplianceSecurity />} />
              <Route path="/referral-management" element={<ReferralManagement />} />
              <Route path="/reporting-dashboard" element={<ReportingDashboard />} />
              <Route path="/contracts" element={<ContractAndDocuments />} />
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