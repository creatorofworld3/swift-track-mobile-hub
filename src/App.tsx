
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DeliveryManagement from '@/pages/DeliveryManagement';
import LiveTracking from '@/pages/LiveTracking';
import RouteOptimization from '@/pages/RouteOptimization';
import Analytics from '@/pages/Analytics';
import DriverApp from '@/pages/DriverApp';
import CustomerTracking from '@/pages/CustomerTracking';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/customer/:trackingId" element={<CustomerTracking />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/deliveries" element={
                <ProtectedRoute>
                  <DeliveryManagement />
                </ProtectedRoute>
              } />
              <Route path="/tracking" element={
                <ProtectedRoute>
                  <LiveTracking />
                </ProtectedRoute>
              } />
              <Route path="/routes" element={
                <ProtectedRoute>
                  <RouteOptimization />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/driver" element={
                <ProtectedRoute>
                  <DriverApp />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
