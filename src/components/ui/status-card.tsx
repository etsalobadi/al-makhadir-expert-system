
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  count: number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'text-gray-600 bg-gray-100',
    badge: 'bg-gray-100 text-gray-800',
    trend: 'text-gray-600'
  },
  primary: {
    icon: 'text-blue-600 bg-blue-100',
    badge: 'bg-blue-100 text-blue-800',
    trend: 'text-blue-600'
  },
  success: {
    icon: 'text-green-600 bg-green-100',
    badge: 'bg-green-100 text-green-800',
    trend: 'text-green-600'
  },
  warning: {
    icon: 'text-yellow-600 bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800',
    trend: 'text-yellow-600'
  },
  error: {
    icon: 'text-red-600 bg-red-100',
    badge: 'bg-red-100 text-red-800',
    trend: 'text-red-600'
  }
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  description,
  icon: Icon,
  variant = 'default',
  trend,
  action,
  className
}) => {
  const styles = variantStyles[variant];

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("p-2 rounded-lg", styles.icon)}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{count}</span>
                {trend && (
                  <Badge variant="secondary" className={cn("text-xs", styles.badge)}>
                    {trend.direction === 'up' ? '↗' : '↘'} {trend.value}%
                  </Badge>
                )}
              </div>

              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}

              {trend && (
                <p className={cn("text-xs", styles.trend)}>
                  {trend.label}
                </p>
              )}
            </div>
          </div>
        </div>

        {action && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
