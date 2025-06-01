
import React from 'react';
import { useAuth } from '../../context/AuthContext';
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
import { LogOut, User, Settings, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, userRoles } = useAuth();

  const getUserDisplayName = () => {
    return user?.email?.split('@')[0] || 'المستخدم';
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-2 px-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-judicial-primary">
          مركز خبراء القضاء - المحكمة الابتدائية بالمخادر
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-0">
                <div className="text-right ml-2">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(userRoles)}
                  </p>
                </div>
                <Avatar>
                  <AvatarImage src="" alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-judicial-primary text-white">
                    {getUserDisplayName().charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="w-4 h-4" /> الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-500" 
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" /> تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
