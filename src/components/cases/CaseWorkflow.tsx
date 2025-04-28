
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../../utils/helpers';
import { CASE_STATUS } from '../../utils/constants';
import { Eye, FileText, MoreHorizontal, Search, UserPlus } from 'lucide-react';

// Mock cases data
const mockCases = [
  {
    id: 'C001',
    title: 'قسمة تركة المرحوم عبدالله محمد',
    type: 'مواريث',
    status: CASE_STATUS.IN_PROGRESS,
    assignedTo: 'محمد قائد صالح',
    openDate: '2024-04-18',
    deadline: '2024-05-20',
  },
  {
    id: 'C002',
    title: 'نزاع على ملكية أرض في منطقة الحصين',
    type: 'عقارات',
    status: CASE_STATUS.NEW,
    assignedTo: null,
    openDate: '2024-04-20',
    deadline: '2024-06-01',
  },
  {
    id: 'C003',
    title: 'تقدير أضرار عقار متضرر',
    type: 'هندسة',
    status: CASE_STATUS.ASSIGNED,
    assignedTo: 'أحمد محمد علي',
    openDate: '2024-04-10',
    deadline: '2024-05-15',
  },
  {
    id: 'C004',
    title: 'قسمة تركة المرحومة فاطمة أحمد',
    type: 'مواريث',
    status: CASE_STATUS.COMPLETED,
    assignedTo: 'محمد قائد صالح',
    openDate: '2024-03-15',
    deadline: '2024-04-15',
  },
  {
    id: 'C005',
    title: 'تقييم مالي لشركة تضامن',
    type: 'محاسبة',
    status: CASE_STATUS.PENDING_REVIEW,
    assignedTo: 'سارة عبدالله محمد',
    openDate: '2024-04-05',
    deadline: '2024-05-05',
  },
];

const CaseWorkflow: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [cases] = useState(mockCases);
  
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.title.includes(searchTerm) ||
      caseItem.id.includes(searchTerm) ||
      (caseItem.assignedTo && caseItem.assignedTo.includes(searchTerm));
    
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesType = filterType === 'all' || caseItem.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case CASE_STATUS.NEW:
        return <Badge className="bg-blue-500 hover:bg-blue-600">جديدة</Badge>;
      case CASE_STATUS.ASSIGNED:
        return <Badge className="bg-purple-500 hover:bg-purple-600">معينة</Badge>;
      case CASE_STATUS.IN_PROGRESS:
        return <Badge className="bg-amber-500 hover:bg-amber-600">قيد التنفيذ</Badge>;
      case CASE_STATUS.PENDING_REVIEW:
        return <Badge className="bg-cyan-500 hover:bg-cyan-600">قيد المراجعة</Badge>;
      case CASE_STATUS.COMPLETED:
        return <Badge className="bg-green-500 hover:bg-green-600">مكتملة</Badge>;
      case CASE_STATUS.CLOSED:
        return <Badge className="bg-gray-500 hover:bg-gray-600">مغلقة</Badge>;
      case CASE_STATUS.CANCELLED:
        return <Badge className="bg-red-500 hover:bg-red-600">ملغية</Badge>;
      default:
        return <Badge>غير معروفة</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>القضايا والمهام</CardTitle>
            <CardDescription>إدارة ومتابعة القضايا والمهام المسندة للخبراء</CardDescription>
          </div>
          <Button className="bg-judicial-primary w-full md:w-auto">
            <FileText className="h-4 w-4 ml-2" />
            إضافة قضية جديدة
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن قضية"
                className="pl-2 pr-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="حالة القضية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value={CASE_STATUS.NEW}>جديدة</SelectItem>
                <SelectItem value={CASE_STATUS.ASSIGNED}>معينة</SelectItem>
                <SelectItem value={CASE_STATUS.IN_PROGRESS}>قيد التنفيذ</SelectItem>
                <SelectItem value={CASE_STATUS.PENDING_REVIEW}>قيد المراجعة</SelectItem>
                <SelectItem value={CASE_STATUS.COMPLETED}>مكتملة</SelectItem>
                <SelectItem value={CASE_STATUS.CLOSED}>مغلقة</SelectItem>
                <SelectItem value={CASE_STATUS.CANCELLED}>ملغية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger>
                <SelectValue placeholder="نوع القضية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="مواريث">مواريث</SelectItem>
                <SelectItem value="عقارات">عقارات</SelectItem>
                <SelectItem value="هندسة">هندسة</SelectItem>
                <SelectItem value="محاسبة">محاسبة</SelectItem>
                <SelectItem value="طب">طب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم القضية</TableHead>
                <TableHead className="text-right">عنوان القضية</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الخبير المسند</TableHead>
                <TableHead className="text-right">تاريخ الفتح</TableHead>
                <TableHead className="text-right">الموعد النهائي</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    لا توجد قضايا تطابق معايير البحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {caseItem.title}
                    </TableCell>
                    <TableCell>{caseItem.type}</TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>
                      {caseItem.assignedTo ? (
                        caseItem.assignedTo
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-judicial-primary"
                        >
                          <UserPlus className="h-4 w-4 ml-1" />
                          تعيين خبير
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(caseItem.openDate)}</TableCell>
                    <TableCell>{formatDate(caseItem.deadline)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 ml-2" />
                            عرض التقارير
                          </DropdownMenuItem>
                          {!caseItem.assignedTo && (
                            <DropdownMenuItem>
                              <UserPlus className="h-4 w-4 ml-2" />
                              تعيين خبير
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseWorkflow;
