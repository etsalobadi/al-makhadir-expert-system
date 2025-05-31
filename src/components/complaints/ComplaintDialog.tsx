
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Upload } from 'lucide-react';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';
import { useFileUpload } from '@/hooks/useFileUpload';

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
    submitted_by: 'المستخدم الحالي', // This should come from auth context
    status: 'open' as Complaint['status']
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { createComplaint } = useComplaints();
  const { uploadFile, uploading } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload files first
      const attachments = [];
      for (const file of selectedFiles) {
        const uploadResult = await uploadFile(file, 'complaints');
        if (uploadResult) {
          attachments.push({
            name: file.name,
            path: uploadResult.path,
            url: uploadResult.url,
            type: file.type,
            size: file.size
          });
        }
      }

      await createComplaint({
        ...formData,
        attachments
      });
      
      setFormData({
        title: '',
        description: '',
        type: 'technical',
        priority: 'medium',
        submitted_by: 'المستخدم الحالي',
        status: 'open'
      });
      setSelectedFiles([]);
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
      <DialogContent className="max-w-2xl">
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
          
          <div className="grid grid-cols-2 gap-4">
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

          {/* File Upload Section */}
          <div>
            <Label>المرفقات (اختياري)</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  اختيار ملفات
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />
                <span className="text-sm text-gray-500">
                  (PDF, DOC, صور - حد أقصى 10 ميجابايت لكل ملف)
                </span>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              disabled={loading || uploading}
              className="bg-judicial-primary hover:bg-judicial-primary/90"
            >
              {loading || uploading ? 'جاري الإنشاء...' : 'إنشاء الشكوى'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDialog;
