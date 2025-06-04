import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Phone, MapPin, Calendar, Edit, Upload, Loader2, Save, Key } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, userRoles } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    address: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Load user settings on component mount
  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setFormData({
          firstName: data.name?.split(' ')[0] || '',
          lastName: data.name?.split(' ').slice(1).join(' ') || '',
          phone: data.phone || '',
          department: '',
          address: ''
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const getUserDisplayName = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    return fullName || user?.email?.split('@')[0] || 'المستخدم';
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('admin')) return 'مدير النظام';
    if (roles.includes('staff')) return 'موظف';
    if (roles.includes('judge')) return 'قاضي';
    if (roles.includes('expert')) return 'خبير';
    if (roles.includes('notary')) return 'موثق';
    if (roles.includes('inheritance_officer')) return 'مسؤول مواريث';
    return 'مستخدم';
  };

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes('admin')) return 'bg-red-100 text-red-800';
    if (roles.includes('judge')) return 'bg-purple-100 text-purple-800';
    if (roles.includes('staff')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          name: fullName,
          email: user?.email,
          phone: formData.phone
        });

      if (error) throw error;

      toast({
        title: "تم حفظ التغييرات بنجاح",
        description: "تم تحديث بياناتك الشخصية"
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "خطأ في كلمة المرور",
          description: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
          variant: "destructive"
        });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          title: "خطأ في كلمة المرور",
          description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "تم تغيير كلمة المرور بنجاح",
        description: "تم تحديث كلمة المرور الخاصة بك"
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم تحديث صورة الملف الشخصي"
      });
    } catch (error) {
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">إدارة معلومات حسابك الشخصي</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            disabled={isLoading}
          >
            <Key className="w-4 h-4 ml-2" />
            تغيير كلمة المرور
          </Button>
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            disabled={isLoading}
          >
            <Edit className="w-4 h-4 ml-2" />
            {isEditMode ? 'إلغاء التعديل' : 'تعديل الملف'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {getUserDisplayName().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditMode && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{getUserDisplayName()}</h3>
                <Badge className={`mt-2 ${getRoleBadgeColor(userRoles)}`}>
                  {getRoleDisplayName(userRoles)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">انضم في يناير 2024</span>
            </div>
            {formData.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{formData.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditMode || isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditMode || isLoading}
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditMode || isLoading}
                />
              </div>
              <div>
                <Label htmlFor="position">المنصب</Label>
                <Input
                  id="position"
                  value={getRoleDisplayName(userRoles)}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  placeholder="قسم الخبراء"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!isEditMode || isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">العنوان</Label>
              <div className="flex">
                <Input
                  id="address"
                  placeholder="المخادر، اليمن"
                  className="flex-1"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditMode || isLoading}
                />
                <Button variant="outline" size="icon" className="mr-2" disabled>
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isEditMode && (
              <div className="flex justify-end space-x-4 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    loadUserSettings(); // Reset form
                  }}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Form */}
      {showPasswordForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              تغيير كلمة المرور
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التغيير...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 ml-2" />
                    تغيير كلمة المرور
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;