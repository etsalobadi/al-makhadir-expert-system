
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ExpertAttachment } from '@/types/database';
import { transformExpertAttachmentsFromDB, transformExpertAttachmentFromDB } from '@/utils/databaseTransforms';

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
      
      const typedAttachments = transformExpertAttachmentsFromDB(data || []);
      setAttachments(typedAttachments);
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
      
      const typedAttachment = transformExpertAttachmentFromDB(data);
      setAttachments(prev => [typedAttachment, ...prev]);
      toast({
        title: "نجح",
        description: "تم إضافة المرفق بنجاح"
      });
      return typedAttachment;
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

export type { ExpertAttachment };
