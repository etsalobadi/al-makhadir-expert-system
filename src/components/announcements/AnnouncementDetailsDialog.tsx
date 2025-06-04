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
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Printer,
  Calendar,
  User,
  Building,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Announcement } from '@/hooks/useAnnouncements';

interface AnnouncementDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

const AnnouncementDetailsDialog: React.FC<AnnouncementDetailsDialogProps> = ({
  open,
  onOpenChange,
  announcement
}) => {
  if (!announcement) return null;

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

  const handlePrint = () => {
    // Create a new window with just the announcement data
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>طباعة الإعلان القضائي</title>
            <style>
              body {
                font-family: 'Cairo', sans-serif;
                direction: rtl;
                margin: 20px;
                line-height: 1.6;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #000;
                padding-bottom: 20px;
              }
              .content {
                margin: 20px 0;
              }
              .field {
                margin: 10px 0;
                padding: 5px 0;
              }
              .field strong {
                display: inline-block;
                width: 150px;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                border-top: 1px solid #ccc;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>الجمهورية اليمنية</h1>
              <h2>وزارة العدل</h2>
              <h3>${announcement.court}</h3>
              <h2>إعلان قضائي</h2>
            </div>
            <div class="content">
              <div class="field"><strong>رقم القضية:</strong> ${announcement.caseNumber}</div>
              <div class="field"><strong>نوع الإعلان:</strong> ${announcement.announcementType}</div>
              <div class="field"><strong>المُعلن:</strong> ${announcement.announcer}</div>
              <div class="field"><strong>تاريخ الجلسة:</strong> ${format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}</div>
              <div class="field"><strong>الوصف:</strong> ${announcement.description}</div>
              <div class="field"><strong>الحالة:</strong> ${announcement.status}</div>
              <div class="field"><strong>آخر تحديث:</strong> ${format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}</div>
            </div>
            <div class="footer">
              <p>تم الطباعة في: ${format(new Date(), 'dd/MM/yyyy - HH:mm', { locale: ar })}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const content = `
إعلان قضائي

رقم القضية: ${announcement.caseNumber}
المحكمة: ${announcement.court}
المُعلن: ${announcement.announcer}
تاريخ الجلسة: ${format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}
نوع الإعلان: ${announcement.announcementType}
الوصف: ${announcement.description}
الحالة: ${announcement.status}
آخر تحديث: ${format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `announcement_${announcement.caseNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            تفاصيل الإعلان القضائي
          </DialogTitle>
          <DialogDescription>
            إعلان قضائي للقضية رقم {announcement.caseNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{announcement.announcementType}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">القضية رقم: {announcement.caseNumber}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(announcement.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{announcement.description}</p>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  معلومات المحكمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">المحكمة:</p>
                    <p className="font-medium">{announcement.court}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">المُعلن:</p>
                    <p className="font-medium">{announcement.announcer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  التواريخ المهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الجلسة:</p>
                    <p className="font-medium text-blue-600">
                      {format(announcement.sessionDate, 'dd/MM/yyyy', { locale: ar })}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">آخر تحديث:</p>
                    <p className="font-medium">
                      {format(announcement.lastUpdate, 'dd/MM/yyyy', { locale: ar })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Alert */}
          {announcement.status === 'expired' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">انتهت صلاحية هذا الإعلان</p>
                <p className="text-sm text-red-600">يرجى مراجعة الإعلانات الجديدة للحصول على آخر التحديثات</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 ml-2" />
              تحميل
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailsDialog;