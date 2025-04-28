
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash, Calculate, FileText, Download } from 'lucide-react';
import { calculateInheritanceShares, convertEnglishToArabicNumbers } from '../../utils/arabicUtils';
import { formatCurrency } from '../../utils/helpers';

const relationshipOptions = [
  { value: 'husband', label: 'زوج' },
  { value: 'wife', label: 'زوجة' },
  { value: 'son', label: 'ابن' },
  { value: 'daughter', label: 'بنت' },
  { value: 'father', label: 'أب' },
  { value: 'mother', label: 'أم' },
  { value: 'brother', label: 'أخ شقيق' },
  { value: 'sister', label: 'أخت شقيقة' },
  { value: 'paternal_brother', label: 'أخ لأب' },
  { value: 'paternal_sister', label: 'أخت لأب' },
  { value: 'maternal_brother', label: 'أخ لأم' },
  { value: 'maternal_sister', label: 'أخت لأم' },
  { value: 'grandfather', label: 'جد' },
  { value: 'grandmother', label: 'جدة' },
];

type Heir = {
  id: string;
  relationship: string;
  gender: 'male' | 'female';
  count: number;
};

type InheritanceShare = {
  relationship: string;
  share: number;
  percentage: number;
};

const InheritanceCalculator: React.FC = () => {
  const [deceased, setDeceased] = useState({
    name: '',
    dateOfDeath: '',
  });
  
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: '1', relationship: '', gender: 'male', count: 1 },
  ]);
  
  const [estate, setEstate] = useState({
    total: 0,
    debts: 0,
    funeral: 0,
    will: 0,
  });
  
  const [calculatedShares, setCalculatedShares] = useState<InheritanceShare[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      relationship: '',
      gender: 'male',
      count: 1,
    };
    setHeirs([...heirs, newHeir]);
  };

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    setHeirs(
      heirs.map((heir) => {
        if (heir.id === id) {
          if (field === 'relationship') {
            const selectedOption = relationshipOptions.find(opt => opt.value === value);
            const gender = selectedOption?.value.includes('sister') || 
                          selectedOption?.value === 'wife' || 
                          selectedOption?.value === 'mother' ||
                          selectedOption?.value === 'daughter' ||
                          selectedOption?.value === 'grandmother' 
                          ? 'female' : 'male';
            return { ...heir, [field]: value, gender };
          }
          return { ...heir, [field]: value };
        }
        return heir;
      })
    );
  };

  const removeHeir = (id: string) => {
    setHeirs(heirs.filter((heir) => heir.id !== id));
  };

  const calculateShares = () => {
    // Calculate net estate value
    const netEstate = estate.total - estate.debts - estate.funeral - estate.will;
    
    // Filter out invalid heirs
    const validHeirs = heirs.filter(heir => heir.relationship && heir.count > 0);
    
    if (validHeirs.length === 0) {
      return;
    }
    
    // Use the helper function to calculate shares
    const shares = calculateInheritanceShares(validHeirs, netEstate);
    
    setCalculatedShares(shares);
    setHasCalculated(true);
  };

  const generateReport = () => {
    console.log('Generating report with data:', {
      deceased,
      heirs,
      estate,
      calculatedShares,
    });
    // In a real application, this would call a backend API to generate a PDF report
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>حاسبة المواريث الشرعية</CardTitle>
        <CardDescription>
          حساب الأنصبة الشرعية للورثة وفقاً للشريعة الإسلامية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">بيانات المتوفى</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المتوفى</Label>
              <Input
                id="name"
                value={deceased.name}
                onChange={(e) => setDeceased({ ...deceased, name: e.target.value })}
                placeholder="أدخل اسم المتوفى"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfDeath">تاريخ الوفاة</Label>
              <Input
                id="dateOfDeath"
                type="date"
                value={deceased.dateOfDeath}
                onChange={(e) => setDeceased({ ...deceased, dateOfDeath: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">بيانات التركة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalEstate">إجمالي التركة (ريال يمني)</Label>
              <Input
                id="totalEstate"
                type="number"
                value={estate.total === 0 ? '' : estate.total}
                onChange={(e) => setEstate({ ...estate, total: Number(e.target.value) || 0 })}
                placeholder="أدخل إجمالي التركة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debts">الديون (ريال يمني)</Label>
              <Input
                id="debts"
                type="number"
                value={estate.debts === 0 ? '' : estate.debts}
                onChange={(e) => setEstate({ ...estate, debts: Number(e.target.value) || 0 })}
                placeholder="أدخل الديون"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funeral">تكاليف الجنازة (ريال يمني)</Label>
              <Input
                id="funeral"
                type="number"
                value={estate.funeral === 0 ? '' : estate.funeral}
                onChange={(e) => setEstate({ ...estate, funeral: Number(e.target.value) || 0 })}
                placeholder="أدخل تكاليف الجنازة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="will">الوصية (ريال يمني)</Label>
              <Input
                id="will"
                type="number"
                value={estate.will === 0 ? '' : estate.will}
                onChange={(e) => setEstate({ ...estate, will: Number(e.target.value) || 0 })}
                placeholder="أدخل مبلغ الوصية"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">صافي التركة:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(estate.total - estate.debts - estate.funeral - estate.will)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">بيانات الورثة</h3>
            <Button 
              onClick={addHeir} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة وارث
            </Button>
          </div>
          
          <div className="space-y-4">
            {heirs.map((heir, index) => (
              <div 
                key={heir.id} 
                className="grid grid-cols-12 gap-2 items-end border-b pb-4"
              >
                <div className="col-span-12 md:col-span-5 space-y-2">
                  <Label htmlFor={`relationship-${heir.id}`}>صلة القرابة</Label>
                  <Select
                    value={heir.relationship}
                    onValueChange={(value) => updateHeir(heir.id, 'relationship', value)}
                  >
                    <SelectTrigger id={`relationship-${heir.id}`}>
                      <SelectValue placeholder="اختر صلة القرابة" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-12 md:col-span-5 space-y-2">
                  <Label htmlFor={`count-${heir.id}`}>العدد</Label>
                  <Input
                    id={`count-${heir.id}`}
                    type="number"
                    min="1"
                    value={heir.count}
                    onChange={(e) => updateHeir(heir.id, 'count', Number(e.target.value) || 1)}
                  />
                </div>
                
                <div className="col-span-12 md:col-span-2 flex justify-end">
                  {heirs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeHeir(heir.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              className="bg-judicial-primary w-full md:w-auto"
              onClick={calculateShares}
              disabled={heirs.length === 0 || heirs.some(h => !h.relationship)}
            >
              <Calculate className="h-4 w-4 ml-2" />
              حساب الأنصبة
            </Button>
          </div>
        </div>

        {hasCalculated && (
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">نتائج الحساب</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">صلة القرابة</TableHead>
                  <TableHead className="text-right">النسبة المئوية</TableHead>
                  <TableHead className="text-right">النصيب (ريال يمني)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedShares.map((share, index) => {
                  const heir = heirs.find(h => h.relationship === share.relationship);
                  const relationshipLabel = relationshipOptions.find(
                    opt => opt.value === share.relationship
                  )?.label || share.relationship;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {relationshipLabel}
                        {heir && heir.count > 1 ? ` (${convertEnglishToArabicNumbers(heir.count)})` : ''}
                      </TableCell>
                      <TableCell>
                        {convertEnglishToArabicNumbers(share.percentage.toFixed(2))}%
                      </TableCell>
                      <TableCell>
                        {formatCurrency(share.share)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="mt-6 flex gap-2 justify-end">
              <Button variant="outline" className="flex items-center gap-2" onClick={generateReport}>
                <FileText className="h-4 w-4" />
                إنشاء تقرير
              </Button>
              <Button className="bg-judicial-primary flex items-center gap-2">
                <Download className="h-4 w-4" />
                تصدير PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InheritanceCalculator;
