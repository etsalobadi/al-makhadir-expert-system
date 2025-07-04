
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, Filter, Search, Eye, AlertCircle, ChevronUp, ChevronDown, Printer, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAnnouncements, Announcement } from '@/hooks/useAnnouncements';
import { useFilteredAnnouncements } from '@/hooks/useFilteredAnnouncements';
import JudicialNoticeForm from './JudicialNoticeForm';
import AnnouncementDetailsDialog from './AnnouncementDetailsDialog';

const JudicialAnnouncements: React.FC = () => {
  const { announcements, isLoading, error, refetch } = useAnnouncements();
  const {
    filteredAnnouncements,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    courtFilter,
    setCourtFilter,
    dateRange,
    setDateRange,
    sortField,
    sortDirection,
    handleSort,
    resetFilters
  } = useFilteredAnnouncements(announcements);
  
  const [activeTab, setActiveTab] = useState('announcements');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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

  const handleExportData = () => {
    const csvData = filteredAnnouncements.map(announcement => ({
      'رقم القضية': announcement.caseNumber,
      'المحكمة': announcement.court,
      'المُعلن': announcement.announcer,
      'تاريخ الجلسة': format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar }),
      'نوع الإعلان': announcement.announcementType,
      'الحالة': announcement.status,
      'آخر تحديث': format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar }),
      'الوصف': announcement.description
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `judicial_announcements_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewTable = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  const handleDownloadAnnouncement = (announcement: Announcement, fileFormat: 'pdf' | 'word' = 'pdf') => {
    if (fileFormat === 'pdf') {
      handlePrintSingle(announcement);
    } else {
      // Word format export
      const content = `
        إعلان قضائي
        
        رقم القضية: ${announcement.caseNumber}
        المحكمة: ${announcement.court}
        المُعلن: ${announcement.announcer}
        تاريخ الجلسة: ${format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}
        نوع الإعلان: ${announcement.announcementType}
        الوصف: ${announcement.description}
        آخر تحديث: ${format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}
      `;
      
      const blob = new Blob([content], { type: 'application/msword' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `announcement_${announcement.caseNumber}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadPDF = (announcementId: string) => {
    const announcement = filteredAnnouncements.find(a => a.id === announcementId);
    if (announcement) {
      handleDownloadAnnouncement(announcement, 'pdf');
    }
  };

  const handleViewDetails = (announcementId: string) => {
    const announcement = filteredAnnouncements.find(a => a.id === announcementId);
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setShowDetailsDialog(true);
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  const handlePrintSingle = (announcement: any) => {
    // Create a new window with just the announcement data
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>طباعة الإعلان</title>
            <style>
              body {
                font-family: 'Cairo', sans-serif;
                direction: rtl;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: right;
              }
              th {
                background-color: #f5f5f5;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>نظام إدارة الخبراء والقضايا القضائية</h1>
              <h2>إعلان قضائي</h2>
            </div>
            <table>
              <tr><th>رقم القضية</th><td>${announcement.caseNumber}</td></tr>
              <tr><th>المحكمة</th><td>${announcement.court}</td></tr>
              <tr><th>المُعلن</th><td>${announcement.announcer}</td></tr>
              <tr><th>تاريخ الجلسة</th><td>${format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}</td></tr>
              <tr><th>نوع الإعلان</th><td>${announcement.announcementType}</td></tr>
              <tr><th>الوصف</th><td>${announcement.description}</td></tr>
              <tr><th>آخر تحديث</th><td>${format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}</td></tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body {
            direction: rtl;
            font-family: 'Noto Sans Arabic', sans-serif;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #f5f5f5;
          }
          .official-notice {
            max-width: 100%;
            margin: 0;
            padding: 15px;
          }
          .official-notice table {
            font-size: 12px;
          }
          .official-notice td {
            padding: 8px;
          }
        }
      `}</style>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الإعلانات القضائية</h1>
            <p className="text-gray-600 mt-2">إدارة ومتابعة الإعلانات القضائية للمحكمة</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>
            <Button onClick={handleViewTable} variant="outline">
              <Eye className="w-4 h-4 ml-2" />
              {viewMode === 'table' ? 'عرض في بطاقات' : 'عرض في جدول'}
            </Button>
            <Button onClick={handlePrintAll}>
              <Printer className="w-4 h-4 ml-2" />
              طباعة الكل
            </Button>
          </div>
        </div>

        {/* Tabs for different functionalities */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              عرض الإعلانات
            </TabsTrigger>
            <TabsTrigger value="create-notice" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              إنشاء إعلان قضائي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-6">
            {/* Filters */}
            <Card className="no-print">
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
              <CardHeader className="no-print">
                <div className="flex items-center justify-between">
                  <CardTitle>نتائج البحث ({filteredAnnouncements.length})</CardTitle>
                  <Button variant="outline" onClick={resetFilters}>
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-judicial-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الإعلانات...</p>
                  </div>
                ) : viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-medium"
                              onClick={() => handleSort('caseNumber')}
                            >
                              رقم القضية
                              {getSortIcon('caseNumber')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-medium"
                              onClick={() => handleSort('court')}
                            >
                              المحكمة
                              {getSortIcon('court')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-medium"
                              onClick={() => handleSort('announcer')}
                            >
                              المُعلن
                              {getSortIcon('announcer')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-medium"
                              onClick={() => handleSort('sessionDate')}
                            >
                              تاريخ الجلسة
                              {getSortIcon('sessionDate')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">نوع الإعلان</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">آخر تحديث</TableHead>
                          <TableHead className="text-right no-print">الإجراءات</TableHead>
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
                            <TableCell className="no-print">
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
                                  onClick={() => handlePrintSingle(announcement)}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => handleDownloadAnnouncement(announcement, 'pdf')}
                                   title="تحميل PDF"
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{announcement.announcementType}</h3>
                          {getStatusBadge(announcement.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">القضية: {announcement.caseNumber}</p>
                        <p className="text-gray-700 mb-3 line-clamp-2">{announcement.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span>{announcement.court}</span>
                          <span>{format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(announcement.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePrintSingle(announcement)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadAnnouncement(announcement, 'pdf')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && filteredAnnouncements.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
                    <p className="text-gray-600">لم يتم العثور على إعلانات تطابق معايير البحث المحددة.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-notice">
            <JudicialNoticeForm />
          </TabsContent>
        </Tabs>

        {/* Announcement Details Dialog */}
        <AnnouncementDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          announcement={selectedAnnouncement}
        />
      </div>
    </>
  );
};

export default JudicialAnnouncements;
