import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminMenu } from './pages/AdminMenu';
import { AdminGallery } from './pages/AdminGallery';
import { AdminLocations } from './pages/AdminLocations';
import { AdminSettings } from './pages/AdminSettings';
import { AdminHome, AdminAbout, AdminFranchise, AdminContact } from './pages/AdminContent';

export function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Login - Public */}
          <Route path="login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path=""
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="franchise" element={<AdminFranchise />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
