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
                  line-height: 1.8;
                  color: #000;
                  background: white;
                }
                
                .notice-container {
                  max-width: 210mm;
                  margin: 0 auto;
                  background: white;
                  border: 3px solid #000;
                  padding: 20px;
                  position: relative;
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
                placeholder="مثال: 144"
              />
            </div>
            
            <div>
              <Label htmlFor="hijriYear">السنة الهجرية</Label>
              <Input
                id="hijriYear"
                value={noticeData.hijriYear}
                onChange={(e) => handleInputChange('hijriYear', e.target.value)}
                placeholder="1444"
              />
            </div>
            
            <div>
              <Label htmlFor="gregorianYear">السنة الميلادية</Label>
              <Input
                id="gregorianYear"
                value={noticeData.gregorianYear}
                onChange={(e) => handleInputChange('gregorianYear', e.target.value)}
                placeholder="2024"
              />
            </div>
            
            <div>
              <Label htmlFor="defendantName">اسم المدعى عليه</Label>
              <Input
                id="defendantName"
                value={noticeData.defendantName}
                onChange={(e) => handleInputChange('defendantName', e.target.value)}
                placeholder="الاسم الكامل"
              />
            </div>
            
            <div>
              <Label htmlFor="defendantAddress">عنوان المدعى عليه</Label>
              <Input
                id="defendantAddress"
                value={noticeData.defendantAddress}
                onChange={(e) => handleInputChange('defendantAddress', e.target.value)}
                placeholder="العنوان التفصيلي"
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
              <Label htmlFor="sessionTime">وقت الجلسة</Label>
              <Input
                id="sessionTime"
                value={noticeData.sessionTime}
                onChange={(e) => handleInputChange('sessionTime', e.target.value)}
                placeholder="مثال: الساعة الثامنة صباحاً"
              />
            </div>
            
            <div>
              <Label htmlFor="judgeName">اسم القاضي</Label>
              <Input
                id="judgeName"
                value={noticeData.judgeName}
                onChange={(e) => handleInputChange('judgeName', e.target.value)}
                placeholder="اسم القاضي"
              />
            </div>
            
            <div>
              <Label htmlFor="notifierName">اسم المُبلغ</Label>
              <Input
                id="notifierName"
                value={noticeData.notifierName}
                onChange={(e) => handleInputChange('notifierName', e.target.value)}
                placeholder="اسم المُبلغ"
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="noticeContent">محتوى الإعلان (اختياري)</Label>
              <Textarea
                id="noticeContent"
                value={noticeData.noticeContent}
                onChange={(e) => handleInputChange('noticeContent', e.target.value)}
                placeholder="محتوى إضافي للإعلان..."
                className="min-h-[100px]"
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

      {/* Print Preview Section */}
      <div ref={printRef} className="notice-container bg-white border-2 border-gray-800 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="header">
          <div className="republic-header">الجمهورية اليمنية</div>
          <div className="emblem">
            <div>شعار<br/>الجمهورية</div>
          </div>
          <div className="ministry">وزارة العدل</div>
          <div className="court-name">محكمة المخادر الابتدائية</div>
        </div>

        {/* Case Information */}
        <div className="case-info">
          <div>
            <div>رقم القضية: {noticeData.caseNumber || '........'}</div>
            <div>لعام: {noticeData.hijriYear || '........'}هـ / {noticeData.gregorianYear || '........'}م</div>
            <div>الموافق: {noticeData.gregorianYear || '........'}م</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div>التاريخ: {noticeData.issueDate}</div>
          </div>
        </div>

        {/* Notice Title */}
        <div className="notice-title">إعــلان قضـــائي</div>

        {/* Notice Content */}
        <div className="notice-content">
          <p>
            إلى المدعى عليه: <span className="dotted-line" style={{ minWidth: '200px' }}>{noticeData.defendantName}</span>
          </p>
          
          <p style={{ marginTop: '20px' }}>
            أنت مكلف بالحضور إلى محكمة المخادر الابتدائية
          </p>
          
          <p>
            في الساعة <span className="dotted-line">{noticeData.sessionTime}</span> 
            من يوم <span className="dotted-line">{noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'EEEE', { locale: ar }) : '........'}</span> 
            الموافق <span className="dotted-line">{noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'dd/MM/yyyy') : '........'}</span>
          </p>
          
          <p>
            لحضور الدعوى المرفوعة من <span className="dotted-line">المدعي</span> 
            ضدك <span className="dotted-line">وأقاربك المدعى عليهم معك</span>
          </p>
          
          {noticeData.noticeContent && (
            <p style={{ marginTop: '20px' }}>
              {noticeData.noticeContent}
            </p>
          )}
          
          <p style={{ marginTop: '30px' }}>
            وهذا إعلان وإنذار أصولي.
          </p>
          
          <p style={{ textAlign: 'left', marginTop: '20px' }}>
            صدر في يوم <span className="dotted-line">{format(new Date(), 'EEEE', { locale: ar })}</span> 
            بتاريخ <span className="dotted-line">{noticeData.issueDate}</span>
          </p>
          
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            "والله الموفق"
          </p>
        </div>

        {/* Signatures */}
        <div className="signatures">
          <div className="signature-section">
            <div className="signature-title">القاضي</div>
            <div className="signature-line"></div>
            <div>{noticeData.judgeName || '........................'}</div>
          </div>
          
          <div className="signature-section">
            <div className="signature-title">رئيس المحكمة</div>
            <div className="signature-line"></div>
            <div>........................</div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="delivery-section">
          <div className="delivery-title">إيصال الشخص المعلن بالحضور</div>
          
          <div className="delivery-content">
            <p>
              تم تبليغ واستلام المدعى عليه: <span className="dotted-line" style={{ minWidth: '200px' }}>........................</span>
            </p>
            
            <p>
              تبليغ أحد أقارب المدعى عليه إذ وجد: <span className="dotted-line" style={{ minWidth: '200px' }}>........................</span>
            </p>
            
            <p>
              في حالة رفض المدعى عليه استلام الإعلان:
              <span className="dotted-line" style={{ minWidth: '150px' }}>........................</span>
            </p>
            
            <p>
              تحت إشهاد شاهدين: 
              الشاهد الأول: <span className="dotted-line">........................</span>
              الشاهد الثاني: <span className="dotted-line">........................</span>
            </p>
          </div>
          
          <div className="delivery-grid">
            <div>
              <p>تاريخ تسليم الإعلان: <span className="dotted-line">............/............/............</span></p>
              <p style={{ marginTop: '30px' }}>القائم بالإعلان</p>
              <div className="signature-line" style={{ marginTop: '20px' }}></div>
            </div>
            
            <div>
              <p>الاسم: <span className="dotted-line">........................</span></p>
              <p>التوقيع: <span className="dotted-line">........................</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudicialNoticeForm;