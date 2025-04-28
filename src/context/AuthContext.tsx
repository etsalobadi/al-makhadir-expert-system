
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../utils/constants';
import { showError, showSuccess } from '../utils/helpers';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock user database - In a real application, this would be a backend API call
  const mockUsers = [
    { id: '1', name: 'أحمد محمد', email: 'admin@example.com', password: 'password123', role: USER_ROLES.ADMIN },
    { id: '2', name: 'علي عبدالله', email: 'staff@example.com', password: 'password123', role: USER_ROLES.STAFF },
    { id: '3', name: 'القاضي يوسف', email: 'judge@example.com', password: 'password123', role: USER_ROLES.JUDGE },
    { id: '4', name: 'خبير محمد', email: 'expert@example.com', password: 'password123', role: USER_ROLES.EXPERT },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate backend authentication
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // Save user data without the password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', 'mock-jwt-token');
      
      setUser(userWithoutPassword);
      showSuccess('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    showSuccess('تم تسجيل الخروج بنجاح');
  };

  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        return false;
      }
      
      // In a real app, validate the token with the backend
      setUser(JSON.parse(storedUser));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
