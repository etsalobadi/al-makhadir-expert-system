
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: 'technical' | 'administrative' | 'legal' | 'other';
  status: 'open' | 'processing' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submitted_by: string;
  submitted_date: string;
  assigned_to?: string;
  resolution?: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الشكاوى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at' | 'submitted_date'>) => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([complaint])
        .select()
        .single();

      if (error) throw error;
      
      setComplaints(prev => [data, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء الشكوى بنجاح"
      });
      return data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الشكوى",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setComplaints(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "نجح",
        description: "تم تحديث الشكوى بنجاح"
      });
      return data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الشكوى",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return {
    complaints,
    loading,
    createComplaint,
    updateComplaint,
    refetch: fetchComplaints
  };
};
