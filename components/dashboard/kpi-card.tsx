import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  usage?: string;
  status?: string;
  trend?: "up" | "down" | "stable" | "warning";
  icon?: LucideIcon;
  color?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  usage,
  status,
  trend, 
  icon: Icon, 
  color = "from-blue-500 to-cyan-500" 
}: KPICardProps) {
  const trendColors = {
    up: "text-red-600 dark:text-red-400",
    down: "text-emerald-600 dark:text-emerald-400",
    stable: "text-gray-600 dark:text-gray-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
    warning: "⚠",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            {value}
          </p>
          <div className="mt-4 flex items-center justify-between">
            {change && trend && (
              <p className={`text-sm font-semibold ${trendColors[trend]}`}>
                {trendIcons[trend]} {change}
              </p>
            )}
            {usage && (
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {usage} used
              </p>
            )}
            {status && (
              <Badge variant={status === 'Active' ? 'success' : 'warning'}>
                {status}
              </Badge>
            )}
          </div>
        </div>
        {Icon && (
          <div 
            className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
