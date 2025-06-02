
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings,
  Scale,
  Briefcase,
  ClipboardList,
  BarChart3,
  LucideIcon
} from 'lucide-react';

interface NavigationItem {
  path: string;
  name: string;
  icon: LucideIcon;
  roles: string[];
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: '/',
    name: 'الرئيسية',
    icon: Home,
    roles: ['admin', 'staff', 'judge', 'expert', 'notary', 'inheritance_officer']
  },
  {
    path: '/cases',
    name: 'القضايا',
    icon: Scale,
    roles: ['admin', 'staff', 'judge']
  },
  {
    path: '/sessions',
    name: 'الجلسات',
    icon: Calendar,
    roles: ['admin', 'staff', 'judge']
  },
  {
    path: '/announcements',
    name: 'الإعلانات القضائية',
    icon: FileText,
    roles: ['admin', 'staff', 'judge', 'expert', 'notary', 'inheritance_officer']
  },
  {
    path: '/experts',
    name: 'الخبراء',
    icon: Users,
    roles: ['admin', 'staff', 'judge']
  },
  {
    path: '/inheritance',
    name: 'قسمة المواريث',
    icon: Briefcase,
    roles: ['admin', 'staff', 'inheritance_officer']
  },
  {
    path: '/electronic-services',
    name: 'الخدمات الإلكترونية',
    icon: ClipboardList,
    roles: ['admin', 'staff', 'judge', 'expert', 'notary', 'inheritance_officer']
  },
  {
    path: '/complaints',
    name: 'الشكاوى',
    icon: MessageSquare,
    roles: ['admin', 'staff']
  },
  {
    path: '/reports',
    name: 'التقارير',
    icon: BarChart3,
    roles: ['admin', 'staff']
  },
  {
    path: '/settings',
    name: 'الإعدادات',
    icon: Settings,
    roles: ['admin']
  }
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { userRoles } = useAuth();

  const hasAccess = (roles: string[]) => {
    return roles.some(role => userRoles.includes(role as any));
  };

  const filteredItems = NAVIGATION_ITEMS.filter(item => hasAccess(item.roles));

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
            </div>
            نظام المخادر
          </DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-6">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;

              return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-base font-medium h-12",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
