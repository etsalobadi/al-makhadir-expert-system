import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { CASE_STATUS } from '../../utils/constants';

interface CaseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: {
    id: string;
    title: string;
    type: string;
    status: string;
    assignedTo: string | null;
    openDate: string;
    deadline: string;
    description?: string;
    priority?: string;
  } | null;
}

const CaseDetailsDialog: React.FC<CaseDetailsDialogProps> = ({
  open,
  onOpenChange,
  caseData
}) => {
  if (!caseData) return null;

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

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">عاجلة</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">عالية</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">متوسطة</Badge>;
      case 'low':
        return <Badge variant="secondary">منخفضة</Badge>;
      default:
        return <Badge variant="secondary">غير محددة</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">تفاصيل القضية</DialogTitle>
          <DialogDescription>
            معلومات تفصيلية عن القضية رقم {caseData.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{caseData.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(caseData.status)}
                  {getPriorityBadge(caseData.priority)}
                  <Badge variant="outline">{caseData.type}</Badge>
                </div>
              </div>
              
              {caseData.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">الوصف:</h4>
                  <p className="text-gray-700">{caseData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline & Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  التواريخ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الفتح:</p>
                    <p className="font-medium">{formatDate(caseData.openDate)}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">الموعد النهائي:</p>
                    <p className="font-medium text-red-600">{formatDate(caseData.deadline)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  التعيين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-600">الخبير المسند:</p>
                    {caseData.assignedTo ? (
                      <p className="font-medium">{caseData.assignedTo}</p>
                    ) : (
                      <p className="text-gray-500 italic">غير مسندة</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Case History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">سجل القضية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">تم إنشاء القضية</p>
                    <p className="text-xs text-gray-500">{formatDate(caseData.openDate)} - النظام</p>
                  </div>
                </div>
                
                {caseData.assignedTo && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">تم تعيين خبير</p>
                      <p className="text-xs text-gray-500">تم تعيين {caseData.assignedTo}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">في انتظار المراجعة</p>
                    <p className="text-xs text-gray-500">القضية قيد المتابعة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseDetailsDialog;