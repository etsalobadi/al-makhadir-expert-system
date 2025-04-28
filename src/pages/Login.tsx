
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <img 
          src="/placeholder.svg"
          alt="Logo" 
          className="h-16 w-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-judicial-primary">
          مركز خبراء القضاء
        </h1>
        <p className="text-gray-600 mt-2">
          المحكمة الابتدائية بالمخادر
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} | جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
};

export default Login;
