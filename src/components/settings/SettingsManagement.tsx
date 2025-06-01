
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield, Globe, Database, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserSettings, UserSettings } from '@/hooks/useUserSettings';

const SettingsManagement: React.FC = () => {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings, isUpdating } = useUserSettings();
  const [saving, setSaving] = useState(false);

  // Type-safe helper functions to handle Json types from database
  const getNotifications = (settings: any) => {
    const notifications = settings?.notifications;
    if (typeof notifications === 'object' && notifications !== null) {
      return {
        email: notifications.email ?? true,
        sms: notifications.sms ?? false,
        push: notifications.push ?? true,
        system: notifications.system ?? true,
      };
    }
    return {
      email: true,
      sms: false,
      push: true,
      system: true,
    };
  };

  const getSecurity = (settings: any) => {
    const security = settings?.security;
    if (typeof security === 'object' && security !== null) {
      return {
        twoFactor: security.twoFactor ?? false,
        sessionTimeout: security.sessionTimeout ?? '30',
        passwordExpiry: security.passwordExpiry ?? '90',
      };
    }
    return {
      twoFactor: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
    };
  };

  const getSystem = (settings: any) => {
    const system = settings?.system;
    if (typeof system === 'object' && system !== null) {
      return {
        auditLog: system.auditLog ?? true,
        autoBackup: system.autoBackup ?? true,
        backupFrequency: system.backupFrequency ?? 'daily',
        dataRetention: system.dataRetention ?? '365',
      };
    }
    return {
      auditLog: true,
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: '365',
    };
  };

  const handleInputChange = (field: string, value: any) => {
    if (!settings) return;
    updateSettings({ [field]: value });
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    if (!settings) return;
    
    let currentSection;
    if (section === 'notifications') {
      currentSection = getNotifications(settings);
    } else if (section === 'security') {
      currentSection = getSecurity(settings);
    } else if (section === 'system') {
      currentSection = getSystem(settings);
    } else {
      return;
    }

    updateSettings({
      [section]: {
        ...currentSection,
        [field]: value
      }
    });
  };

  const saveAllSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      // Create a properly typed settings object
      const settingsToSave: Partial<UserSettings> = {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        language: settings.language,
        timezone: settings.timezone,
        notifications: getNotifications(settings),
        security: getSecurity(settings),
        system: getSystem(settings),
      };
      await updateSettings(settingsToSave);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-judicial-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8 text-gray-500">
        فشل في تحميل الإعدادات
      </div>
    );
  }

  const notifications = getNotifications(settings);
  const security = getSecurity(settings);
  const systemSettings = getSystem(settings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-judicial-primary">إعدادات النظام</h1>
          <p className="text-gray-600 mt-2">إدارة الحساب والتفضيلات العامة</p>
        </div>
        <Button 
          onClick={saveAllSettings} 
          disabled={saving || isUpdating}
          className="bg-judicial-primary hover:bg-judicial-primary/90"
        >
          <Save className="w-4 h-4 ml-2" />
          {saving || isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            النظام
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
              <CardDescription>تحديث البيانات الشخصية للحساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={settings.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">الدور في النظام</Label>
                  <div className="pt-2">
                    <Badge className="bg-judicial-primary text-white">
                      {user?.userRoles?.includes('admin') && 'مدير النظام'}
                      {user?.userRoles?.includes('staff') && 'موظف'}
                      {user?.userRoles?.includes('judge') && 'قاضي'}
                      {user?.userRoles?.includes('expert') && 'خبير'}
                      {!user?.userRoles?.length && 'مستخدم'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تخصيص طريقة استلام الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-gray-500">استلام الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNestedChange('notifications', 'email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الرسائل النصية</Label>
                    <p className="text-sm text-gray-500">استلام الإشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNestedChange('notifications', 'sms', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات النظام</Label>
                    <p className="text-sm text-gray-500">استلام إشعارات النظام والتحديثات</p>
                  </div>
                  <Switch
                    checked={notifications.system}
                    onCheckedChange={(checked) => handleNestedChange('notifications', 'system', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الإشعارات الفورية</Label>
                    <p className="text-sm text-gray-500">استلام الإشعارات الفورية في المتصفح</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNestedChange('notifications', 'push', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>تكوين الأمان وحماية الحساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>التحقق بخطوتين</Label>
                    <p className="text-sm text-gray-500">تفعيل التحقق بخطوتين لحماية إضافية</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => handleNestedChange('security', 'twoFactor', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>انتهاء صلاحية الجلسة (بالدقائق)</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => handleNestedChange('security', 'sessionTimeout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 دقيقة</SelectItem>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">60 دقيقة</SelectItem>
                      <SelectItem value="120">120 دقيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>انتهاء صلاحية كلمة المرور (بالأيام)</Label>
                  <Select
                    value={security.passwordExpiry}
                    onValueChange={(value) => handleNestedChange('security', 'passwordExpiry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 يوم</SelectItem>
                      <SelectItem value="60">60 يوم</SelectItem>
                      <SelectItem value="90">90 يوم</SelectItem>
                      <SelectItem value="180">180 يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>تخصيص تفضيلات النظام العامة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اللغة</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المنطقة الزمنية</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                      <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
              <CardDescription>تكوين إعدادات النظام والبيانات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>النسخ الاحتياطي التلقائي</Label>
                    <p className="text-sm text-gray-500">تفعيل النسخ الاحتياطي التلقائي للبيانات</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => handleNestedChange('system', 'autoBackup', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>تكرار النسخ الاحتياطي</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => handleNestedChange('system', 'backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">كل ساعة</SelectItem>
                      <SelectItem value="daily">يومياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                      <SelectItem value="monthly">شهرياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>فترة الاحتفاظ بالبيانات (بالأيام)</Label>
                  <Input
                    value={systemSettings.dataRetention}
                    onChange={(e) => handleNestedChange('system', 'dataRetention', e.target.value)}
                    placeholder="365"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>سجل العمليات</Label>
                    <p className="text-sm text-gray-500">تسجيل جميع العمليات في النظام</p>
                  </div>
                  <Switch
                    checked={systemSettings.auditLog}
                    onCheckedChange={(checked) => handleNestedChange('system', 'auditLog', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
