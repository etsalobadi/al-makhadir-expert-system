
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '@/components/ui/status-card';
import { useDashboardStats } from '@/hooks/useDashboardStats';
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
  const navigate = useNavigate();
  const { stats } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatusCard
        title="إجمالي القضايا"
        count={stats.totalCases}
        description="القضايا المسجلة"
        icon={Scale}
        variant="primary"
        trend={{
          value: Math.round((stats.activeCases / Math.max(stats.totalCases, 1)) * 100),
          label: `${stats.activeCases} قضية نشطة`,
          direction: "up"
        }}
        action={{
          label: "عرض التفاصيل",
          onClick: () => navigate("/cases")
        }}
      />
      
      <StatusCard
        title="الخبراء المسجلين"
        count={stats.totalExperts}
        description="خبير معتمد"
        icon={Users}
        variant="success"
        trend={{
          value: stats.activeExperts,
          label: "خبير نشط",
          direction: "up"
        }}
        action={{
          label: "إدارة الخبراء",
          onClick: () => navigate("/experts")
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
          onClick: () => navigate("/sessions")
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
          onClick: () => navigate("/announcements")
        }}
      />
    </div>
  );
};

export default DashboardStats;
