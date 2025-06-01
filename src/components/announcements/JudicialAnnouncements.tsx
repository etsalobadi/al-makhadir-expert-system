
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon, 
  FileText, 
  Bell,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

interface Announcement {
  id: string;
  case_number: string;
  court_number: string;
  announcer_name: string;
  session_date: string;
  announcement_type: string;
  status: string;
  last_update: string;
  description?: string;
  created_at: string;
}

const JudicialAnnouncements: React.FC = () => {
  const { user, hasAnyRole } = useAuthContext();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [announcements, searchTerm, selectedType, selectedStatus, selectedCourt, dateRange]);

  const fetchAnnouncements = async () => {
    try {
      // For now, we'll create mock announcements since we don't have the table yet
      // In a real implementation, this would fetch from a dedicated announcements table
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          case_number: 'CFICICIVS2025/0002421',
          court_number: 'محكمة الشارقة الابتدائية - مدني',
          announcer_name: 'البحر الأسود لمقاولات الذكية والتجارة المسلحة',
          session_date: '2025-05-27T10:05:00',
          announcement_type: 'hearing',
          status: 'active',
          last_update: '2025-06-01T12:06:00',
          description: 'إعلان جلسة استماع',
          created_at: '2025-06-01T12:06:00'
        },
        {
          id: '2',
          case_number: 'CFICICIVS2025/0003185',
          court_number: 'محكمة الشارقة الابتدائية - مدني',
          announcer_name: 'داود بن سليمان بن طالب التنوي',
          session_date: '2025-05-28T15:15:00',
          announcement_type: 'decision',
          status: 'active',
          last_update: '2025-06-01T12:06:00',
          description: 'إعلان قرار',
          created_at: '2025-06-01T12:06:00'
        },
        {
          id: '3',
          case_number: 'KHCFISHPAF2025/0000053',
          court_number: 'محكمة خورفكان الابتدائية',
          announcer_name: 'رايا عبد التواب محمد سيف النبر',
          session_date: '2025-05-21T08:55:00',
          announcement_type: 'consultation',
          status: 'completed',
          last_update: '2025-06-01T10:06:00',
          description: 'طلب استشارة',
          created_at: '2025-06-01T10:06:00'
        }
      ];

      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...announcements];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ann => 
        ann.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.announcer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.court_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(ann => ann.announcement_type === selectedType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ann => ann.status === selectedStatus);
    }

    // Court filter
    if (selectedCourt !== 'all') {
      filtered = filtered.filter(ann => ann.court_number.includes(selectedCourt));
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(ann => {
        const annDate = new Date(ann.session_date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : new Date('1900-01-01');
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date('2100-12-31');
        return annDate >= fromDate && annDate <= toDate;
      });
    }

    setFilteredAnnouncements(filtered);
  };

  const getAnnouncementTypeLabel = (type: string) => {
    const types = {
      hearing: 'جلسة استماع',
      decision: 'قرار',
      consultation: 'استشارة',
      notification: 'إشعار'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 ml-1" />
            نشط
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 ml-1" />
            منتهي
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-500">
            <Clock className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      case 'updated':
        return (
          <Badge className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 ml-1" />
            محدث
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const downloadAsPDF = (announcement: Announcement) => {
    // Implement PDF download functionality
    console.log('Downloading PDF for announcement:', announcement.id);
  };

  const activeAnnouncements = filteredAnnouncements.filter(a => a.status === 'active');
  const completedAnnouncements = filteredAnnouncements.filter(a => a.status === 'completed');
  const expiredAnnouncements = filteredAnnouncements.filter(a => a.status === 'expired');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-judicial-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-judicial-primary to-amber-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            الإعلانات القضائية
          </CardTitle>
          <p className="text-amber-100">
            نظام إدارة الإعلانات والجلسات القضائية
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البحث</label>
              <div className="relative">
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="رقم القضية، المُعلن، المحكمة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نوع الإعلان</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="hearing">جلسة استماع</SelectItem>
                  <SelectItem value="decision">قرار</SelectItem>
                  <SelectItem value="consultation">استشارة</SelectItem>
                  <SelectItem value="notification">إشعار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="expired">منتهي</SelectItem>
                  <SelectItem value="updated">محدث</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">فترة زمنية</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 ml-2" />
                    تحديد التاريخ
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              عرض {filteredAnnouncements.length} من أصل {announcements.length} إعلان
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedCourt('all');
                setDateRange({});
              }}
            >
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">النشطة ({activeAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="completed">المكتملة ({completedAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="expired">المنتهية ({expiredAnnouncements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد إعلانات نشطة</p>
              </CardContent>
            </Card>
          ) : (
            activeAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {announcement.case_number}
                        </h3>
                        {getStatusBadge(announcement.status)}
                        <Badge variant="outline">
                          {getAnnouncementTypeLabel(announcement.announcement_type)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        المُعلن: {announcement.announcer_name}
                      </p>
                      
                      <p className="text-gray-600 mb-3">
                        المحكمة: {announcement.court_number}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>تاريخ الجلسة: {formatDate(new Date(announcement.session_date))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>آخر تحديث: {formatDate(new Date(announcement.last_update))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{announcement.description}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadAsPDF(announcement)}>
                        <Download className="h-4 w-4 ml-1" />
                        PDF
                      </Button>
                      <Button size="sm">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {announcement.case_number}
                      </h3>
                      {getStatusBadge(announcement.status)}
                    </div>
                    <p className="text-gray-600">{announcement.announcer_name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadAsPDF(announcement)}>
                    <Download className="h-4 w-4 ml-1" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="opacity-75">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {announcement.case_number}
                      </h3>
                      {getStatusBadge(announcement.status)}
                    </div>
                    <p className="text-gray-600">{announcement.announcer_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JudicialAnnouncements;
