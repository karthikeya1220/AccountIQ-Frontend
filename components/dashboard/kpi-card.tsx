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
    <Card variant="modern" className="group relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between p-3 sm:p-4 md:p-6 relative z-10">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest letter-spacing-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-foreground mt-3 mb-4 tracking-tight">
            {value}
          </p>
          <div className="flex items-center gap-3">
            {change && trend && (
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background/60 ${trendColors[trend]}`}>
                <span className="text-lg font-semibold">{trendIcons[trend]}</span>
                <p className="text-sm font-semibold">{change}</p>
              </div>
            )}
            {usage && (
              <p className="text-xs font-medium text-muted-foreground">
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
            className={`h-14 w-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0 ml-4`}
          >
            <Icon className="h-7 w-7" />
          </div>
        )}
      </div>
    </Card>
  );
}
