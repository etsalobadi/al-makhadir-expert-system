
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Trash2, Plus } from 'lucide-react';
import { useExpertAttachments, type ExpertAttachment } from '@/hooks/useExpertAttachments';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatDate } from '@/utils/helpers';

interface ExpertAttachmentsProps {
  expertId: string;
}

const ExpertAttachments: React.FC<ExpertAttachmentsProps> = ({ expertId }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<ExpertAttachment['attachment_type']>('certificate');
  const [description, setDescription] = useState('');
  
  const { attachments, loading, addAttachment, deleteAttachment } = useExpertAttachments(expertId);
  const { uploadFile, uploading } = useFileUpload();

  const getAttachmentTypeLabel = (type: string) => {
    const labels = {
      certificate: 'شهادة',
      id_document: 'هوية',
      cv: 'سيرة ذاتية',
      license: 'ترخيص',
      other: 'أخرى'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const uploadResult = await uploadFile(selectedFile, 'experts');
      if (!uploadResult) return;

      await addAttachment({
        expert_id: expertId,
        file_name: selectedFile.name,
        file_path: uploadResult.path,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        attachment_type: attachmentType,
        description: description || undefined
      });

      // Reset form
      setSelectedFile(null);
      setDescription('');
      setAttachmentType('certificate');
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleDelete = async (attachment: ExpertAttachment) => {
    if (confirm('هل أنت متأكد من حذف هذا المرفق؟')) {
      await deleteAttachment(attachment.id, attachment.file_path);
    }
  };

  const downloadFile = (attachment: ExpertAttachment) => {
    const { data } = supabase.storage.from('attachments').getPublicUrl(attachment.file_path);
    window.open(data.publicUrl, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-judicial-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>المرفقات والوثائق</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-judicial-primary hover:bg-judicial-primary/90">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مرفق
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مرفق جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">الملف</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  أنواع الملفات المدعومة: PDF, DOC, DOCX, JPG, PNG (حد أقصى 5 ميجابايت)
                </p>
              </div>
              
              <div>
                <Label htmlFor="type">نوع المرفق</Label>
                <Select value={attachmentType} onValueChange={(value: ExpertAttachment['attachment_type']) => setAttachmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">شهادة</SelectItem>
                    <SelectItem value="id_document">هوية</SelectItem>
                    <SelectItem value="cv">سيرة ذاتية</SelectItem>
                    <SelectItem value="license">ترخيص</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">الوصف (اختياري)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف المرفق"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-judicial-primary hover:bg-judicial-primary/90"
                >
                  {uploading ? 'جاري التحميل...' : 'تحميل'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {attachments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            لا توجد مرفقات
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(attachment.file_type)}</span>
                  <div>
                    <p className="font-medium">{attachment.file_name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="outline">{getAttachmentTypeLabel(attachment.attachment_type)}</Badge>
                      <span>{formatDate(new Date(attachment.created_at))}</span>
                      {attachment.file_size && (
                        <span>({Math.round(attachment.file_size / 1024)} كيلوبايت)</span>
                      )}
                    </div>
                    {attachment.description && (
                      <p className="text-sm text-gray-600 mt-1">{attachment.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadFile(attachment)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(attachment)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertAttachments;
