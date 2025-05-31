
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Phone, Mail, Calendar, GraduationCap } from 'lucide-react';
import { Expert } from '@/types/database';
import { formatDate } from '@/utils/helpers';
import ExpertAttachments from './ExpertAttachments';

interface ExpertViewDialogProps {
  expert: Expert;
}

const ExpertViewDialog: React.FC<ExpertViewDialogProps> = ({ expert }) => {
  const [open, setOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">معلق</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 hover:bg-red-600">موقوف</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500 hover:bg-gray-600">منتهي</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    const specialties = {
      engineering: 'هندسة',
      accounting: 'محاسبة',
      medical: 'طب',
      it: 'تقنية معلومات',
      real_estate: 'عقارات',
      inheritance: 'مواريث'
    };
    return specialties[specialty as keyof typeof specialties] || specialty;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 ml-1" />
          عرض
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل الخبير</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="attachments">المرفقات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-judicial-primary">{expert.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(expert.status)}
                    <Badge variant="outline">{getSpecialtyLabel(expert.specialty)}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{expert.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{expert.phone}</span>
                  </div>
                  {expert.national_id && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-gray-400">🆔</span>
                      <span>رقم الهوية: {expert.national_id}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">المعلومات المهنية</h4>
                  <div className="space-y-2">
                    {expert.qualification && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{expert.qualification}</span>
                      </div>
                    )}
                    {expert.university && (
                      <p className="text-sm text-gray-600">الجامعة: {expert.university}</p>
                    )}
                    {expert.graduation_year && (
                      <p className="text-sm text-gray-600">سنة التخرج: {expert.graduation_year}</p>
                    )}
                    {expert.experience_years && (
                      <p className="text-sm text-gray-600">سنوات الخبرة: {expert.experience_years}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">إحصائيات</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">تاريخ التسجيل: {formatDate(new Date(expert.created_at))}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      القضايا السابقة: {expert.previous_cases}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attachments">
            <ExpertAttachments expertId={expert.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertViewDialog;
