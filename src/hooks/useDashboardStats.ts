
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalExperts: number;
  activeExperts: number;
  totalCases: number;
  activeCases: number;
  completedCases: number;
  pendingCases: number;
  totalComplaints: number;
  openComplaints: number;
  inheritanceCases: number;
  estateDivisions: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExperts: 0,
    activeExperts: 0,
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    pendingCases: 0,
    totalComplaints: 0,
    openComplaints: 0,
    inheritanceCases: 0,
    estateDivisions: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch experts stats
      const { data: expertsData } = await supabase
        .from('experts')
        .select('status');

      // Fetch cases stats
      const { data: casesData } = await supabase
        .from('inheritance_cases')
        .select('status, case_type');

      // Fetch complaints stats
      const { data: complaintsData } = await supabase
        .from('complaints')
        .select('status');

      const totalExperts = expertsData?.length || 0;
      const activeExperts = expertsData?.filter(e => e.status === 'active').length || 0;
      
      const totalCases = casesData?.length || 0;
      const activeCases = casesData?.filter(c => c.status === 'in_progress').length || 0;
      const completedCases = casesData?.filter(c => c.status === 'completed').length || 0;
      const pendingCases = casesData?.filter(c => c.status === 'registered').length || 0;
      const inheritanceCases = casesData?.filter(c => c.case_type === 'inheritance').length || 0;
      const estateDivisions = casesData?.filter(c => c.case_type === 'estate_division').length || 0;
      
      const totalComplaints = complaintsData?.length || 0;
      const openComplaints = complaintsData?.filter(c => c.status === 'open').length || 0;

      setStats({
        totalExperts,
        activeExperts,
        totalCases,
        activeCases,
        completedCases,
        pendingCases,
        totalComplaints,
        openComplaints,
        inheritanceCases,
        estateDivisions,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإحصائيات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
