import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface JudicialNoticeData {
  caseNumber: string;
  hijriYear: string;
  gregorianYear: string;
  defendantName: string;
  defendantAddress: string;
  sessionDate: string;
  sessionTime: string;
  judgeName: string;
  notifierName: string;
  issueDate: string;
  noticeContent: string;
}

const JudicialNoticeForm: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [noticeData, setNoticeData] = useState<JudicialNoticeData>({
    caseNumber: '',
    hijriYear: '1444',
    gregorianYear: '2024',
    defendantName: '',
    defendantAddress: '',
    sessionDate: '',
    sessionTime: '',
    judgeName: '',
    notifierName: '',
    issueDate: format(new Date(), 'yyyy/MM/dd'),
    noticeContent: ''
  });

  const handleInputChange = (field: keyof JudicialNoticeData, value: string) => {
    setNoticeData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html dir="rtl">
            <head>
              <title>إعلان قضائي</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                
                 body {
                   font-family: 'Noto Sans Arabic', sans-serif;
                   direction: rtl;
                   margin: 0;
                   padding: 20px;
                   line-height: 1.6;
                   color: #000;
                   background: white;
                 }
                 
                 .official-notice {
                   max-width: 210mm;
                   margin: 0 auto;
                   background: white;
                   border: 2px solid #000;
                   padding: 20px;
                   position: relative;
                 }
                 
                 table {
                   width: 100%;
                   border-collapse: collapse;
                   font-family: 'Noto Sans Arabic', sans-serif;
                 }
                 
                 td {
                   border: 1px solid #000;
                   padding: 12px;
                   text-align: center;
                 }
                 
                 .header-row {
                   background-color: #f5f5f5;
                   font-weight: bold;
                   text-align: right;
                 }
                
                .header {
                  text-align: center;
                  border-bottom: 2px solid #000;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
                }
                
                .republic-header {
                  font-family: 'Amiri', serif;
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                
                .emblem {
                  width: 60px;
                  height: 60px;
                  margin: 10px auto;
                  border: 2px solid #000;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 12px;
                }
                
                .ministry {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 5px 0;
                }
                
                .court-name {
                  font-size: 14px;
                  font-weight: bold;
                }
                
                .case-info {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                  font-size: 12px;
                }
                
                .notice-title {
                  text-align: center;
                  font-size: 20px;
                  font-weight: bold;
                  margin: 20px 0;
                  text-decoration: underline;
                }
                
                .notice-content {
                  line-height: 2.5;
                  font-size: 14px;
                  margin-bottom: 30px;
                  text-align: justify;
                }
                
                .dotted-line {
                  border-bottom: 1px dotted #000;
                  display: inline-block;
                  min-width: 100px;
                  margin: 0 5px;
                }
                
                .signatures {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 50px;
                  margin: 40px 0;
                }
                
                .signature-section {
                  text-align: center;
                }
                
                .signature-title {
                  font-weight: bold;
                  margin-bottom: 40px;
                }
                
                .signature-line {
                  border-bottom: 1px solid #000;
                  height: 40px;
                  margin-bottom: 5px;
                }
                
                .delivery-section {
                  margin-top: 40px;
                  border-top: 2px solid #000;
                  padding-top: 20px;
                }
                
                .delivery-title {
                  text-align: center;
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 20px;
                  text-decoration: underline;
                }
                
                .delivery-content {
                  line-height: 3;
                  font-size: 14px;
                }
                
                .delivery-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 30px;
                  margin-top: 20px;
                }
                
                @page {
                  size: A4;
                  margin: 20mm;
                }
                
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSavePDF = () => {
    // This would integrate with a PDF generation library
    console.log('Save as PDF functionality - to be implemented with jsPDF or similar');
  };

  return (
    <div className="space-y-6">
      {/* Form Input Section */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle>نموذج إعداد الإعلان القضائي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="caseNumber">رقم القضية</Label>
              <Input
                id="caseNumber"
                value={noticeData.caseNumber}
                onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                placeholder="مثال: 003-2024"
              />
            </div>
            
            <div>
              <Label htmlFor="courtName">المحكمة</Label>
              <Input
                id="courtName"
                value={noticeData.defendantAddress}
                onChange={(e) => handleInputChange('defendantAddress', e.target.value)}
                placeholder="محكمة الاستئناف"
              />
            </div>
            
            <div>
              <Label htmlFor="judgeName">المُعلن</Label>
              <Input
                id="judgeName"
                value={noticeData.judgeName}
                onChange={(e) => handleInputChange('judgeName', e.target.value)}
                placeholder="القاضي محمد الحسني"
              />
            </div>
            
            <div>
              <Label htmlFor="sessionDate">تاريخ الجلسة</Label>
              <Input
                id="sessionDate"
                type="date"
                value={noticeData.sessionDate}
                onChange={(e) => handleInputChange('sessionDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="announcementType">نوع الإعلان</Label>
              <Input
                id="announcementType"
                value={noticeData.sessionTime}
                onChange={(e) => handleInputChange('sessionTime', e.target.value)}
                placeholder="تأجيل جلسة"
              />
            </div>
            
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={noticeData.defendantName}
                onChange={(e) => handleInputChange('defendantName', e.target.value)}
                placeholder="تأجيل جلسة الاستئناف لأسبوب فنية"
              />
            </div>
            
            <div className="md:col-span-3">
              <Label htmlFor="lastUpdate">آخر تحديث</Label>
              <Input
                id="lastUpdate"
                value={noticeData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                placeholder="15/01/2024"
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              طباعة الإعلان
            </Button>
            <Button variant="outline" onClick={handleSavePDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              حفظ PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Official Print Preview Section - Matching the official format */}
      <div ref={printRef} className="official-notice bg-white border-2 border-gray-800 p-8 max-w-4xl mx-auto">
        {/* Header with system branding */}
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
          <div className="text-lg font-bold mb-2">نظام إدارة الخبراء والقضايا القضائية</div>
          <div className="text-xl font-bold text-blue-900 mb-4">إعلان قضائي</div>
        </div>

        {/* Official Notice Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black text-sm">
            <tbody>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right w-1/4">
                  رقم القضية
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.caseNumber || '003-2024'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  المحكمة
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.defendantAddress || 'محكمة الاستئناف'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  المُعلن
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.judgeName || 'القاضي محمد الحسني'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  تاريخ الجلسة
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'dd/MM/yyyy') : '25/01/2024'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  نوع الإعلان
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.sessionTime || 'تأجيل جلسة'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  الوصف
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.defendantName || 'تأجيل جلسة الاستئناف لأسباب فنية'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 bg-gray-50 font-medium text-right">
                  آخر تحديث
                </td>
                <td className="border border-black px-4 py-3 text-center">
                  {noticeData.issueDate || '15/01/2024'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer with page reference */}
        <div className="mt-6 text-center text-xs text-gray-600">
          الصفحة رقم: 5.15.20256/3
        </div>
      </div>
    </div>
  );
};

export default JudicialNoticeForm;