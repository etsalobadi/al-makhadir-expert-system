
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';
import { formatDate } from '@/utils/helpers';

interface ComplaintViewDialogProps {
  complaint: Complaint;
}

const ComplaintViewDialog: React.FC<ComplaintViewDialogProps> = ({ complaint }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(complaint.status);
  const [assignedTo, setAssignedTo] = useState(complaint.assigned_to || '');
  const [resolution, setResolution] = useState(complaint.resolution || '');
  const [loading, setLoading] = useState(false);
  const { updateComplaint } = useComplaints();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'مفتوحة', className: 'bg-red-100 text-red-800' },
      processing: { label: 'قيد المعالجة', className: 'bg-yellow-100 text-yellow-800' },
      resolved: { label: 'محلولة', className: 'bg-green-100 text-green-800' },
      closed: { label: 'مغلقة', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'منخفضة', className: 'bg-blue-100 text-blue-800' },
      medium: { label: 'متوسطة', className: 'bg-orange-100 text-orange-800' },
      high: { label: 'عالية', className: 'bg-red-100 text-red-800' },
      urgent: { label: 'عاجلة', className: 'bg-purple-100 text-purple-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      technical: 'تقنية',
      administrative: 'إدارية',
      legal: 'قانونية',
      other: 'أخرى'
    };
    return typeLabels[type as keyof typeof typeLabels];
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateComplaint(complaint.id, {
        status: status as Complaint['status'],
        assigned_to: assignedTo || null,
        resolution: resolution || null
      });
      setEditing(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 ml-1" />
          عرض
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل الشكوى</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">العنوان</Label>
              <p className="mt-1 text-lg font-semibold">{complaint.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">النوع</Label>
              <p className="mt-1">{getTypeLabel(complaint.type)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">الحالة</Label>
              <div className="mt-1">
                {editing ? (
                  <Select value={status} onValueChange={(value: Complaint['status']) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">مفتوحة</SelectItem>
                      <SelectItem value="processing">قيد المعالجة</SelectItem>
                      <SelectItem value="resolved">محلولة</SelectItem>
                      <SelectItem value="closed">مغلقة</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(complaint.status)
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">الأولوية</Label>
              <div className="mt-1">{getPriorityBadge(complaint.priority)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">المقدم</Label>
              <p className="mt-1">{complaint.submitted_by}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">تاريخ التقديم</Label>
              <p className="mt-1">{formatDate(new Date(complaint.submitted_date))}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">الوصف</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm leading-relaxed">
              {complaint.description}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">المعين للمعالجة</Label>
            {editing ? (
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                placeholder="اسم المسؤول المعين"
              />
            ) : (
              <p className="mt-1">{complaint.assigned_to || 'غير معين'}</p>
            )}
          </div>

          {(complaint.resolution || editing) && (
            <div>
              <Label className="text-sm font-medium text-gray-600">الحل / الرد</Label>
              {editing ? (
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="اكتب الحل أو الرد على الشكوى..."
                />
              ) : (
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm leading-relaxed">
                  {complaint.resolution || 'لم يتم تقديم حل بعد'}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 justify-end border-t pt-4">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-judicial-primary hover:bg-judicial-primary/90"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                className="bg-judicial-primary hover:bg-judicial-primary/90"
              >
                تحديث الشكوى
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintViewDialog;
