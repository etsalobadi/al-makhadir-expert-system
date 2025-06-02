
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings,
  ChevronDown,
  ChevronRight,
  Scale,
  User,
  Briefcase,
  ClipboardList,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface NavigationItem {
  path: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: string[];
}

const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    title: "لوحة التحكم",
    items: [
      {
        path: '/',
        name: 'الرئيسية',
        icon: Home,
        roles: ['admin', 'staff', 'judge', 'expert', 'notary', 'inheritance_officer']
      }
    ]
  },
  {
    title: "إدارة القضايا",
    items: [
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
      }
    ]
  },
  {
    title: "إدارة الخبراء",
    items: [
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
      }
    ]
  },
  {
    title: "الخدمات",
    items: [
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
      }
    ]
  },
  {
    title: "إدارة النظام",
    items: [
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
    ]
  }
];

const ModernSidebar: React.FC = () => {
  const location = useLocation();
  const { user, userRoles } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['لوحة التحكم', 'إدارة القضايا']);

  if (!user) return null;

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const hasAccess = (roles: string[]) => {
    return roles.some(role => userRoles.includes(role as any));
  };

  const SidebarContent = () => (
    <>
      {/* Logo and Title */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="text-center">
            <h2 className="text-lg font-bold text-sidebar-primary mb-1">
              نظام المخادر
            </h2>
            <p className="text-sm text-sidebar-foreground/70">
              إدارة الخبراء والقضايا
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {NAVIGATION_GROUPS.map((group) => {
            const hasGroupAccess = group.items.some(item => hasAccess(item.roles));
            if (!hasGroupAccess) return null;

            const isExpanded = expandedGroups.includes(group.title);

            return (
              <div key={group.title} className="space-y-1">
                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10"
                    onClick={() => toggleGroup(group.title)}
                  >
                    <span className="text-xs font-medium">{group.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
                
                {(isExpanded || isCollapsed) && (
                  <div className={cn("space-y-1", !isCollapsed && "mr-2")}>
                    {group.items.map((item) => {
                      if (!hasAccess(item.roles)) return null;
                      
                      const isActive = location.pathname === item.path;
                      const IconComponent = item.icon;

                      return (
                        <Link key={item.path} to={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 text-base font-medium transition-all duration-200",
                              isActive
                                ? "bg-sidebar-primary text-white shadow-lg"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isCollapsed && "justify-center px-2"
                            )}
                          >
                            <IconComponent className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Support Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="bg-sidebar-accent/20 p-3 rounded-lg text-sm">
            <p className="font-bold text-sidebar-primary mb-1">الدعم الفني</p>
            <p className="text-sidebar-foreground/70 mb-2">
              للمساعدة والدعم التقني
            </p>
            <p className="text-sidebar-foreground/70">📞 789-456-123</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden bg-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col h-screen bg-sidebar border-l border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-4 top-6 bg-white border border-sidebar-border shadow-sm z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
        </Button>

        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-sidebar border-l border-sidebar-border z-50 transform transition-transform duration-300 md:hidden",
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default ModernSidebar;
