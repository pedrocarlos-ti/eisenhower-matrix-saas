import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './auth/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './auth/AuthPage';

// Protected route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public route that redirects to dashboard if already authenticated (only for auth pages)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App Router component that uses the auth context
const AppRouter: React.FC = () => {
  const { user, upgradeAccount } = useAuth();
  
  // Handle navigation actions
  const handleGetStarted = () => {
    window.location.href = '/auth?action=register';
  };
  
  const handleSignUp = () => {
    window.location.href = '/auth?action=login';
  };
  
  const handleUpgrade = () => {
    if (user) {
      upgradeAccount();
    } else {
      window.location.href = '/auth?action=register&upgrade=true';
    }
  };
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? 
            <LandingPage 
              onGetStarted={() => window.location.href = '/dashboard'} 
              onSignUp={() => window.location.href = '/dashboard'} 
              onUpgrade={handleUpgrade}
              isAuthenticated={true}
            /> :
            <LandingPage 
              onGetStarted={handleGetStarted} 
              onSignUp={handleSignUp} 
              onUpgrade={handleUpgrade}
              isAuthenticated={false}
            />
        } 
      />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      {/* Catch-all route redirects to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App component that wraps the router with AuthProvider
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
};

export default App;