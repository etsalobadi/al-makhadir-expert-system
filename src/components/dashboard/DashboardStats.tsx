
import React from 'react';
import { StatusCard } from '@/components/ui/status-card';
import { 
  FileText, 
  Users, 
  Calendar, 
  Scale,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatusCard
        title="إجمالي القضايا"
        count={1247}
        description="القضايا المسجلة"
        icon={Scale}
        variant="primary"
        trend={{
          value: 12,
          label: "زيادة هذا الشهر",
          direction: "up"
        }}
        action={{
          label: "عرض التفاصيل",
          onClick: () => console.log("View cases")
        }}
      />
      
      <StatusCard
        title="الخبراء المسجلين"
        count={89}
        description="خبير معتمد"
        icon={Users}
        variant="success"
        trend={{
          value: 5,
          label: "خبراء جدد",
          direction: "up"
        }}
        action={{
          label: "إدارة الخبراء",
          onClick: () => console.log("Manage experts")
        }}
      />
      
      <StatusCard
        title="الجلسات القادمة"
        count={24}
        description="خلال الأسبوع القادم"
        icon={Calendar}
        variant="warning"
        trend={{
          value: 3,
          label: "جلسات مؤجلة",
          direction: "down"
        }}
        action={{
          label: "عرض الجدول",
          onClick: () => console.log("View schedule")
        }}
      />
      
      <StatusCard
        title="الإعلانات النشطة"
        count={156}
        description="إعلان قضائي"
        icon={FileText}
        variant="default"
        trend={{
          value: 8,
          label: "إعلانات جديدة",
          direction: "up"
        }}
        action={{
          label: "إدارة الإعلانات",
          onClick: () => console.log("Manage announcements")
        }}
      />
    </div>
  );
};

export default DashboardStats;
