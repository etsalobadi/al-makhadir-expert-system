
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InheritanceCase {
  id: string;
  case_number: string;
  court_number: string;
  deceased_name: string;
  death_date: string;
  death_certificate_number?: string;
  case_type: 'inheritance' | 'estate_division' | 'will_execution';
  status: 'registered' | 'in_progress' | 'completed' | 'closed';
  assigned_expert?: string;
  total_estate_value?: number;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export const useInheritanceCases = () => {
  const [cases, setCases] = useState<InheritanceCase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('inheritance_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCases((data as unknown as InheritanceCase[]) || []);
    } catch (error) {
      console.error('Error fetching inheritance cases:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قضايا الميراث",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: Omit<InheritanceCase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('inheritance_cases')
        .insert([caseData as any])
        .select()
        .single();

      if (error) throw error;
      
      setCases(prev => [data as unknown as InheritanceCase, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء القضية بنجاح"
      });
      return data as unknown as InheritanceCase;
    } catch (error) {
      console.error('Error creating inheritance case:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء القضية",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCase = async (id: string, updates: Partial<InheritanceCase>) => {
    try {
      const { data, error } = await supabase
        .from('inheritance_cases')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCases(prev => prev.map(c => c.id === id ? data as unknown as InheritanceCase : c));
      toast({
        title: "نجح",
        description: "تم تحديث القضية بنجاح"
      });
      return data as unknown as InheritanceCase;
    } catch (error) {
      console.error('Error updating inheritance case:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث القضية",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inheritance_cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCases(prev => prev.filter(c => c.id !== id));
      toast({
        title: "نجح",
        description: "تم حذف القضية بنجاح"
      });
    } catch (error) {
      console.error('Error deleting inheritance case:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف القضية",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    createCase,
    updateCase,
    deleteCase,
    refetch: fetchCases
  };
};
