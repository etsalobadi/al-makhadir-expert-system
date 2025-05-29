
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ReportData {
  totalCases: number;
  activeExperts: number;
  completionRate: number;
  averageResolutionTime: number;
  casesData: Array<{
    month: string;
    completed: number;
    pending: number;
    new: number;
  }>;
  expertsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  performanceData: Array<{
    day: string;
    efficiency: number;
  }>;
  complaintsStats: {
    total: number;
    open: number;
    processing: number;
    resolved: number;
  };
}

export const useReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      // Fetch data from multiple tables
      const [casesResult, complaintsResult] = await Promise.all([
        supabase.from('inheritance_cases').select('*'),
        supabase.from('complaints').select('*')
      ]);

      if (casesResult.error) throw casesResult.error;
      if (complaintsResult.error) throw complaintsResult.error;

      const cases = casesResult.data || [];
      const complaints = complaintsResult.data || [];

      // Process the data for reports
      const totalCases = cases.length;
      const completedCases = cases.filter(c => c.status === 'completed').length;
      const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

      // Group cases by month (mock data for now)
      const casesData = [
        { month: 'يناير', completed: Math.floor(totalCases * 0.4), pending: Math.floor(totalCases * 0.1), new: Math.floor(totalCases * 0.2) },
        { month: 'فبراير', completed: Math.floor(totalCases * 0.5), pending: Math.floor(totalCases * 0.15), new: Math.floor(totalCases * 0.25) },
        { month: 'مارس', completed: Math.floor(totalCases * 0.3), pending: Math.floor(totalCases * 0.12), new: Math.floor(totalCases * 0.23) },
        { month: 'أبريل', completed: Math.floor(totalCases * 0.6), pending: Math.floor(totalCases * 0.18), new: Math.floor(totalCases * 0.28) },
        { month: 'مايو', completed: Math.floor(totalCases * 0.55), pending: Math.floor(totalCases * 0.16), new: Math.floor(totalCases * 0.35) },
        { month: 'يونيو', completed: Math.floor(totalCases * 0.65), pending: Math.floor(totalCases * 0.11), new: Math.floor(totalCases * 0.30) }
      ];

      // Experts distribution (mock data)
      const expertsData = [
        { name: 'خبراء عقارات', value: 45, color: '#0088FE' },
        { name: 'خبراء مالية', value: 32, color: '#00C49F' },
        { name: 'خبراء طبية', value: 28, color: '#FFBB28' },
        { name: 'خبراء تقنية', value: 15, color: '#FF8042' }
      ];

      // Performance data (mock data)
      const performanceData = [
        { day: 'السبت', efficiency: 85 },
        { day: 'الأحد', efficiency: 92 },
        { day: 'الاثنين', efficiency: 78 },
        { day: 'الثلاثاء', efficiency: 88 },
        { day: 'الأربعاء', efficiency: 95 },
        { day: 'الخميس', efficiency: 82 }
      ];

      // Complaints statistics
      const complaintsStats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'open').length,
        processing: complaints.filter(c => c.status === 'processing').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      };

      setReportData({
        totalCases,
        activeExperts: 120, // Mock data
        completionRate,
        averageResolutionTime: 15, // Mock data
        casesData,
        expertsData,
        performanceData,
        complaintsStats
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التقارير",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (format: 'pdf' | 'excel', reportType: string, dateRange: string) => {
    try {
      toast({
        title: "جاري الإنتاج",
        description: `جاري إنتاج التقرير بصيغة ${format.toUpperCase()}...`
      });
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "نجح",
        description: `تم إنتاج التقرير بصيغة ${format.toUpperCase()} بنجاح`
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنتاج التقرير",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return {
    reportData,
    loading,
    generateReport,
    refetch: fetchReportData
  };
};
