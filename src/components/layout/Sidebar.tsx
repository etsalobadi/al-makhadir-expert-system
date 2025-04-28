
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import * as LucideIcons from 'lucide-react';

// Type for navigation item that only allows icon names that exist in lucide-react
type NavigationItem = {
  path: string;
  name: string;
  icon: string;
  roles: string[];
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;

  // Filter navigation items based on user role
  const filteredNavItems = NAVIGATION_ITEMS.filter(
    item => item.roles.includes(user.role)
  );

  return (
    <div className="hidden md:flex flex-col h-screen bg-judicial-primary text-white border-r w-64">
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/placeholder.svg"
            alt="Logo"
            className="h-12 w-auto"
          />
        </div>
        <h2 className="text-xl font-bold text-center text-judicial-secondary mb-2">
          نظام المخادر
        </h2>
        <p className="text-sm text-center text-white/70">لإدارة الخبراء والقضايا</p>
      </div>
      
      <Separator className="bg-white/10" />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {filteredNavItems.map((item: NavigationItem) => {
            const isActive = location.pathname === item.path;
            
            // Check if the icon exists in LucideIcons and render it properly
            // Using a type assertion to tell TypeScript that we're accessing a valid component
            const IconComponent = (LucideIcons as Record<string, React.ComponentType<any>>)[item.icon] || 
                                 LucideIcons.File;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-base font-medium",
                    isActive
                      ? "bg-white/10 text-judicial-secondary"
                      : "text-gray-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      
      <Separator className="bg-white/10" />
      
      <div className="p-4">
        <div className="bg-judicial-primary/50 p-3 rounded-md text-sm">
          <p className="font-bold text-judicial-secondary mb-1">الدعم الفني</p>
          <p>لطلب المساعدة يرجى التواصل مع الدعم الفني</p>
          <p className="mt-1">هاتف: 123-456-789</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
