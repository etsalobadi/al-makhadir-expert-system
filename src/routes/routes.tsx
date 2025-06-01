import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Index from '../pages/Index';
import Dashboard from '../pages/Dashboard';
import Experts from '../pages/Experts';
import Cases from '../pages/Cases';
import Inheritance from '../pages/Inheritance';
import Complaints from '../pages/Complaints';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Sessions from '../pages/Sessions';
import Announcements from '../pages/Announcements';
import ElectronicServicesPage from '../pages/ElectronicServices';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import CreateUsersPage from '../pages/CreateUsersPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-users" element={<CreateUsersPage />} />
      <Route 
        path="/dashboard" 
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } 
      />
      <Route 
        path="/experts" 
        element={
          <MainLayout>
            <Experts />
          </MainLayout>
        }
      />
      <Route 
        path="/cases" 
        element={
          <MainLayout>
            <Cases />
          </MainLayout>
        } 
      />
      <Route 
        path="/inheritance" 
        element={
          <MainLayout>
            <Inheritance />
          </MainLayout>
        } 
      />
      <Route 
        path="/sessions" 
        element={
          <MainLayout>
            <Sessions />
          </MainLayout>
        } 
      />
      <Route 
        path="/announcements" 
        element={
          <MainLayout>
            <Announcements />
          </MainLayout>
        } 
      />
      <Route 
        path="/electronic-services" 
        element={
          <MainLayout>
            <ElectronicServicesPage />
          </MainLayout>
        } 
      />
      <Route 
        path="/complaints" 
        element={
          <MainLayout>
            <Complaints />
          </MainLayout>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <MainLayout>
            <Reports />
          </MainLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
