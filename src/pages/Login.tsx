import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import EnhancedLoginForm from '../components/auth/EnhancedLoginForm';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="mb-8 text-center">
        <img 
          src="/placeholder.svg"
          alt="شعار مركز خبراء القضاء" 
          className="h-20 w-auto mb-4 mx-auto"
        />
        <h1 className="text-3xl font-bold text-judicial-primary mb-2">
          مركز خبراء القضاء
        </h1>
        <p className="text-gray-600">
          المحكمة الابتدائية بالمخادر
        </p>
        <p className="text-sm text-gray-500 mt-2">
          نظام إدارة الخبراء والقضايا القضائية
        </p>
      </div>
      
      <EnhancedLoginForm />
      
      {/* Development Helper Link */}
      <div className="mt-6 text-center">
        <a 
          href="/create-users" 
          className="text-sm text-judicial-primary hover:underline"
        >
          إنشاء مستخدمين تجريبيين للتطوير
        </a>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} | جميع الحقوق محفوظة</p>
        <p className="mt-1">وزارة العدل - الجمهورية اليمنية</p>
      </div>
    </div>
  );
};

export default Login;
