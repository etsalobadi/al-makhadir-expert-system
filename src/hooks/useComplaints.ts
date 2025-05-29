
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
      
      // Transform the data to match our interface
      const transformedData: Complaint[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type as Complaint['type'],
        status: item.status as Complaint['status'],
        priority: item.priority as Complaint['priority'],
        submitted_by: item.submitted_by,
        submitted_date: item.submitted_date,
        assigned_to: item.assigned_to,
        resolution: item.resolution,
        attachments: Array.isArray(item.attachments) ? item.attachments : [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setComplaints(transformedData);
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
      
      // Transform the returned data
      const transformedData: Complaint = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as Complaint['type'],
        status: data.status as Complaint['status'],
        priority: data.priority as Complaint['priority'],
        submitted_by: data.submitted_by,
        submitted_date: data.submitted_date,
        assigned_to: data.assigned_to,
        resolution: data.resolution,
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setComplaints(prev => [transformedData, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء الشكوى بنجاح"
      });
      return transformedData;
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
      
      // Transform the returned data
      const transformedData: Complaint = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as Complaint['type'],
        status: data.status as Complaint['status'],
        priority: data.priority as Complaint['priority'],
        submitted_by: data.submitted_by,
        submitted_date: data.submitted_date,
        assigned_to: data.assigned_to,
        resolution: data.resolution,
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setComplaints(prev => prev.map(c => c.id === id ? transformedData : c));
      toast({
        title: "نجح",
        description: "تم تحديث الشكوى بنجاح"
      });
      return transformedData;
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
