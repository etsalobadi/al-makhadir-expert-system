
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Gavel,
} from 'lucide-react';
import { convertEnglishToArabicNumbers } from '../../utils/arabicUtils';

const DashboardOverview: React.FC = () => {
  // Mock data - would come from API in a real application
  const stats = {
    totalExperts: 24,
    activeCases: 42,
    completedCases: 156,
    pendingCases: 18,
    upcomingHearings: 7,
    inheritanceCases: 31,
  };

  // Mock bar chart data
  const monthlyData = [
    { month: 'يناير', cases: 12 },
    { month: 'فبراير', cases: 19 },
    { month: 'مارس', cases: 15 },
    { month: 'أبريل', cases: 22 },
    { month: 'مايو', cases: 28 },
    { month: 'يونيو', cases: 24 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-judicial-dark">لوحة المعلومات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">الخبراء المسجلين</CardTitle>
            <Users className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.totalExperts)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              تم إضافة ٣ خبراء جدد هذا الشهر
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">القضايا النشطة</CardTitle>
            <FileText className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.activeCases)}
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                زيادة بنسبة ٨٪ عن الشهر السابق
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">القضايا المكتملة</CardTitle>
            <CheckCircle className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.completedCases)}
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                إنجاز ١٢ قضية هذا الشهر
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">القضايا المعلقة</CardTitle>
            <Clock className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.pendingCases)}
            </div>
            <div className="flex items-center mt-2">
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              <p className="text-xs text-red-500">
                ٥ قضايا متأخرة عن الموعد
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">الجلسات القادمة</CardTitle>
            <Calendar className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.upcomingHearings)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ٣ جلسات في الأسبوع القادم
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">قضايا المواريث</CardTitle>
            <Gavel className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.inheritanceCases)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              تم إكمال ٤ قضايا هذا الشهر
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>إحصائيات القضايا</CardTitle>
            <CardDescription>توزيع القضايا خلال الـ 6 أشهر الماضية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-judicial-primary rounded-t-md w-12 transition-all duration-500"
                    style={{ 
                      height: `${(item.cases / 30) * 200}px`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                  <div className="mt-2 text-sm">{item.month}</div>
                  <div className="text-xs font-medium">{convertEnglishToArabicNumbers(item.cases)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
