
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserSettings {
  id?: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
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
    auditLog: boolean;
    autoBackup: boolean;
    backupFrequency: string;
    dataRetention: string;
  };
}

const defaultSettings: Omit<UserSettings, 'id' | 'user_id'> = {
  name: '',
  email: '',
  phone: '',
  avatar_url: '',
  language: 'ar',
  timezone: 'Asia/Riyadh',
  notifications: {
    email: true,
    sms: false,
    push: true,
    system: true,
  },
  security: {
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  },
  system: {
    auditLog: true,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '365',
  },
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getUserDisplayName = () => {
    return user?.email?.split('@')[0] || '';
  };

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['userSettings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create default settings if none exist
        const newSettings: UserSettings = {
          ...defaultSettings,
          user_id: user.id,
          name: getUserDisplayName(),
          email: user.email || '',
        };

        const { data: created, error: createError } = await supabase
          .from('user_settings')
          .insert(newSettings)
          .select()
          .single();

        if (createError) throw createError;
        return created;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', user?.id] });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الإعدادات بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الحفظ",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  return {
    settings: settings || { ...defaultSettings, user_id: user?.id || '', name: getUserDisplayName(), email: user?.email || '' },
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
};
