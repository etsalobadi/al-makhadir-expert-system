import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, userRoles } = useAuth();

  const getUserDisplayName = () => {
    return user?.email?.split('@')[0] || 'المستخدم';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">إدارة معلومات حسابك الشخصي</p>
        </div>
        <Button>
          <Edit className="w-4 h-4 ml-2" />
          تعديل الملف
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" alt={getUserDisplayName()} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {getUserDisplayName().charAt(0)}
                </AvatarFallback>
              </Avatar>
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
                <Input id="firstName" defaultValue={getUserDisplayName()} />
              </div>
              <div>
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input id="lastName" defaultValue="" />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" type="tel" placeholder="05xxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="position">المنصب</Label>
                <Input id="position" defaultValue={getRoleDisplayName(userRoles)} disabled />
              </div>
              <div>
                <Label htmlFor="department">القسم</Label>
                <Input id="department" placeholder="قسم الخبراء" />
              </div>
            </div>

            <div>
              <Label htmlFor="address">العنوان</Label>
              <div className="flex">
                <Input id="address" placeholder="المخادر، اليمن" className="flex-1" />
                <Button variant="outline" size="icon" className="mr-2">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 space-x-reverse">
              <Button variant="outline">إلغاء</Button>
              <Button>حفظ التغييرات</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;