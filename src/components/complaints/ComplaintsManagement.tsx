
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface Complaint {
  id: string;
  title: string;
  description: string;
  type: 'technical' | 'administrative' | 'legal' | 'other';
  status: 'open' | 'processing' | 'resolved' | 'closed';
  submittedBy: string;
  submittedDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
}

const ComplaintsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock data - in real app, this would come from API
  const complaints: Complaint[] = [
    {
      id: '1',
      title: 'مشكلة في النظام التقني',
      description: 'عدم قدرة على الوصول إلى النظام منذ هذا الصباح',
      type: 'technical',
      status: 'open',
      submittedBy: 'أحمد محمد',
      submittedDate: new Date('2024-01-15'),
      priority: 'high'
    },
    {
      id: '2',
      title: 'طلب تعديل بيانات خبير',
      description: 'طلب تحديث معلومات الخبير في النظام',
      type: 'administrative',
      status: 'processing',
      submittedBy: 'فاطمة أحمد',
      submittedDate: new Date('2024-01-14'),
      priority: 'medium',
      assignedTo: 'مدير النظام'
    },
    {
      id: '3',
      title: 'استفسار قانوني',
      description: 'استفسار حول إجراءات قسمة المواريث',
      type: 'legal',
      status: 'resolved',
      submittedBy: 'محمد علي',
      submittedDate: new Date('2024-01-13'),
      priority: 'low'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'مفتوحة', className: 'bg-red-100 text-red-800' },
      processing: { label: 'قيد المعالجة', className: 'bg-yellow-100 text-yellow-800' },
      resolved: { label: 'محلولة', className: 'bg-green-100 text-green-800' },
      closed: { label: 'مغلقة', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'منخفضة', className: 'bg-blue-100 text-blue-800' },
      medium: { label: 'متوسطة', className: 'bg-orange-100 text-orange-800' },
      high: { label: 'عالية', className: 'bg-red-100 text-red-800' },
      urgent: { label: 'عاجلة', className: 'bg-purple-100 text-purple-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      technical: 'تقنية',
      administrative: 'إدارية',
      legal: 'قانونية',
      other: 'أخرى'
    };
    return typeLabels[type as keyof typeof typeLabels];
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-judicial-primary">إدارة الشكاوى</h1>
          <p className="text-gray-600 mt-2">متابعة ومعالجة شكاوى المستخدمين</p>
        </div>
        <Button className="bg-judicial-primary hover:bg-judicial-primary/90">
          <Plus className="w-4 h-4 ml-2" />
          شكوى جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الشكاوى</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">محلولة</p>
                <p className="text-2xl font-bold text-gray-900">98</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">معدل الحل</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>فلترة الشكاوى</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الشكاوى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="open">مفتوحة</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">محلولة</SelectItem>
                <SelectItem value="closed">مغلقة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="technical">تقنية</SelectItem>
                <SelectItem value="administrative">إدارية</SelectItem>
                <SelectItem value="legal">قانونية</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الشكاوى</CardTitle>
          <CardDescription>
            عرض جميع الشكاوى المسجلة في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>المقدم</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.title}</TableCell>
                  <TableCell>{getTypeLabel(complaint.type)}</TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                  <TableCell>{complaint.submittedBy}</TableCell>
                  <TableCell>{formatDate(complaint.submittedDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        عرض
                      </Button>
                      <Button variant="outline" size="sm">
                        تحديث
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsManagement;
