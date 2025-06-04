import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface CaseReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
}

// Mock reports data
const mockReports = [
  {
    id: 'R001',
    title: 'تقرير الخبرة الأولي',
    type: 'خبرة فنية',
    status: 'مكتمل',
    date: '2024-04-20',
    author: 'محمد قائد صالح',
    size: '2.5 MB',
    pages: 12
  },
  {
    id: 'R002', 
    title: 'محضر جلسة المعاينة',
    type: 'محضر جلسة',
    status: 'مراجعة',
    date: '2024-04-18',
    author: 'أحمد محمد علي',
    size: '1.8 MB',
    pages: 8
  },
  {
    id: 'R003',
    title: 'تقرير التقييم النهائي',
    type: 'تقرير نهائي',
    status: 'مسودة',
    date: '2024-04-22',
    author: 'محمد قائد صالح',
    size: '3.2 MB',
    pages: 18
  }
];

const CaseReportsDialog: React.FC<CaseReportsDialogProps> = ({
  open,
  onOpenChange,
  caseId
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return <Badge className="bg-green-500 hover:bg-green-600">مكتمل</Badge>;
      case 'مراجعة':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">قيد المراجعة</Badge>;
      case 'مسودة':
        return <Badge className="bg-gray-500 hover:bg-gray-600">مسودة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewReport = (reportId: string) => {
    console.log('عرض التقرير:', reportId);
    // TODO: Implement report view functionality
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('تحميل التقرير:', reportId);
    // TODO: Implement report download functionality
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            تقارير القضية {caseId}
          </DialogTitle>
          <DialogDescription>
            جميع التقارير والمحاضر المتعلقة بهذه القضية
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline">{report.type}</Badge>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(report.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{report.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{report.pages} صفحة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{report.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
              <p className="text-gray-600">لم يتم إنشاء أي تقارير لهذه القضية بعد.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseReportsDialog;