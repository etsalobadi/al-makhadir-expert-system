
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  FileText, 
  Users, 
  Calendar,
  ArrowRight
} from 'lucide-react';

const WelcomeSection: React.FC = () => {
  const { user, userRoles } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('admin')) return 'مدير النظام';
    if (roles.includes('staff')) return 'موظف';
    if (roles.includes('judge')) return 'قاضي';
    if (roles.includes('expert')) return 'خبير';
    if (roles.includes('notary')) return 'موثق';
    if (roles.includes('inheritance_officer')) return 'مسؤول مواريث';
    return 'مستخدم';
  };

  const handleQuickAction = (actionTitle: string) => {
    switch (actionTitle) {
      case 'قضية جديدة':
        navigate('/cases');
        break;
      case 'إعلان قضائي':
        navigate('/announcements');
        break;
      case 'تسجيل خبير':
        navigate('/experts');
        break;
      case 'جدولة جلسة':
        navigate('/sessions');
        break;
      default:
        break;
    }
  };

  const quickActions = [
    {
      title: 'قضية جديدة',
      description: 'إضافة قضية جديدة للنظام',
      icon: Plus,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      roles: ['admin', 'staff', 'judge']
    },
    {
      title: 'إعلان قضائي',
      description: 'نشر إعلان قضائي جديد',
      icon: FileText,
      color: 'bg-green-50 text-green-600 border-green-200',
      roles: ['admin', 'staff', 'judge']
    },
    {
      title: 'تسجيل خبير',
      description: 'إضافة خبير جديد',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      roles: ['admin', 'staff']
    },
    {
      title: 'جدولة جلسة',
      description: 'تحديد موعد جلسة قادمة',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      roles: ['admin', 'staff', 'judge']
    }
  ];

  const hasAccess = (roles: string[]) => {
    return roles.some(role => userRoles.includes(role as any));
  };

  const accessibleActions = quickActions.filter(action => hasAccess(action.roles));

  return (
    <div className="mb-8">
      {/* Welcome Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مرحباً، {user?.email?.split('@')[0] || 'المستخدم'}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {getRoleDisplayName(userRoles)}
              </Badge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {new Date().toLocaleDateString('ar-SA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {accessibleActions.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">الإجراءات السريعة</h3>
            <p className="text-gray-600">اختصارات للمهام الأكثر استخداماً</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {accessibleActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickAction(action.title)}
                    className={`h-auto p-4 flex flex-col items-start gap-3 hover:shadow-md transition-all duration-200 ${action.color}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className="w-5 h-5" />
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="text-left w-full">
                      <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                      <p className="text-xs opacity-80 text-right">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomeSection;
