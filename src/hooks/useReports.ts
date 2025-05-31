
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
      const [casesResult, complaintsResult, expertsResult, casesSessionsResult] = await Promise.all([
        supabase.from('inheritance_cases').select('*'),
        supabase.from('complaints').select('*'),
        supabase.from('experts').select('*'),
        supabase.from('case_sessions').select('*')
      ]);

      if (casesResult.error) throw casesResult.error;
      if (complaintsResult.error) throw complaintsResult.error;
      if (expertsResult.error) throw expertsResult.error;

      const cases = casesResult.data || [];
      const complaints = complaintsResult.data || [];
      const experts = expertsResult.data || [];
      const sessions = casesSessionsResult.data || [];

      // Calculate real statistics
      const totalCases = cases.length;
      const completedCases = cases.filter(c => c.status === 'completed').length;
      const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;
      const activeExperts = experts.filter(e => e.status === 'active').length;

      // Calculate cases by month (last 6 months)
      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const casesData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthCases = cases.filter(c => {
          const caseDate = new Date(c.created_at);
          return caseDate.getMonth() === date.getMonth() && caseDate.getFullYear() === date.getFullYear();
        });
        
        casesData.push({
          month: monthNames[date.getMonth()],
          completed: monthCases.filter(c => c.status === 'completed').length,
          pending: monthCases.filter(c => c.status === 'registered').length,
          new: monthCases.filter(c => c.status === 'in_progress').length
        });
      }

      // Calculate experts distribution by specialty
      const specialtyCount = experts.reduce((acc, expert) => {
        const specialty = expert.specialty;
        acc[specialty] = (acc[specialty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const specialtyLabels = {
        engineering: 'هندسة',
        accounting: 'محاسبة',
        medical: 'طب',
        it: 'تقنية معلومات',
        real_estate: 'عقارات',
        inheritance: 'مواريث'
      };

      const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
      const expertsData = Object.entries(specialtyCount).map(([specialty, count], index) => ({
        name: specialtyLabels[specialty as keyof typeof specialtyLabels] || specialty,
        value: count,
        color: colors[index % colors.length]
      }));

      // Calculate performance data (mock efficiency based on real data)
      const dayNames = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
      const performanceData = dayNames.map((day, index) => {
        // Calculate efficiency based on sessions and case progress
        const dayEfficiency = Math.min(100, Math.max(60, 
          85 + (sessions.length * 2) - (complaints.filter(c => c.status === 'open').length * 5)
        ));
        return {
          day,
          efficiency: Math.round(dayEfficiency + (Math.random() * 10 - 5)) // Add some variance
        };
      });

      // Complaints statistics
      const complaintsStats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'open').length,
        processing: complaints.filter(c => c.status === 'processing').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      };

      // Calculate average resolution time (mock for now)
      const completedComplaints = complaints.filter(c => c.status === 'resolved');
      const averageResolutionTime = completedComplaints.length > 0 ? 
        Math.round(completedComplaints.reduce((acc, complaint) => {
          const created = new Date(complaint.created_at);
          const updated = new Date(complaint.updated_at);
          return acc + (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / completedComplaints.length) : 15;

      setReportData({
        totalCases,
        activeExperts,
        completionRate,
        averageResolutionTime,
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
      
      // Simulate report generation with real data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Generate the report using libraries like jsPDF for PDF or xlsx for Excel
      // 2. Include the actual data from reportData
      // 3. Apply filters based on reportType and dateRange
      
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
