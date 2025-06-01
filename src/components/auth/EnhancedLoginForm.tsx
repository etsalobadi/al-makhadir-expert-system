
import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LogIn, Phone, Mail, Eye, EyeOff } from 'lucide-react';

const EnhancedLoginForm: React.FC = () => {
  const { login, loginWithOTP, verifyOTP, resetPassword, isLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState('email');
  const [userType, setUserType] = useState<'internal' | 'external'>('internal');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('يرجى إدخال جميع الحقول المطلوبة');
      return;
    }

    try {
      await login(email, password, userType);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      if (!phone) {
        setError('يرجى إدخال رقم الهاتف');
        return;
      }

      try {
        await loginWithOTP(phone);
        setOtpSent(true);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ في إرسال رمز التحقق');
      }
    } else {
      if (!otpCode) {
        setError('يرجى إدخال رمز التحقق');
        return;
      }

      try {
        await verifyOTP(phone, otpCode);
      } catch (err: any) {
        setError(err.message || 'رمز التحقق غير صحيح');
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetEmail) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    try {
      await resetPassword(resetEmail);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في إرسال رابط إعادة التعيين');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-judicial-primary">تسجيل الدخول</CardTitle>
        <p className="text-sm text-gray-600">مركز خبراء القضاء</p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
            <TabsTrigger value="phone">رقم الهاتف</TabsTrigger>
            <TabsTrigger value="reset">استرداد الحساب</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* User Type Selection */}
            <div className="space-y-3">
              <Label>نوع المستخدم</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value) => setUserType(value as 'internal' | 'external')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal" className="text-sm">موظف داخلي 🟤</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="text-sm">مستخدم خارجي ⚪</Label>
                </div>
              </RadioGroup>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                    className="pr-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pl-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
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
            </form>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+967xxxxxxxxx"
                        className="pr-10"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    إرسال رمز التحقق
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">رمز التحقق</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="أدخل رمز التحقق"
                      maxLength={6}
                      dir="ltr"
                      className="text-center text-lg tracking-wider"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    تأكيد رمز التحقق
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOtpSent(false)}
                    className="w-full"
                  >
                    العودة
                  </Button>
                </>
              )}
            </form>
          </TabsContent>

          <TabsContent value="reset" className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">البريد الإلكتروني</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني لاسترداد الحساب"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                إرسال رابط إعادة التعيين
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">أو</p>
              <Button
                variant="link"
                className="text-judicial-primary"
                onClick={() => setActiveTab('email')}
              >
                العودة لتسجيل الدخول
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ليس لديك حساب؟{' '}
            <Button variant="link" className="p-0 h-auto text-judicial-primary">
              إنشاء حساب جديد
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLoginForm;
