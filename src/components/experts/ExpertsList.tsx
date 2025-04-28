
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, MoreHorizontal, Search, Trash, UserCheck, UserX } from 'lucide-react';
import { EXPERT_STATUS } from '../../utils/constants';
import { showSuccess } from '../../utils/helpers';

// Mock experts data
const mockExperts = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    specialty: 'هندسة',
    phone: '772123456',
    email: 'ahmed@example.com',
    status: EXPERT_STATUS.ACTIVE,
  },
  {
    id: '2',
    name: 'سارة عبدالله محمد',
    specialty: 'محاسبة',
    phone: '771234567',
    email: 'sara@example.com',
    status: EXPERT_STATUS.ACTIVE,
  },
  {
    id: '3',
    name: 'علي يحيى حسين',
    specialty: 'عقارات',
    phone: '773456789',
    email: 'ali@example.com',
    status: EXPERT_STATUS.PENDING,
  },
  {
    id: '4',
    name: 'فاطمة سعيد أحمد',
    specialty: 'طب',
    phone: '774567890',
    email: 'fatima@example.com',
    status: EXPERT_STATUS.SUSPENDED,
  },
  {
    id: '5',
    name: 'محمد قائد صالح',
    specialty: 'مواريث',
    phone: '775678901',
    email: 'mohammed@example.com',
    status: EXPERT_STATUS.EXPIRED,
  },
];

const ExpertsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [experts] = useState(mockExperts);
  
  const filteredExperts = experts.filter(expert => 
    expert.name.includes(searchTerm) || 
    expert.email.includes(searchTerm) || 
    expert.specialty.includes(searchTerm)
  );
  
  const handleStatusChange = (id: string, newStatus: string) => {
    console.log(`Changing expert ${id} status to ${newStatus}`);
    showSuccess('تم تغيير حالة الخبير بنجاح');
  };
  
  const handleDelete = (id: string) => {
    console.log(`Deleting expert ${id}`);
    showSuccess('تم حذف الخبير بنجاح');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case EXPERT_STATUS.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>;
      case EXPERT_STATUS.PENDING:
        return <Badge className="bg-amber-500 hover:bg-amber-600">معلق</Badge>;
      case EXPERT_STATUS.SUSPENDED:
        return <Badge className="bg-red-500 hover:bg-red-600">موقوف</Badge>;
      case EXPERT_STATUS.EXPIRED:
        return <Badge className="bg-gray-500 hover:bg-gray-600">منتهي</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>قائمة الخبراء</CardTitle>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="relative w-64">
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن خبير"
              className="pl-2 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-judicial-primary">إضافة خبير</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">رقم الهاتف</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    لا توجد نتائج للبحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell className="font-medium">{expert.name}</TableCell>
                    <TableCell>{expert.specialty}</TableCell>
                    <TableCell>{expert.phone}</TableCell>
                    <TableCell>{expert.email}</TableCell>
                    <TableCell>{getStatusBadge(expert.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" /> عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" /> تعديل
                          </DropdownMenuItem>
                          {expert.status !== EXPERT_STATUS.ACTIVE && (
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleStatusChange(expert.id, EXPERT_STATUS.ACTIVE)}
                            >
                              <UserCheck className="h-4 w-4" /> تنشيط
                            </DropdownMenuItem>
                          )}
                          {expert.status !== EXPERT_STATUS.SUSPENDED && (
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleStatusChange(expert.id, EXPERT_STATUS.SUSPENDED)}
                            >
                              <UserX className="h-4 w-4" /> إيقاف
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-red-500"
                            onClick={() => handleDelete(expert.id)}
                          >
                            <Trash className="h-4 w-4" /> حذف
                          </DropdownMenuItem>
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

export default ExpertsList;
