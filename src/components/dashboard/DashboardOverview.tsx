
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
  AlertTriangle,
} from 'lucide-react';
import { convertEnglishToArabicNumbers } from '../../utils/arabicUtils';
import { useDashboardStats } from '../../hooks/useDashboardStats';

const DashboardOverview: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-judicial-dark">لوحة المعلومات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
              {convertEnglishToArabicNumbers(stats.activeExperts)} خبير نشط
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
                من إجمالي {convertEnglishToArabicNumbers(stats.totalCases)} قضية
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
                تم إنجازها بنجاح
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
              <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
              <p className="text-xs text-amber-500">
                في انتظار المعالجة
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">الشكاوى المفتوحة</CardTitle>
            <Calendar className="h-5 w-5 text-judicial-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {convertEnglishToArabicNumbers(stats.openComplaints)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              من إجمالي {convertEnglishToArabicNumbers(stats.totalComplaints)} شكوى
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
              {convertEnglishToArabicNumbers(stats.estateDivisions)} قسمة تركة
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>إحصائيات النظام</CardTitle>
            <CardDescription>نظرة عامة على أداء النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-judicial-primary">
                  {convertEnglishToArabicNumbers(stats.totalExperts)}
                </div>
                <div className="text-sm text-muted-foreground">خبراء</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-judicial-primary">
                  {convertEnglishToArabicNumbers(stats.totalCases)}
                </div>
                <div className="text-sm text-muted-foreground">قضايا</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-judicial-primary">
                  {convertEnglishToArabicNumbers(stats.totalComplaints)}
                </div>
                <div className="text-sm text-muted-foreground">شكاوى</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-judicial-primary">
                  {convertEnglishToArabicNumbers(Math.round((stats.completedCases / Math.max(stats.totalCases, 1)) * 100))}%
                </div>
                <div className="text-sm text-muted-foreground">معدل الإنجاز</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
