import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LogOut, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const ModernHeader: React.FC = () => {
  const { user, logout, userRoles } = useAuth();
  const { settings } = useUserSettings();
  const navigate = useNavigate();

  const getUserDisplayName = () => {
    return settings?.name || user?.email?.split('@')[0] || 'المستخدم';
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('admin')) return 'مدير النظام';
    if (roles.includes('staff')) return 'موظف';
    if (roles.includes('judge')) return 'قاضي';
    if (roles.includes('expert')) return 'خبير';
    if (roles.includes('notary')) return 'موثق';
    if (roles.includes('inheritance_officer')) return 'مسؤول مواريث';
    return 'مستخدم';
  };

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes('admin')) return 'bg-red-100 text-red-800';
    if (roles.includes('judge')) return 'bg-purple-100 text-purple-800';
    if (roles.includes('staff')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Title */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              مركز خبراء القضاء
            </h1>
            <p className="text-sm text-gray-500">
              المحكمة الابتدائية بالمخادر
            </p>
          </div>
        </div>

        {/* Center Section - Search (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-gray-50">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getRoleBadgeColor(userRoles))}>
                        {getRoleDisplayName(userRoles)}
                      </Badge>
                    </div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={settings?.avatar_url || ""} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {getUserDisplayName().charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-right">
                  <div>
                    <p className="font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" 
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <SearchBar />
      </div>
    </header>
  );
};

export default ModernHeader;
