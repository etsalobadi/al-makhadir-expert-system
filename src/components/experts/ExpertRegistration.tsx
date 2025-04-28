
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { showSuccess } from '../../utils/helpers';

const ExpertRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    dob: '',
    gender: '',
    address: '',
    specialty: '',
    qualification: '',
    graduationYear: '',
    university: '',
    experienceYears: '',
    previousCases: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal Info Validation
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
    
    if (!formData.nationalId) {
      newErrors.nationalId = 'يرجى إدخال رقم الهوية';
    } else if (!isValidYemeniId(formData.nationalId)) {
      newErrors.nationalId = 'رقم الهوية غير صحيح';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'يرجى اختيار الجنس';
    }
    
    // Professional Info Validation
    if (activeTab === 'professional') {
      if (!formData.specialty) {
        newErrors.specialty = 'يرجى اختيار التخصص';
      }
      
      if (!formData.qualification) {
        newErrors.qualification = 'يرجى إدخال المؤهل العلمي';
      }
      
      if (!formData.university) {
        newErrors.university = 'يرجى إدخال اسم الجامعة';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, submit the form data to the server
      console.log('Form data submitted:', formData);
      showSuccess('تم تسجيل الخبير بنجاح');
      
      // Reset the form
      setFormData({
        name: '',
        email: '',
        phone: '',
        nationalId: '',
        dob: '',
        gender: '',
        address: '',
        specialty: '',
        qualification: '',
        graduationYear: '',
        university: '',
        experienceYears: '',
        previousCases: '',
      });
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
                  <Label htmlFor="nationalId">رقم الهوية</Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهوية"
                    className={errors.nationalId ? 'border-red-500' : ''}
                  />
                  {errors.nationalId && (
                    <p className="text-red-500 text-sm">{errors.nationalId}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">تاريخ الميلاد</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={errors.dob ? 'border-red-500' : ''}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="أدخل العنوان"
                  />
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
                    className={errors.qualification ? 'border-red-500' : ''}
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-sm">{errors.qualification}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">سنة التخرج</Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
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
                    className={errors.university ? 'border-red-500' : ''}
                  />
                  {errors.university && (
                    <p className="text-red-500 text-sm">{errors.university}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">سنوات الخبرة</Label>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    placeholder="أدخل عدد سنوات الخبرة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previousCases">عدد القضايا السابقة</Label>
                  <Input
                    id="previousCases"
                    name="previousCases"
                    type="number"
                    value={formData.previousCases}
                    onChange={handleInputChange}
                    placeholder="أدخل عدد القضايا السابقة"
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
                  <Button type="submit" className="bg-judicial-primary">
                    تسجيل الخبير
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
