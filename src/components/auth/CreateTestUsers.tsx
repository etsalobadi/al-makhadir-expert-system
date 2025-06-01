
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, AlertCircle } from 'lucide-react';

const CreateTestUsers: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const testUsers = [
    {
      email: 'admin@judiciary.ye',
      password: 'Admin123!@#',
      role: 'admin',
      name: 'مدير النظام الرئيسي',
      userData: {
        name: 'مدير النظام الرئيسي',
        user_type: 'internal'
      }
    },
    {
      email: 'staff@judiciary.ye',
      password: 'Staff123!@#',
      role: 'staff',
      name: 'موظف النظام',
      userData: {
        name: 'موظف النظام',
        user_type: 'internal'
      }
    },
    {
      email: 'judge@judiciary.ye',
      password: 'Judge123!@#',
      role: 'judge',
      name: 'قاضي المحكمة',
      userData: {
        name: 'قاضي المحكمة',
        user_type: 'internal'
      }
    },
    {
      email: 'expert@judiciary.ye',
      password: 'Expert123!@#',
      role: 'expert',
      name: 'خبير قضائي',
      userData: {
        name: 'خبير قضائي',
        user_type: 'external'
      }
    }
  ];

  const createTestUsers = async () => {
    setIsCreating(true);
    setCreatedUsers([]);
    setErrors([]);

    for (const user of testUsers) {
      try {
        console.log(`Creating user: ${user.email}`);
        
        // Create the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: user.userData,
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (authError) {
          console.error(`Auth error for ${user.email}:`, authError);
          setErrors(prev => [...prev, `${user.email}: ${authError.message}`]);
          continue;
        }

        if (authData.user) {
          console.log(`User created successfully: ${user.email}, ID: ${authData.user.id}`);

          // Add user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: user.role
            });

          if (roleError) {
            console.error(`Role error for ${user.email}:`, roleError);
            setErrors(prev => [...prev, `${user.email} role: ${roleError.message}`]);
          }

          // Add user settings
          const { error: settingsError } = await supabase
            .from('user_settings')
            .insert({
              user_id: authData.user.id,
              name: user.name,
              email: user.email,
              language: 'ar',
              timezone: 'Asia/Riyadh'
            });

          if (settingsError) {
            console.error(`Settings error for ${user.email}:`, settingsError);
            setErrors(prev => [...prev, `${user.email} settings: ${settingsError.message}`]);
          }

          setCreatedUsers(prev => [...prev, user.email]);
        }
      } catch (error: any) {
        console.error(`Unexpected error for ${user.email}:`, error);
        setErrors(prev => [...prev, `${user.email}: ${error.message}`]);
      }
    }

    setIsCreating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-judicial-primary">إنشاء مستخدمين تجريبيين</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {testUsers.map((user) => (
            <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">كلمة المرور: {user.password}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' && 'مدير'}
                  {user.role === 'staff' && 'موظف'}
                  {user.role === 'judge' && 'قاضي'}
                  {user.role === 'expert' && 'خبير'}
                </Badge>
                {createdUsers.includes(user.email) && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={createTestUsers} 
          disabled={isCreating}
          className="w-full bg-judicial-primary hover:bg-judicial-primary/90"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-0 border-l-0 border-white"></span>
              جاري إنشاء المستخدمين...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              إنشاء جميع المستخدمين
            </span>
          )}
        </Button>

        {createdUsers.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">تم إنشاء المستخدمين بنجاح:</h4>
            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
              {createdUsers.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              أخطاء في الإنشاء:
            </h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">ملاحظات مهمة:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• سيتم إرسال رسائل تأكيد البريد الإلكتروني (يمكن تعطيلها في إعدادات Supabase)</li>
            <li>• المدير (admin@judiciary.ye) له صلاحيات كاملة في النظام</li>
            <li>• يمكن استخدام هذه الحسابات لاختبار النظام</li>
            <li>• احفظ كلمات المرور للاستخدام في تسجيل الدخول</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTestUsers;
