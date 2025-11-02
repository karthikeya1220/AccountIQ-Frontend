"use client"

import { AlertCircle, TrendingUp, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardAlerts } from '@/hooks/useDashboard'

interface AlertBannerProps {
  alerts: DashboardAlerts
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const hasAlerts = alerts.budgetAlerts.length > 0 || alerts.overdueBills > 0 || alerts.lowCashBalance

  if (!hasAlerts && alerts.pendingApprovals === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* High severity alerts */}
      {alerts.budgetAlerts
        .filter((alert) => alert.severity === 'high')
        .map((alert) => (
          <Card
            key={alert.id}
            className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  {alert.message}
                </p>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                  {alert.category}: ${alert.current.toLocaleString()} / ${alert.limit.toLocaleString()} ({alert.percentage}%)
                </p>
              </div>
              <Badge variant="danger" className="flex-shrink-0">
                {alert.severity}
              </Badge>
            </div>
          </Card>
        ))}

      {/* Medium severity alerts */}
      {alerts.budgetAlerts
        .filter((alert) => alert.severity === 'medium')
        .map((alert) => (
          <Card
            key={alert.id}
            className="p-4 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  {alert.message}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                  {alert.category}: ${alert.current.toLocaleString()} / ${alert.limit.toLocaleString()} ({alert.percentage}%)
                </p>
              </div>
              <Badge variant="warning" className="flex-shrink-0">
                {alert.severity}
              </Badge>
            </div>
          </Card>
        ))}

      {/* Overdue bills alert */}
      {alerts.overdueBills > 0 && (
        <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900 dark:text-orange-100">
                {alerts.overdueBills} Overdue Bill{alerts.overdueBills > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                Immediate attention required
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Pending approvals alert */}
      {alerts.pendingApprovals > 0 && (
        <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                {alerts.pendingApprovals} Pending Approval{alerts.pendingApprovals > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                Review and approve pending items
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Low cash balance alert */}
      {alerts.lowCashBalance && (
        <Card className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 dark:text-red-100">
                Low Cash Balance
              </p>
              <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                Your available cash is below the recommended threshold
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
