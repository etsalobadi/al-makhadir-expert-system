
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
        // Transform the data to match our interface
        const transformedData: UserSettings = {
          id: data.id,
          user_id: data.user_id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          language: data.language || 'ar',
          timezone: data.timezone || 'Asia/Riyadh',
          notifications: typeof data.notifications === 'object' && data.notifications !== null 
            ? data.notifications as UserSettings['notifications']
            : {
                email: true,
                sms: false,
                push: true,
                system: true
              },
          security: typeof data.security === 'object' && data.security !== null
            ? data.security as UserSettings['security']
            : {
                twoFactor: false,
                sessionTimeout: '30',
                passwordExpiry: '90'
              },
          system: typeof data.system === 'object' && data.system !== null
            ? data.system as UserSettings['system']
            : {
                autoBackup: true,
                backupFrequency: 'daily',
                dataRetention: '365',
                auditLog: true
              }
        };
        setSettings(transformedData);
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
        
        // Transform the inserted data
        const transformedNewData: UserSettings = {
          id: newData.id,
          user_id: newData.user_id,
          name: newData.name || '',
          email: newData.email || '',
          phone: newData.phone || '',
          language: newData.language || 'ar',
          timezone: newData.timezone || 'Asia/Riyadh',
          notifications: typeof newData.notifications === 'object' && newData.notifications !== null 
            ? newData.notifications as UserSettings['notifications']
            : defaultSettings.notifications,
          security: typeof newData.security === 'object' && newData.security !== null
            ? newData.security as UserSettings['security']
            : defaultSettings.security,
          system: typeof newData.system === 'object' && newData.system !== null
            ? newData.system as UserSettings['system']
            : defaultSettings.system
        };
        
        setSettings(transformedNewData);
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
      
      // Transform the updated data
      const transformedData: UserSettings = {
        id: data.id,
        user_id: data.user_id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        language: data.language || 'ar',
        timezone: data.timezone || 'Asia/Riyadh',
        notifications: typeof data.notifications === 'object' && data.notifications !== null 
          ? data.notifications as UserSettings['notifications']
          : settings.notifications,
        security: typeof data.security === 'object' && data.security !== null
          ? data.security as UserSettings['security']
          : settings.security,
        system: typeof data.system === 'object' && data.system !== null
          ? data.system as UserSettings['system']
          : settings.system
      };
      
      setSettings(transformedData);
      
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
      
      return transformedData;
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
