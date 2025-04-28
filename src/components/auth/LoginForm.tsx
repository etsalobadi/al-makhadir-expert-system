
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-judicial-primary">تسجيل الدخول</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              autoComplete="email"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-judicial-primary hover:underline">
                نسيت كلمة المرور؟
              </a>
              <Label htmlFor="password">كلمة المرور</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              className="text-right"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-judicial-primary hover:bg-judicial-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-0 border-l-0 border-white"></span>
                جاري تسجيل الدخول...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" /> تسجيل الدخول
              </span>
            )}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>بيانات تسجيل الدخول التجريبية:</p>
            <p className="mt-1">
              مدير النظام: admin@example.com / password123
            </p>
            <p>
              موظف: staff@example.com / password123
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
