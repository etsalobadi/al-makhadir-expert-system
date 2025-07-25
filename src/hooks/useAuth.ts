import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'staff' | 'judge' | 'expert' | 'notary' | 'inheritance_officer';

export interface AuthUser extends User {
  roles?: UserRole[];
  userType?: 'internal' | 'external';
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRoles: UserRole[];
  login: (email: string, password: string, userType?: 'internal' | 'external') => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        if (session?.user) {
          // Use setTimeout to prevent blocking the auth state change
          setTimeout(async () => {
            if (mounted) {
              const userWithRoles = await enrichUserWithRoles(session.user);
              setUser(userWithRoles);
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setUserRoles([]);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      if (session?.user) {
        const userWithRoles = await enrichUserWithRoles(session.user);
        setUser(userWithRoles);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const enrichUserWithRoles = async (user: User): Promise<AuthUser> => {
    try {
      console.log('Enriching user with roles for:', user.email, 'ID:', user.id);
      
      const { data: rolesData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        toast({
          title: "خطأ في جلب الأدوار",
          description: "حدث خطأ في جلب أدوار المستخدم",
          variant: "destructive"
        });
        return user as AuthUser;
      }

      const roles = rolesData?.map(r => r.role) || [];
      setUserRoles(roles);
      
      const internalRoles = ['admin', 'staff', 'judge'];
      const userType = roles.some(role => internalRoles.includes(role)) ? 'internal' : 'external';

      console.log('User roles set:', roles, 'User type:', userType);

      return {
        ...user,
        roles,
        userType
      } as AuthUser;
    } catch (error) {
      console.error('Error enriching user with roles:', error);
      return user as AuthUser;
    }
  };

  const login = async (email: string, password: string, userType?: 'internal' | 'external') => {
    try {
      setIsLoading(true);
      console.log('Login attempt:', { email, userType });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      console.log('Login successful:', data);

      if (userType && data.user) {
        await supabase.auth.updateUser({
          data: { userType }
        });
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام مركز خبراء القضاء"
      });
    } catch (error: any) {
      console.error('Login error details:', error);
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'بيانات تسجيل الدخول غير صحيحة';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'يرجى تأكيد البريد الإلكتروني أولاً';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'محاولات كثيرة. يرجى المحاولة لاحقاً';
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOTP = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال رمز التحقق",
        description: "سيتم إرسال رمز التحقق إلى رقم هاتفك"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رمز التحقق",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: "تم التحقق بنجاح",
        description: "مرحباً بك في النظام"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في التحقق",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setUserRoles([]);

      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نشكرك لاستخدام النظام"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى فحص بريدك الإلكتروني"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رابط إعادة التعيين",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  return {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    userRoles,
    login,
    loginWithOTP: async (phone: string) => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            channel: 'sms'
          }
        });

        if (error) throw error;

        toast({
          title: "تم إرسال رمز التحقق",
          description: "سيتم إرسال رمز التحقق إلى رقم هاتفك"
        });
      } catch (error: any) {
        toast({
          title: "خطأ في إرسال رمز التحقق",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    },
    verifyOTP: async (phone: string, token: string) => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token,
          type: 'sms'
        });

        if (error) throw error;

        toast({
          title: "تم التحقق بنجاح",
          description: "مرحباً بك في النظام"
        });
      } catch (error: any) {
        toast({
          title: "خطأ في التحقق",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    },
    signup: async (email: string, password: string, userData: any) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });

        if (error) throw error;

        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
        });
      } catch (error: any) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    logout,
    resetPassword,
    hasRole,
    hasAnyRole
  };
};
