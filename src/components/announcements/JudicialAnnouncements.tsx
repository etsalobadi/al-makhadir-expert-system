
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Download, Filter, Search, Eye, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface Announcement {
  id: string;
  caseNumber: string;
  court: string;
  announcer: string;
  sessionDate: Date;
  announcementType: string;
  status: 'active' | 'expired' | 'updated';
  lastUpdate: Date;
  description: string;
}

const JudicialAnnouncements: React.FC = () => {
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      caseNumber: 'قضية-2024-001',
      court: 'المحكمة الابتدائية بالمخادر',
      announcer: 'القاضي أحمد السعيد',
      sessionDate: new Date('2024-01-15'),
      announcementType: 'استدعاء خبير',
      status: 'active',
      lastUpdate: new Date('2024-01-10'),
      description: 'استدعاء خبير هندسي لفحص العقار'
    },
    {
      id: '2',
      caseNumber: 'قضية-2024-002',
      court: 'المحكمة الابتدائية بالمخادر',
      announcer: 'القاضي فاطمة الزهراء',
      sessionDate: new Date('2024-01-20'),
      announcementType: 'إعلان جلسة',
      status: 'active',
      lastUpdate: new Date('2024-01-12'),
      description: 'إعلان جلسة محاكمة'
    }
  ]);

  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const announcementTypes = [
    'استدعاء خبير',
    'إعلان جلسة',
    'تأجيل جلسة',
    'إنذار',
    'تبليغ حكم'
  ];

  const courts = [
    'المحكمة الابتدائية بالمخادر',
    'محكمة الاستئناف',
    'المحكمة العليا'
  ];

  React.useEffect(() => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.caseNumber.includes(searchTerm) ||
        announcement.announcer.includes(searchTerm) ||
        announcement.description.includes(searchTerm)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.announcementType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.status === statusFilter);
    }

    if (courtFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.court === courtFilter);
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(announcement => 
        announcement.sessionDate >= dateRange.from! && 
        announcement.sessionDate <= dateRange.to!
      );
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, typeFilter, statusFilter, courtFilter, dateRange, announcements]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">منتهي الصلاحية</Badge>;
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800">محدث</Badge>;
      default:
        return <Badge>غير محدد</Badge>;
    }
  };

  const handleDownloadPDF = (announcementId: string) => {
    console.log('تنزيل PDF للإعلان:', announcementId);
    // TODO: Implement PDF download functionality
  };

  const handleViewDetails = (announcementId: string) => {
    console.log('عرض تفاصيل الإعلان:', announcementId);
    // TODO: Implement view details functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعلانات القضائية</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة الإعلانات القضائية</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Download className="w-4 h-4 ml-2" />
            تصدير البيانات
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في الإعلانات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الإعلان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {announcementTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الإعلان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                <SelectItem value="updated">محدث</SelectItem>
              </SelectContent>
            </Select>

            {/* Court Filter */}
            <Select value={courtFilter} onValueChange={setCourtFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المحكمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المحاكم</SelectItem>
                {courts.map(court => (
                  <SelectItem key={court} value={court}>{court}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "PPP", { locale: ar })} -{" "}
                          {format(dateRange.to, "PPP", { locale: ar })}
                        </>
                      ) : (
                        format(dateRange.from, "PPP", { locale: ar })
                      )
                    ) : (
                      <span>اختر نطاق التاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>نتائج البحث ({filteredAnnouncements.length})</CardTitle>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setStatusFilter('all');
              setCourtFilter('all');
              setDateRange(undefined);
            }}>
              إعادة تعيين الفلاتر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم القضية</TableHead>
                  <TableHead className="text-right">المحكمة</TableHead>
                  <TableHead className="text-right">المُعلن</TableHead>
                  <TableHead className="text-right">تاريخ الجلسة</TableHead>
                  <TableHead className="text-right">نوع الإعلان</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">آخر تحديث</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">
                      {announcement.caseNumber}
                    </TableCell>
                    <TableCell>{announcement.court}</TableCell>
                    <TableCell>{announcement.announcer}</TableCell>
                    <TableCell>
                      {format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}
                    </TableCell>
                    <TableCell>{announcement.announcementType}</TableCell>
                    <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                    <TableCell>
                      {format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(announcement.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(announcement.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
              <p className="text-gray-600">لم يتم العثور على إعلانات تطابق معايير البحث المحددة.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JudicialAnnouncements;
