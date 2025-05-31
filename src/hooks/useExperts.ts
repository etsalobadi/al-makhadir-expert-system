
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Expert } from '@/types/database';
import { transformExpertsFromDB, transformExpertFromDB } from '@/utils/databaseTransforms';

export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedExperts = transformExpertsFromDB(data || []);
      setExperts(typedExperts);
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
        .from('experts')
        .insert([{ ...expert, previous_cases: 0 }])
        .select()
        .single();

      if (error) throw error;
      
      const typedExpert = transformExpertFromDB(data);
      setExperts(prev => [typedExpert, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء الخبير بنجاح"
      });
      return typedExpert;
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
        .from('experts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedExpert = transformExpertFromDB(data);
      setExperts(prev => prev.map(e => e.id === id ? typedExpert : e));
      toast({
        title: "نجح",
        description: "تم تحديث الخبير بنجاح"
      });
      return typedExpert;
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
        .from('experts')
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
