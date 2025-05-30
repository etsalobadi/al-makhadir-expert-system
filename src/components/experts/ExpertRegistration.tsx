import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isValidArabicName, isValidYemeniId } from '../../utils/arabicUtils';
import { useExperts } from '../../hooks/useExperts';

const ExpertRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const { createExpert } = useExperts();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    national_id: '',
    gender: '',
    specialty: '',
    qualification: '',
    graduation_year: '',
    university: '',
    experience_years: '',
    status: 'active' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'يرجى إدخال الاسم';
    } else if (!isValidArabicName(formData.name)) {
      newErrors.name = 'يرجى إدخال اسم صحيح باللغة العربية';
    }
    
    if (!formData.email) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف';
    }
    
    if (formData.national_id && !isValidYemeniId(formData.national_id)) {
      newErrors.national_id = 'رقم الهوية غير صحيح';
    }
    
    if (activeTab === 'professional') {
      if (!formData.specialty) {
        newErrors.specialty = 'يرجى اختيار التخصص';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createExpert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        national_id: formData.national_id || undefined,
        specialty: formData.specialty as any,
        qualification: formData.qualification || undefined,
        university: formData.university || undefined,
        graduation_year: formData.graduation_year || undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        status: formData.status,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        national_id: '',
        gender: '',
        specialty: '',
        qualification: '',
        graduation_year: '',
        university: '',
        experience_years: '',
        status: 'active',
      });
      setActiveTab('personal');
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveTab('professional');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>تسجيل خبير جديد</CardTitle>
        <CardDescription>
          يرجى تعبئة النموذج التالي لتسجيل خبير جديد في النظام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
              <TabsTrigger value="professional">البيانات المهنية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل الاسم الكامل"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="أدخل البريد الإلكتروني"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهاتف"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="national_id">رقم الهوية</Label>
                  <Input
                    id="national_id"
                    name="national_id"
                    value={formData.national_id}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهوية (اختياري)"
                    className={errors.national_id ? 'border-red-500' : ''}
                  />
                  {errors.national_id && (
                    <p className="text-red-500 text-sm">{errors.national_id}</p>
                  )}
                </div>
                
                <div className="col-span-2 flex justify-end space-x-2 space-x-reverse mt-4">
                  <Button type="button" onClick={handleNext} className="bg-judicial-primary">
                    التالي
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="professional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialty">التخصص</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) => handleSelectChange('specialty', value)}
                  >
                    <SelectTrigger className={errors.specialty ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">هندسة</SelectItem>
                      <SelectItem value="accounting">محاسبة</SelectItem>
                      <SelectItem value="medical">طب</SelectItem>
                      <SelectItem value="it">تقنية معلومات</SelectItem>
                      <SelectItem value="real_estate">عقارات</SelectItem>
                      <SelectItem value="inheritance">مواريث</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.specialty && (
                    <p className="text-red-500 text-sm">{errors.specialty}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualification">المؤهل العلمي</Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="أدخل المؤهل العلمي"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="graduation_year">سنة التخرج</Label>
                  <Input
                    id="graduation_year"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    placeholder="أدخل سنة التخرج"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">الجامعة</Label>
                  <Input
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الجامعة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience_years">سنوات الخبرة</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    placeholder="أدخل عدد سنوات الخبرة"
                  />
                </div>
                
                <div className="col-span-2 flex justify-between space-x-2 space-x-reverse mt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('personal')}
                  >
                    السابق
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-judicial-primary"
                  >
                    {loading ? 'جاري التسجيل...' : 'تسجيل الخبير'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpertRegistration;
