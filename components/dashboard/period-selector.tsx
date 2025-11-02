"use client"

import { Button } from '@/components/ui/button'

interface PeriodSelectorProps {
  currentPeriod: 'current_month' | 'last_30_days' | 'custom_range'
  onPeriodChange: (period: 'current_month' | 'last_30_days' | 'custom_range') => void
  loading?: boolean
}

const periods = [
  { id: 'current_month', label: 'This Month' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'custom_range', label: 'Custom Range' },
] as const

export function PeriodSelector({ currentPeriod, onPeriodChange, loading = false }: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => (
        <Button
          key={period.id}
          variant={currentPeriod === period.id ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onPeriodChange(period.id as 'current_month' | 'last_30_days' | 'custom_range')}
          disabled={loading}
          className="transition-all"
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}
