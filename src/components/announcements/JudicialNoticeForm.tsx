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
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
                
                body {
                  font-family: 'Amiri', serif;
                  direction: rtl;
                  margin: 0;
                  padding: 15mm;
                  line-height: 1.8;
                  color: #000;
                  background: white;
                  font-size: 14px;
                }
                
                .official-notice {
                  max-width: 210mm;
                  min-height: 297mm;
                  margin: 0 auto;
                  background: white;
                  border: 3px solid #000;
                  padding: 15mm;
                  position: relative;
                }
                
                .header-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #000;
                  padding-bottom: 15px;
                }
                
                .case-info-box {
                  border: 2px solid #000;
                  padding: 10px;
                  text-align: center;
                  font-size: 12px;
                  line-height: 1.6;
                }
                
                .official-header {
                  text-align: center;
                  flex: 1;
                  margin: 0 20px;
                }
                
                .republic-title {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 8px;
                  font-family: 'Amiri', serif;
                }
                
                .emblem-container {
                  margin: 10px 0;
                }
                
                .emblem {
                  width: 50px;
                  height: 50px;
                  border: 2px solid #000;
                  border-radius: 50%;
                  margin: 0 auto;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: white;
                }
                
                .ministry-justice {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 8px 0;
                }
                
                .court-name {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                
                .stamp-area {
                  border: 2px solid #000;
                  padding: 8px;
                  text-align: center;
                  font-size: 11px;
                  line-height: 1.4;
                }
                
                .notice-title {
                  text-align: center;
                  font-size: 24px;
                  font-weight: bold;
                  margin: 25px 0;
                  text-decoration: underline;
                  font-family: 'Amiri', serif;
                }
                
                .notice-body {
                  line-height: 2.5;
                  font-size: 16px;
                  text-align: right;
                  margin-bottom: 30px;
                }
                
                .dotted-line {
                  border-bottom: 1px dotted #000;
                  display: inline-block;
                  min-width: 120px;
                  height: 20px;
                  margin: 0 5px;
                }
                
                .blank-line {
                  border-bottom: 1px dotted #000;
                  height: 25px;
                  margin: 15px 0;
                }
                
                .paragraph {
                  margin-bottom: 20px;
                  text-align: justify;
                }
                
                .center-text {
                  text-align: center;
                  font-weight: bold;
                  margin: 25px 0;
                  font-size: 18px;
                }
                
                .signatures-section {
                  display: flex;
                  justify-content: space-between;
                  margin: 50px 0 40px 0;
                }
                
                .signature-box {
                  text-align: center;
                  width: 150px;
                }
                
                .signature-title {
                  font-weight: bold;
                  margin-bottom: 30px;
                  font-size: 14px;
                }
                
                .signature-line {
                  border-bottom: 2px solid #000;
                  height: 40px;
                  margin-bottom: 10px;
                }
                
                .signature-name {
                  font-size: 12px;
                  text-align: center;
                }
                
                .delivery-section {
                  border-top: 3px solid #000;
                  padding-top: 25px;
                  margin-top: 40px;
                }
                
                .delivery-title {
                  text-align: center;
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 25px;
                  text-decoration: underline;
                  font-family: 'Amiri', serif;
                }
                
                .delivery-content {
                  line-height: 2.5;
                  font-size: 14px;
                }
                
                .witnesses-section {
                  display: flex;
                  justify-content: space-between;
                  margin: 30px 0;
                  gap: 40px;
                }
                
                .witness-box {
                  flex: 1;
                }
                
                .witness-title {
                  margin-bottom: 10px;
                  font-weight: bold;
                }
                
                .witness-signature {
                  border-bottom: 1px solid #000;
                  height: 30px;
                  margin-bottom: 10px;
                }
                
                .witness-details {
                  border-bottom: 1px dotted #000;
                  height: 20px;
                  margin-bottom: 5px;
                }
                
                .notifier-section {
                  margin-top: 30px;
                }
                
                .notifier-title {
                  margin-bottom: 10px;
                  font-weight: bold;
                }
                
                .notifier-line {
                  border-bottom: 1px dotted #000;
                  height: 25px;
                  margin-bottom: 10px;
                }
                
                @page {
                  size: A4;
                  margin: 15mm;
                }
                
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    margin: 0;
                    padding: 15mm;
                  }
                  
                  .official-notice {
                    border: 3px solid #000;
                    box-shadow: none;
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

      {/* Official Judicial Notice - Exact Match to Official Yemeni Court Format */}
      <div ref={printRef} className="official-notice bg-white border-3 border-black max-w-[210mm] mx-auto" style={{ minHeight: '297mm', padding: '15mm', fontFamily: 'Amiri, serif' }}>
        
        {/* Header Section with Three Parts */}
        <div className="header-section">
          {/* Left: Case Information Box */}
          <div className="case-info-box">
            <div>رقم القضية: <span className="font-bold">{noticeData.caseNumber || '___/____'}</span></div>
            <div>لعام: {noticeData.hijriYear || '1445'} هـ</div>
            <div>الموافق: {noticeData.gregorianYear || '2024'} م</div>
            <div>التاريخ: ___________</div>
            <div>الموثقة: ___________</div>
          </div>
          
          {/* Center: Official Header */}
          <div className="official-header">
            <div className="republic-title">الجمهورية اليمنية</div>
            <div className="emblem-container">
              <div className="emblem">
                <img src="/lovable-uploads/4d1ac1cb-0781-418e-9eac-962f1bdff8f6.png" alt="شعار الجمهورية" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
            </div>
            <div className="ministry-justice">وزارة العدل</div>
            <div className="court-name">المحكمة الابتدائية بالمخادر</div>
          </div>
          
          {/* Right: Official Stamp Area */}
          <div className="stamp-area">
            <div>الجمهورية اليمنية</div>
            <div>وزارة العدل</div>
            <div>المحكمة الابتدائية بالمخادر</div>
            <div style={{ marginTop: '10px', height: '30px', border: '1px dotted #000' }}></div>
          </div>
        </div>

        {/* Notice Title */}
        <div className="notice-title">
          إعــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــلان قضـــــــــــــــــــــــــــــــــــــــــائي
        </div>

        {/* Notice Body with Official Legal Language */}
        <div className="notice-body">
          <div className="paragraph">
            إلى المدعى عليه السيد/ 
            <span className="dotted-line">{noticeData.defendantName || ''}</span>
          </div>
          
          <div className="blank-line"></div>
          
          <div className="paragraph">
            المقيم في: 
            <span className="dotted-line" style={{ minWidth: '350px' }}>{noticeData.defendantAddress || ''}</span>
          </div>
          
          <div className="paragraph">
            نحيطكم علماً بأنه قد أُقيمت عليكم الدعوى رقم 
            <span className="dotted-line">{noticeData.caseNumber || ''}</span>
            لعام {noticeData.hijriYear || '1445'} هـ الموافق {noticeData.gregorianYear || '2024'} م
          </div>
          
          <div className="paragraph">
            الخاصة بـ: 
            <span className="dotted-line" style={{ minWidth: '400px' }}>{noticeData.noticeContent || ''}</span>
          </div>
          
          <div className="blank-line"></div>
          <div className="blank-line"></div>
          
          <div className="paragraph">
            <strong>فأنت مكلف بالحضور أمام هذه المحكمة</strong> في تمام الساعة 
            <span className="dotted-line">{noticeData.sessionTime || 'الثامنة صباحاً'}</span>
            من يوم 
            <span className="dotted-line">
              {noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'EEEE', { locale: ar }) : ''}
            </span>
            الموافق 
            <span className="dotted-line">
              {noticeData.sessionDate ? format(new Date(noticeData.sessionDate), 'dd/MM/yyyy') : ''}
            </span>
          </div>
          
          <div className="paragraph">
            <strong>وفي حالة عدم حضورك أو عدم إرسال وكيل عنك فسوف تنظر الدعوى في غيابك وتصدر المحكمة حكمها وفقاً لما تراه محققاً للعدالة.</strong>
          </div>
          
          <div className="paragraph">
            هذا للعلم وترتيب ما يلزم...
          </div>
          
          <div className="center-text">
            وبالله التوفيق
          </div>
          
          <div className="paragraph" style={{ textAlign: 'left', marginTop: '30px' }}>
            صدر في تاريخ: 
            <span className="dotted-line">{format(new Date(), 'dd/MM/yyyy')}</span>
            الموافق 
            <span className="dotted-line">{noticeData.hijriYear || '1445'}</span>
            هـ
          </div>
        </div>

        {/* Signatures Section */}
        <div className="signatures-section">
          <div className="signature-box">
            <div className="signature-title">القاضـــــــــــــــــــي</div>
            <div className="signature-line"></div>
            <div className="signature-name">{noticeData.judgeName || ''}</div>
          </div>
          
          <div className="signature-box">
            <div className="signature-title">كاتب المحكمة</div>
            <div className="signature-line"></div>
            <div className="signature-name"></div>
          </div>
        </div>

        {/* Delivery Receipt Section */}
        <div className="delivery-section">
          <div className="delivery-title">
            إيصال استلام وتسليم الإعلان القضائي
          </div>
          
          <div className="delivery-content">
            <div className="paragraph">
              تسلم المدعى عليه/ 
              <span className="dotted-line" style={{ minWidth: '250px' }}></span>
              أصل الإعلان القضائي بتاريخ 
              <span className="dotted-line"></span>
              /
              <span className="dotted-line" style={{ minWidth: '50px' }}></span>
              /
              <span className="dotted-line"></span>
            </div>
            
            <div className="paragraph">
              وقع المدعى عليه: 
              <span className="dotted-line" style={{ minWidth: '300px' }}></span>
            </div>
            
            <div className="paragraph">
              في حالة رفض الاستلام أو عدم وجود المدعى عليه:
            </div>
            
            <div className="witnesses-section">
              <div className="witness-box">
                <div className="witness-title">الشاهد الأول:</div>
                <div>الاسم:</div>
                <div className="witness-details"></div>
                <div>التوقيع:</div>
                <div className="witness-signature"></div>
              </div>
              
              <div className="witness-box">
                <div className="witness-title">الشاهد الثاني:</div>
                <div>الاسم:</div>
                <div className="witness-details"></div>
                <div>التوقيع:</div>
                <div className="witness-signature"></div>
              </div>
            </div>
            
            <div className="notifier-section">
              <div className="notifier-title">القائم بالتبليغ:</div>
              <div>الاسم:</div>
              <div className="notifier-line"></div>
              <div>الرقم الوظيفي:</div>
              <div className="notifier-line"></div>
              <div>التوقيع:</div>
              <div className="notifier-line"></div>
              <div>التاريخ:</div>
              <div className="notifier-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudicialNoticeForm;