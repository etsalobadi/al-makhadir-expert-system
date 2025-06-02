
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ModernHeader from './ModernHeader';
import ModernSidebar from './ModernSidebar';

interface ModernLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <ModernSidebar />
      
      <div className="flex flex-col flex-1 min-w-0">
        <ModernHeader />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
        <footer className="border-t border-gray-200 bg-white py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 مركز خبراء القضاء - المحكمة الابتدائية بالمخادر</p>
            <p>الإصدار 2.0.1</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernLayout;
