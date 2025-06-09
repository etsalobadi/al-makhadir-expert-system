import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Search, UserCheck } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'] | 'user';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  roles: UserRole[];
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'مدير النظام',
  judge: 'قاضٍ',
  staff: 'موظف النظام',
  user: 'مستخدم عادي',
  expert: 'خبير',
  notary: 'كاتب عدل',
  inheritance_officer: 'موظف مواريث'
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800',
  judge: 'bg-purple-100 text-purple-800',
  staff: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-800',
  expert: 'bg-green-100 text-green-800',
  notary: 'bg-yellow-100 text-yellow-800',
  inheritance_officer: 'bg-orange-100 text-orange-800'
};

const RoleManagement: React.FC = () => {
  const { userRoles } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

  // Check if current user is admin
  const isAdmin = userRoles.includes('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profiles?.map(profile => {
        const roles = userRoles?.filter(ur => ur.user_id === profile.user_id).map(ur => ur.role) || [];
        return { ...profile, roles };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل المستخدمين',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // First, remove all existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then add the new role (handle 'user' role which may not be in the enum)
      if (newRole === 'user') {
        // For 'user' role, we'll use a workaround since it's not in the enum yet
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: 'staff' as Database['public']['Enums']['app_role'] }]);
        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: newRole as Database['public']['Enums']['app_role'] }]);
        if (insertError) throw insertError;
      }

      // Update local state
      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, roles: [newRole] }
          : user
      ));

      toast({
        title: 'تم التحديث',
        description: 'تم تحديث دور المستخدم بنجاح',
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحديث دور المستخدم',
        variant: 'destructive'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesRole = selectedRole === 'all' || user.roles.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  if (!isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">غير مخول</h3>
            <p className="text-gray-500">ليس لديك صلاحية الوصول لهذه الصفحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            إدارة أدوار المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <SelectItem key={role} value={role}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-judicial-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">جاري التحميل...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-judicial-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{user.full_name}</h3>
                        {user.phone && (
                          <p className="text-sm text-gray-500">الهاتف: {user.phone}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              className={`${ROLE_COLORS[role]} border-0`}
                            >
                              {ROLE_LABELS[role]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.roles[0] || 'user'}
                          onValueChange={(value) => updateUserRole(user.user_id, value as UserRole)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROLE_LABELS).map(([role, label]) => (
                              <SelectItem key={role} value={role}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد نتائج</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;