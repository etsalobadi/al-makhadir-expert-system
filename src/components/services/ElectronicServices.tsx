
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Send, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Database,
  Phone,
  Mail
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  type: 'evaluation' | 'analysis' | 'consultation';
  case_number: string;
  requestor: string;
  expert_assigned?: string;
  status: 'new' | 'processing' | 'completed' | 'pending_review';
  created_at: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface SystemIntegration {
  id: string;
  system_name: string;
  status: 'connected' | 'disconnected' | 'error';
  last_sync: string;
  data_count: number;
}

const ElectronicServices: React.FC = () => {
  const { user, hasAnyRole, hasRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [requests] = useState<ServiceRequest[]>([
    {
      id: '1',
      type: 'evaluation',
      case_number: 'CASE-2025-001',
      requestor: 'القاضي أحمد محمد',
      expert_assigned: 'خبير المواريث',
      status: 'processing',
      created_at: '2025-01-15T10:00:00Z',
      description: 'تقييم تركة المتوفى وتوزيع الأصول',
      priority: 'high'
    },
    {
      id: '2',
      type: 'consultation',
      case_number: 'CASE-2025-002',
      requestor: 'المحكمة العليا',
      status: 'new',
      created_at: '2025-01-14T14:30:00Z',
      description: 'استشارة قانونية حول قضية معقدة',
      priority: 'urgent'
    }
  ]);

  const [integrations] = useState<SystemIntegration[]>([
    {
      id: '1',
      system_name: 'النظام القضائي المركزي',
      status: 'connected',
      last_sync: '2025-01-15T12:00:00Z',
      data_count: 1250
    },
    {
      id: '2',
      system_name: 'نظام المحاكم الابتدائية',
      status: 'connected',
      last_sync: '2025-01-15T11:45:00Z',
      data_count: 890
    },
    {
      id: '3',
      system_name: 'سجل الأحوال المدنية',
      status: 'error',
      last_sync: '2025-01-14T16:20:00Z',
      data_count: 0
    }
  ]);

  const getRequestTypeLabel = (type: string) => {
    const types = {
      evaluation: 'تقييم',
      analysis: 'تحليل',
      consultation: 'استشارة'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">جديد</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500">قيد المعالجة</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">مكتمل</Badge>;
      case 'pending_review':
        return <Badge className="bg-purple-500">في انتظار المراجعة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500">عاجل</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">عالي</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-gray-500">منخفض</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getSystemStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 ml-1" />
            متصل
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge className="bg-gray-500">
            <Clock className="h-3 w-3 ml-1" />
            غير متصل
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="h-3 w-3 ml-1" />
            خطأ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const newRequests = requests.filter(r => r.status === 'new');
  const processingRequests = requests.filter(r => r.status === 'processing');
  const completedRequests = requests.filter(r => r.status === 'completed');

  // Service Action Handlers
  const handleAssignExpert = async (requestId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "تم إرسال الطلب للخبير",
        description: "تم إرسال الطلب للخبير المختص بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال الطلب للخبير",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRequestDetails = (request: ServiceRequest) => {
    toast({
      title: "تفاصيل الطلب",
      description: `رقم القضية: ${request.case_number}\nالحالة: ${request.status}`
    });
  };

  const handleSyncIntegration = async (integrationId: string, systemName: string) => {
    try {
      setIsLoading(true);
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "تمت المزامنة بنجاح",
        description: `تم تحديث بيانات ${systemName} بنجاح`
      });
    } catch (error) {
      toast({
        title: "خطأ في المزامنة",
        description: "حدث خطأ أثناء مزامنة البيانات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrationSettings = (systemName: string) => {
    toast({
      title: "إعدادات النظام",
      description: `فتح إعدادات ${systemName}`
    });
  };

  const handleCreateSummons = () => {
    toast({
      title: "إنشاء استدعاء جديد",
      description: "سيتم فتح نموذج إنشاء استدعاء الخبراء"
    });
  };

  const handleViewReports = () => {
    toast({
      title: "عرض التقارير",
      description: "سيتم عرض التقارير المتاحة للتحميل"
    });
  };

  const handleExportData = () => {
    toast({
      title: "تصدير البيانات",
      description: "جاري تحضير البيانات للتصدير..."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            الخدمات الإلكترونية
          </CardTitle>
          <p className="text-blue-100">
            نظام التكامل مع الأنظمة القضائية والخدمات الإلكترونية
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">طلبات الخدمة</TabsTrigger>
          <TabsTrigger value="integration">التكامل</TabsTrigger>
          <TabsTrigger value="summons">الاستدعاءات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        {/* Service Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">طلبات جديدة</p>
                    <p className="text-2xl font-bold text-blue-600">{newRequests.length}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">قيد المعالجة</p>
                    <p className="text-2xl font-bold text-yellow-600">{processingRequests.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">مكتملة</p>
                    <p className="text-2xl font-bold text-green-600">{completedRequests.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {request.case_number}
                        </h3>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                        <Badge variant="outline">
                          {getRequestTypeLabel(request.type)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        مقدم الطلب: {request.requestor}
                      </p>
                      
                      {request.expert_assigned && (
                        <p className="text-gray-600 mb-2">
                          الخبير المعين: {request.expert_assigned}
                        </p>
                      )}
                      
                      <p className="text-gray-700 mb-3">
                        {request.description}
                      </p>
                      
                      <p className="text-sm text-gray-500">
                        تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-YE')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {hasRole('judge') && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignExpert(request.id)}
                          disabled={isLoading}
                        >
                          <Send className="h-4 w-4 ml-1" />
                          إرسال للخبير
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewRequestDetails(request)}
                        disabled={isLoading}
                      >
                        <FileText className="h-4 w-4 ml-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Integration Tab */}
        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {integration.system_name}
                    {getSystemStatusBadge(integration.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">آخر مزامنة:</span>
                      <span className="text-sm">
                        {new Date(integration.last_sync).toLocaleString('ar-YE')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">عدد السجلات:</span>
                      <span className="text-sm font-semibold">
                        {integration.data_count.toLocaleString('ar-YE')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSyncIntegration(integration.id, integration.system_name)}
                        disabled={isLoading}
                      >
                        مزامنة
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleIntegrationSettings(integration.system_name)}
                        disabled={isLoading}
                      >
                        إعدادات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expert Summons Tab */}
        <TabsContent value="summons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                نظام استدعاء الخبراء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  واجهة مخصصة للقضاة لإرسال طلبات مباشرة للخبراء
                </p>
                <Button
                  onClick={handleCreateSummons}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4 ml-2" />
                  إنشاء استدعاء جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Direct Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الربط المباشر بالتقارير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  تمكين المحكمة من تحميل تقارير الخبراء مباشرة دون تعديل
                </p>
                <Button
                  onClick={handleViewReports}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 ml-2" />
                  عرض التقارير المتاحة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectronicServices;
