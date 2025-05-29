
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface UserSettings {
  id?: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    system: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: string;
    passwordExpiry: string;
  };
  system: {
    autoBackup: boolean;
    backupFrequency: string;
    dataRetention: string;
    auditLog: boolean;
  };
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const defaultSettings: Omit<UserSettings, 'id'> = {
          user_id: user.id,
          name: user.name || '',
          email: user.email || '',
          phone: '',
          language: 'ar',
          timezone: 'Asia/Riyadh',
          notifications: {
            email: true,
            sms: false,
            push: true,
            system: true
          },
          security: {
            twoFactor: false,
            sessionTimeout: '30',
            passwordExpiry: '90'
          },
          system: {
            autoBackup: true,
            backupFrequency: 'daily',
            dataRetention: '365',
            auditLog: true
          }
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('user_settings')
          .insert([defaultSettings])
          .select()
          .single();
          
        if (insertError) throw insertError;
        setSettings(newData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعدادات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user?.id || !settings) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setSettings(data);
      
      // Log the change
      await supabase.from('audit_log').insert([{
        user_id: user.id,
        action: 'UPDATE',
        table_name: 'user_settings',
        record_id: settings.id,
        new_values: updates
      }]);
      
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.id]);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
