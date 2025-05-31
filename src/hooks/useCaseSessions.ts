
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CaseSession {
  id: string;
  case_id: string;
  session_date: string;
  session_type: 'hearing' | 'review' | 'decision' | 'consultation';
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCaseSessions = (caseId?: string) => {
  const [sessions, setSessions] = useState<CaseSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    if (!caseId) return;
    
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .select('*')
        .eq('case_id', caseId)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching case sessions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الجلسات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<CaseSession, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;
      
      setSessions(prev => [data, ...prev]);
      toast({
        title: "نجح",
        description: "تم إنشاء الجلسة بنجاح"
      });
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الجلسة",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSession = async (id: string, updates: Partial<CaseSession>) => {
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSessions(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "نجح",
        description: "تم تحديث الجلسة بنجاح"
      });
      return data;
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الجلسة",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [caseId]);

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    refetch: fetchSessions
  };
};
