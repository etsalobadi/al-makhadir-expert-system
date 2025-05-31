
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ExpertAttachment {
  id: string;
  expert_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  attachment_type: 'certificate' | 'id_document' | 'cv' | 'license' | 'other';
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useExpertAttachments = (expertId?: string) => {
  const [attachments, setAttachments] = useState<ExpertAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttachments = async () => {
    if (!expertId) return;
    
    try {
      const { data, error } = await supabase
        .from('expert_attachments')
        .select('*')
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching expert attachments:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المرفقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAttachment = async (attachment: Omit<ExpertAttachment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('expert_attachments')
        .insert([attachment])
        .select()
        .single();

      if (error) throw error;
      
      setAttachments(prev => [data, ...prev]);
      toast({
        title: "نجح",
        description: "تم إضافة المرفق بنجاح"
      });
      return data;
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المرفق",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteAttachment = async (id: string, filePath: string) => {
    try {
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('attachments')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Then delete from database
      const { error } = await supabase
        .from('expert_attachments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAttachments(prev => prev.filter(a => a.id !== id));
      toast({
        title: "نجح",
        description: "تم حذف المرفق بنجاح"
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المرفق",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [expertId]);

  return {
    attachments,
    loading,
    addAttachment,
    deleteAttachment,
    refetch: fetchAttachments
  };
};
