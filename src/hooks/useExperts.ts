
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Expert {
  id: string;
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  specialty: 'engineering' | 'accounting' | 'medical' | 'it' | 'real_estate' | 'inheritance';
  qualification?: string;
  university?: string;
  graduation_year?: string;
  experience_years?: number;
  status: 'active' | 'pending' | 'suspended' | 'expired';
  previous_cases: number;
  created_at: string;
  updated_at: string;
}

export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      // Use direct query with type casting since experts table is new
      const { data, error } = await supabase
        .from('experts' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setExperts((data as unknown as Expert[]) || []);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الخبراء",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createExpert = async (expert: Omit<Expert, 'id' | 'created_at' | 'updated_at' | 'previous_cases'>) => {
    try {
      const { data, error } = await supabase
        .from('experts' as any)
        .insert([{ ...expert, previous_cases: 0 }])
        .select()
        .single();

      if (error) throw error;
      
      setExperts(prev => [data as unknown as Expert, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء الخبير بنجاح"
      });
      return data as unknown as Expert;
    } catch (error) {
      console.error('Error creating expert:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الخبير",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateExpert = async (id: string, updates: Partial<Expert>) => {
    try {
      const { data, error } = await supabase
        .from('experts' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setExperts(prev => prev.map(e => e.id === id ? data as unknown as Expert : e));
      toast({
        title: "نجح",
        description: "تم تحديث الخبير بنجاح"
      });
      return data as unknown as Expert;
    } catch (error) {
      console.error('Error updating expert:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الخبير",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteExpert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experts' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExperts(prev => prev.filter(e => e.id !== id));
      toast({
        title: "نجح",
        description: "تم حذف الخبير بنجاح"
      });
    } catch (error) {
      console.error('Error deleting expert:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخبير",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return {
    experts,
    loading,
    createExpert,
    updateExpert,
    deleteExpert,
    refetch: fetchExperts
  };
};
