
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Announcement {
  id: string;
  caseNumber: string;
  court: string;
  announcer: string;
  sessionDate: Date;
  announcementType: string;
  status: 'active' | 'expired' | 'updated';
  lastUpdate: Date;
  description: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll use mock data since there's no announcements table
      // In a real implementation, this would be:
      // const { data, error } = await supabase.from('announcements').select('*');
      
      const mockData: Announcement[] = [
        {
          id: '1',
          caseNumber: 'قضية-2024-001',
          court: 'المحكمة الابتدائية بالمخادر',
          announcer: 'القاضي أحمد السعيد',
          sessionDate: new Date('2024-01-15'),
          announcementType: 'استدعاء خبير',
          status: 'active',
          lastUpdate: new Date('2024-01-10'),
          description: 'استدعاء خبير هندسي لفحص العقار'
        },
        {
          id: '2',
          caseNumber: 'قضية-2024-002',
          court: 'المحكمة الابتدائية بالمخادر',
          announcer: 'القاضي فاطمة الزهراء',
          sessionDate: new Date('2024-01-20'),
          announcementType: 'إعلان جلسة',
          status: 'active',
          lastUpdate: new Date('2024-01-12'),
          description: 'إعلان جلسة محاكمة'
        },
        {
          id: '3',
          caseNumber: 'قضية-2024-003',
          court: 'محكمة الاستئناف',
          announcer: 'القاضي محمد الحسني',
          sessionDate: new Date('2024-01-25'),
          announcementType: 'تأجيل جلسة',
          status: 'updated',
          lastUpdate: new Date('2024-01-15'),
          description: 'تأجيل جلسة الاستئناف لأسباب فنية'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnnouncements(mockData);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في جلب الإعلانات');
      console.error('Error fetching announcements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    isLoading,
    error,
    refetch: fetchAnnouncements
  };
};
