"use client"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: string
  status: string
}

interface BudgetListProps {
  budgets: Budget[]
}

export function BudgetList({ budgets }: BudgetListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-success"
      case "warning":
        return "text-warning"
      case "critical":
        return "text-error"
      default:
        return "text-foreground-secondary"
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-error"
    if (percentage >= 75) return "bg-warning"
    return "bg-success"
  }

  const getStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return "critical"
    if (percentage >= 75) return "warning"
    return "ok"
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Budget Categories</h2>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = Number(budget.spent ?? 0)
          const limit = Number(budget.limit ?? 0)
          const percentage = limit > 0 ? ((spent / limit) * 100).toFixed(1) : '0.0'
          const status = getStatus(spent, limit)
          const category = budget.category || 'Unknown'
          const period = budget.period || 'monthly'

          return (
            <div key={budget.id} className="border border-border rounded-lg p-4 hover:bg-background-secondary">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{category}</p>
                  <p className="text-xs text-foreground-secondary capitalize">{period}</p>
                </div>
                <span className={`text-sm font-semibold ${getStatusColor(status)}`}>{percentage}%</span>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-border rounded-full h-3">
                  <div
                    className={`${getProgressColor(Number.parseFloat(percentage))} h-3 rounded-full transition-all`}
                    style={{ width: `${Math.min(Number.parseFloat(percentage), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-foreground-secondary">
                  <span>${spent.toFixed(2)} spent</span>
                  <span>${limit.toFixed(2)} limit</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
