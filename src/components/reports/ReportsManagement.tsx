
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText, BarChart as BarChartIcon, Calendar, Users, FileSpreadsheet } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { useReports } from '@/hooks/useReports';

const ReportsManagement: React.FC = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const { reportData, loading, generateReport } = useReports();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-judicial-primary"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-8 text-gray-500">
        فشل في تحميل بيانات التقارير
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-judicial-primary">التقارير والإحصائيات</h1>
          <p className="text-gray-600 mt-2">تحليل البيانات وإنتاج التقارير الإدارية</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => generateReport('excel', reportType, dateRange)}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <FileSpreadsheet className="w-4 h-4 ml-2" />
            تصدير Excel
          </Button>
          <Button 
            onClick={() => generateReport('pdf', reportType, dateRange)}
            className="bg-judicial-primary hover:bg-judicial-primary/90"
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي القضايا</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.totalCases)}</p>
                <p className="text-xs text-green-600">+12% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الخبراء النشطون</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.activeExperts)}</p>
                <p className="text-xs text-green-600">+5% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChartIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">معدل الإنجاز</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.completionRate}%</p>
                <p className="text-xs text-red-600">-2% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط وقت الحل</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.averageResolutionTime} يوم</p>
                <p className="text-xs text-green-600">-3 أيام عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="نوع التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">نظرة عامة</SelectItem>
                <SelectItem value="cases">تقرير القضايا</SelectItem>
                <SelectItem value="experts">تقرير الخبراء</SelectItem>
                <SelectItem value="performance">تقرير الأداء</SelectItem>
                <SelectItem value="financial">التقرير المالي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">الأسبوع الحالي</SelectItem>
                <SelectItem value="month">الشهر الحالي</SelectItem>
                <SelectItem value="quarter">الربع الحالي</SelectItem>
                <SelectItem value="year">السنة الحالية</SelectItem>
                <SelectItem value="custom">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases Chart */}
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات القضايا الشهرية</CardTitle>
            <CardDescription>عرض تطور القضايا على مدار الأشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.casesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" name="مكتملة" />
                <Bar dataKey="pending" fill="#f59e0b" name="معلقة" />
                <Bar dataKey="new" fill="#3b82f6" name="جديدة" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Experts Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الخبراء حسب التخصص</CardTitle>
            <CardDescription>النسبة المئوية لكل تخصص</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.expertsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.expertsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>مؤشر الأداء الأسبوعي</CardTitle>
            <CardDescription>كفاءة النظام على مدار الأسبوع</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  name="الكفاءة %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Complaints Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الشكاوى</CardTitle>
          <CardDescription>نظرة عامة على الشكاوى في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{reportData.complaintsStats.total}</p>
              <p className="text-sm text-gray-600">إجمالي الشكاوى</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{reportData.complaintsStats.open}</p>
              <p className="text-sm text-gray-600">مفتوحة</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{reportData.complaintsStats.processing}</p>
              <p className="text-sm text-gray-600">قيد المعالجة</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{reportData.complaintsStats.resolved}</p>
              <p className="text-sm text-gray-600">محلولة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;
