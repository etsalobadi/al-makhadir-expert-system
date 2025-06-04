
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ModernLayout from '../components/layout/ModernLayout';
import Index from '../pages/Index';
import Dashboard from '../pages/Dashboard';
import Experts from '../pages/Experts';
import Cases from '../pages/Cases';
import Inheritance from '../pages/Inheritance';
import Complaints from '../pages/Complaints';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Sessions from '../pages/Sessions';
import Announcements from '../pages/Announcements';
import ElectronicServicesPage from '../pages/ElectronicServices';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import CreateUsersPage from '../pages/CreateUsers';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-users" element={<CreateUsersPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ModernLayout>
            <Dashboard />
          </ModernLayout>
        } 
      />
      <Route 
        path="/experts" 
        element={
          <ModernLayout>
            <Experts />
          </ModernLayout>
        }
      />
      <Route 
        path="/cases" 
        element={
          <ModernLayout>
            <Cases />
          </ModernLayout>
        } 
      />
      <Route 
        path="/inheritance" 
        element={
          <ModernLayout>
            <Inheritance />
          </ModernLayout>
        } 
      />
      <Route 
        path="/sessions" 
        element={
          <ModernLayout>
            <Sessions />
          </ModernLayout>
        } 
      />
      <Route 
        path="/announcements" 
        element={
          <ModernLayout>
            <Announcements />
          </ModernLayout>
        } 
      />
      <Route 
        path="/electronic-services" 
        element={
          <ModernLayout>
            <ElectronicServicesPage />
          </ModernLayout>
        } 
      />
      <Route 
        path="/complaints" 
        element={
          <ModernLayout>
            <Complaints />
          </ModernLayout>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ModernLayout>
            <Reports />
          </ModernLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ModernLayout>
            <Settings />
          </ModernLayout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ModernLayout>
            <Profile />
          </ModernLayout>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
