
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Briefcase,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface NavigationItem {
  path: string;
  name: string;
  icon: LucideIcon;
  roles: string[];
}

const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    title: "لوحة التحكم",
    items: [
      {
        path: '/dashboard',
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
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
            <Scale className="w-6 h-6 text-white" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-1">
              نظام المخادر
            </h2>
            <p className="text-sm text-gray-300">
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
                  <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.title)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-xs font-medium">{group.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-1 mr-2">
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
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                              )}
                            >
                              <IconComponent className="w-5 h-5 flex-shrink-0" />
                              <span>{item.name}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {isCollapsed && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      if (!hasAccess(item.roles)) return null;
                      
                      const isActive = location.pathname === item.path;
                      const IconComponent = item.icon;

                      return (
                        <Link key={item.path} to={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-center p-2 transition-all duration-200",
                              isActive
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            )}
                          >
                            <IconComponent className="w-5 h-5" />
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
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="bg-gray-700/50 p-3 rounded-lg text-sm">
            <p className="font-bold text-yellow-400 mb-1">الدعم الفني</p>
            <p className="text-gray-300 mb-2">
              للمساعدة والدعم التقني
            </p>
            <p className="text-gray-300">📞 789-456-123</p>
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
        "hidden md:flex flex-col h-screen bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 transition-all duration-300 shadow-xl",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-4 top-6 bg-white border border-gray-300 shadow-sm z-10 hover:bg-gray-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
        </Button>

        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 z-50 transform transition-transform duration-300 md:hidden shadow-2xl",
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default ModernSidebar;
