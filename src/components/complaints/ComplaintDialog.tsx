
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';

interface ComplaintDialogProps {
  trigger?: React.ReactNode;
}

const ComplaintDialog: React.FC<ComplaintDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'technical' as Complaint['type'],
    priority: 'medium' as Complaint['priority'],
    submitted_by: 'المستخدم الحالي' // This should come from auth context
  });
  const [loading, setLoading] = useState(false);
  const { createComplaint } = useComplaints();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createComplaint({
        ...formData,
        attachments: []
      });
      
      setFormData({
        title: '',
        description: '',
        type: 'technical',
        priority: 'medium',
        submitted_by: 'المستخدم الحالي'
      });
      setOpen(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-judicial-primary hover:bg-judicial-primary/90">
            <Plus className="w-4 h-4 ml-2" />
            شكوى جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء شكوى جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان الشكوى</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">نوع الشكوى</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Complaint['type']) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">تقنية</SelectItem>
                <SelectItem value="administrative">إدارية</SelectItem>
                <SelectItem value="legal">قانونية</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">الأولوية</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Complaint['priority']) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">منخفضة</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
                <SelectItem value="urgent">عاجلة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">وصف الشكوى</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-judicial-primary hover:bg-judicial-primary/90"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الشكوى'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDialog;
