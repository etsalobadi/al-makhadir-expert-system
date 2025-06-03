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
                placeholder="مثال: 003/2024"
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

      {/* Official Judicial Notice - Exact Match to Official Format */}
      <div ref={printRef} className="official-notice bg-white border-2 border-black max-w-[210mm] mx-auto" style={{ minHeight: '297mm', padding: '15mm' }}>
        {/* Official Header Box */}
        <div className="header-box border-2 border-black mb-4 p-4">
          <div className="flex justify-between items-start">
            <div className="text-right text-sm leading-relaxed">
              <div>رقم القضية:</div>
              <div>لعام: {noticeData.hijriYear || '1444'} / {noticeData.gregorianYear || '2024'}</div>
              <div>التاريخ:</div>
              <div>الموافق:</div>
              <div className="border-b border-dotted border-black w-32 h-4 mt-1"></div>
              <div>الموثقة:</div>
            </div>
            
            <div className="text-center flex-1 mx-4">
              <div className="font-bold text-lg mb-2">الجمهورية اليمنية</div>
              <div className="w-16 h-16 border-2 border-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <img src="/lovable-uploads/4d1ac1cb-0781-418e-9eac-962f1bdff8f6.png" alt="شعار الجمهورية" className="w-12 h-12 object-contain" />
              </div>
              <div className="font-bold">وزارة العدل</div>
              <div className="font-bold">محكمة المخادر الابتدائية</div>
            </div>
            
            <div className="text-left text-sm">
              <div className="bg-gray-100 p-2 border border-black">
                <div>الجمهورية اليمنية</div>
                <div>وزارة العدل</div>
                <div>محكمة المخادر الابتدائية</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Title */}
        <div className="text-center text-xl font-bold mb-6 underline">
          إعــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــلان قضـــــــــــــــــــــــــــــــــــــــــائي
        </div>

        {/* Notice Content */}
        <div className="notice-content text-right leading-loose text-base">
          <p className="mb-4">
            إلى المدعى عليه: 
            <span className="border-b border-dotted border-black inline-block min-w-[200px] mx-2">
              {noticeData.defendantName || ''}
            </span>
          </p>
          
          <div className="border-b border-dotted border-black w-full h-6 mb-4"></div>
          
          <p className="mb-4">
            المقيم في: 
            <span className="border-b border-dotted border-black inline-block min-w-[300px] mx-2">
              {noticeData.defendantAddress || ''}
            </span>
          </p>
          
          <p className="mb-4">
            في الساعة الثامنة صباحاً من يوم
            <span className="border-b border-dotted border-black inline-block min-w-[150px] mx-2">
              {noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'dd/MM/yyyy') : ''}
            </span>
            الموافق
            <span className="border-b border-dotted border-black inline-block min-w-[100px] mx-2">
              {noticeData.hijriYear || '144'} 
            </span>
            هـ
          </p>
          
          <p className="mb-4">
            لحضور جلسة المحكمة المحددة لنظر القضية المعنونة
            <span className="border-b border-dotted border-black inline-block min-w-[200px] mx-2">
              {noticeData.noticeContent || ''}
            </span>
          </p>
          
          <div className="border-b border-dotted border-black w-full h-6 mb-4"></div>
          <div className="border-b border-dotted border-black w-full h-6 mb-4"></div>
          
          <p className="mb-4">
            وهذا إعلام لك بهذا الموضوع لحضورك في الموعد المذكور وعند عدم حضورك أو عدم إرسال وكيل عنك
          </p>
          
          <p className="mb-4">
            صدر في يوم المحدد أعلاه بتاريخ 
            <span className="border-b border-dotted border-black inline-block min-w-[100px] mx-2">
              {format(new Date(), 'dd/MM/yyyy')}
            </span>
            الموافق 
            <span className="border-b border-dotted border-black inline-block min-w-[100px] mx-2">
              {noticeData.hijriYear || '144'}
            </span>
            هـ
          </p>
          
          <div className="text-center font-bold my-6">
            وآخر الطرق...
          </div>
        </div>

        {/* Signatures Section */}
        <div className="signatures-section flex justify-between mt-8 mb-8">
          <div className="text-center">
            <div className="font-bold mb-4">القاضـــــــــــــــــــي</div>
            <div className="border-b-2 border-black w-32 h-12 mb-2"></div>
            <div className="text-sm">{noticeData.judgeName || ''}</div>
          </div>
          
          <div className="text-center">
            <div className="font-bold mb-4">كاتب المحكمة</div>
            <div className="border-b-2 border-black w-32 h-12 mb-2"></div>
            <div className="text-sm"></div>
          </div>
        </div>

        {/* Delivery Receipt Section */}
        <div className="delivery-section border-t-2 border-black pt-6">
          <div className="text-center font-bold text-lg mb-4 underline">
            إيصال الشخص المعلن بالحضور
          </div>
          
          <div className="delivery-content text-right leading-loose">
            <p className="mb-4">
              توقيع وإيتام المدعى عليه: 
              <span className="border-b border-dotted border-black inline-block min-w-[300px] mx-2"></span>
            </p>
            
            <p className="mb-4">
              توقيع أحد أقارب المدعى عليه أو جد: 
              <span className="border-b border-dotted border-black inline-block min-w-[200px] mx-2"></span>
            </p>
            
            <p className="mb-4">
              في حالة رفضه استلام الإعلان
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div>
                <p className="mb-2">شهد الشاهد الأول الحيم:</p>
                <div className="border-b border-black w-full h-8 mb-2"></div>
                <div className="border-b border-dotted border-black w-full h-6"></div>
              </div>
              
              <div>
                <p className="mb-2">الشاهد الثاني الحيم:</p>
                <div className="border-b border-black w-full h-8 mb-2"></div>
                <div className="border-b border-dotted border-black w-full h-6"></div>
              </div>
            </div>
            
            <p className="mt-6 mb-4">
              تاريخ تسليم الإعلان: 
              <span className="border-b border-dotted border-black inline-block min-w-[100px] mx-2"></span>
              / 
              <span className="border-b border-dotted border-black inline-block min-w-[50px] mx-2"></span>
              / 
              <span className="border-b border-dotted border-black inline-block min-w-[100px] mx-2"></span>
            </p>
            
            <div className="mt-6">
              <p className="mb-2">القائم بالإعلان:</p>
              <div className="border-b border-dotted border-black w-full h-6 mb-2"></div>
              <p className="mb-2">الاسم:</p>
              <div className="border-b border-dotted border-black w-full h-6 mb-2"></div>
              <p className="mb-2">الرقم:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudicialNoticeForm;