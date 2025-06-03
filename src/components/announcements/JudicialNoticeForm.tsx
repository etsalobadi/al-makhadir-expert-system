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
              <Label htmlFor="defendantName">اسم المدعى عليه</Label>
              <Input
                id="defendantName"
                value={noticeData.defendantName}
                onChange={(e) => handleInputChange('defendantName', e.target.value)}
                placeholder="السيد أحمد محمد علي"
              />
            </div>
            
            <div>
              <Label htmlFor="defendantAddress">عنوان المدعى عليه</Label>
              <Input
                id="defendantAddress"
                value={noticeData.defendantAddress}
                onChange={(e) => handleInputChange('defendantAddress', e.target.value)}
                placeholder="شارع الحرية، عمارة 15، صنعاء"
              />
            </div>
            
            <div>
              <Label htmlFor="judgeName">اسم القاضي</Label>
              <Input
                id="judgeName"
                value={noticeData.judgeName}
                onChange={(e) => handleInputChange('judgeName', e.target.value)}
                placeholder="القاضي محمد أحمد الحسني"
              />
            </div>
            
            <div>
              <Label htmlFor="notifierName">اسم المُبلغ</Label>
              <Input
                id="notifierName"
                value={noticeData.notifierName}
                onChange={(e) => handleInputChange('notifierName', e.target.value)}
                placeholder="سعد عبدالله المخلافي"
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
                placeholder="09:00 صباحاً"
              />
            </div>
            
            <div className="md:col-span-3">
              <Label htmlFor="noticeContent">موضوع القضية</Label>
              <Textarea
                id="noticeContent"
                value={noticeData.noticeContent}
                onChange={(e) => handleInputChange('noticeContent', e.target.value)}
                placeholder="دعوى مطالبة بحقوق مالية..."
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
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

      {/* Official Judicial Notice - Matching Legal Format */}
      <div ref={printRef} className="official-notice bg-white border-2 border-black p-8 max-w-4xl mx-auto">
        {/* Official Header */}
        <div className="header text-center mb-6 pb-4 border-b-2 border-black">
          <div className="republic-header">الجمهورية اليمنية</div>
          <div className="emblem">⚖️</div>
          <div className="ministry">وزارة العدل</div>
          <div className="court-name">المحكمة الابتدائية بالمخادر</div>
        </div>

        {/* Case Information */}
        <div className="case-info">
          <div>رقم القضية: {noticeData.caseNumber || '003-2024'}</div>
          <div>لسنة: {noticeData.hijriYear || '1444'}هـ - {noticeData.gregorianYear || '2024'}م</div>
        </div>

        {/* Main Notice Title */}
        <div className="notice-title">إعلان قضائي</div>

        {/* Notice Content */}
        <div className="notice-content">
          <p>
            إلى المدعى عليه السيد/ 
            <span className="dotted-line">{noticeData.defendantName || '........................'}</span>
          </p>
          
          <p>
            الساكن في: 
            <span className="dotted-line">{noticeData.defendantAddress || '........................................'}</span>
          </p>
          
          <p>
            بناء على ما تقتضيه أحكام القانون، وحيث أنه قد حددت جلسة يوم 
            <span className="dotted-line">
              {noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'EEEE الموافق dd/MM/yyyy', { locale: ar }) : '..................'}
            </span>
            في تمام الساعة 
            <span className="dotted-line">{noticeData.sessionTime || '............'}</span>
            لنظر القضية المرقومة أعلاه.
          </p>
          
          <p>
            وحيث أن موضوع القضية هو: 
            <span className="dotted-line">{noticeData.noticeContent || '........................................................................................................'}</span>
          </p>
          
          <p style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>
            فأنت مدعو للحضور أمام هذه المحكمة في الموعد المحدد أعلاه
          </p>
          
          <p>
            وفي حالة عدم حضورك ستنظر المحكمة في القضية غيابياً طبقاً لأحكام القانون.
          </p>
        </div>

        {/* Signatures Section */}
        <div className="signatures">
          <div className="signature-section">
            <div className="signature-title">القاضي</div>
            <div className="signature-line"></div>
            <div>{noticeData.judgeName || 'اسم القاضي'}</div>
          </div>
          
          <div className="signature-section">
            <div className="signature-title">المُبلغ</div>
            <div className="signature-line"></div>
            <div>{noticeData.notifierName || 'اسم المُبلغ'}</div>
          </div>
        </div>

        {/* Issue Date */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>حُرر في: {noticeData.issueDate || format(new Date(), 'dd/MM/yyyy')}</p>
        </div>

        {/* Delivery Section */}
        <div className="delivery-section">
          <div className="delivery-title">شهادة التبليغ</div>
          
          <div className="delivery-content">
            <p>
              أشهد أنا الموقع أدناه بأنني قمت بتبليغ هذا الإعلان للمدعى عليه المذكور أعلاه في تاريخ 
              <span className="dotted-line">..................</span>
            </p>
            
            <div className="delivery-grid">
              <div>
                <p>توقيع المستلم:</p>
                <div style={{ borderBottom: '1px solid black', height: '40px', margin: '10px 0' }}></div>
              </div>
              
              <div>
                <p>الشاهد الأول:</p>
                <div style={{ borderBottom: '1px solid black', height: '40px', margin: '10px 0' }}></div>
              </div>
              
              <div>
                <p>الشاهد الثاني:</p>
                <div style={{ borderBottom: '1px solid black', height: '40px', margin: '10px 0' }}></div>
              </div>
              
              <div>
                <p>المُبلغ:</p>
                <div style={{ borderBottom: '1px solid black', height: '40px', margin: '10px 0' }}></div>
              </div>
            </div>
            
            <p style={{ marginTop: '20px' }}>
              ملاحظات: 
              <span style={{ borderBottom: '1px dotted black', display: 'inline-block', minWidth: '300px', marginRight: '10px' }}></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudicialNoticeForm;