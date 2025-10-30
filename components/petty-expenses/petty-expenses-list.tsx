"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, FileText } from "lucide-react"

interface PettyExpense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  submittedBy: string
  status: string
  receipt: string
}

interface PettyExpensesListProps {
  expenses: PettyExpense[]
  onStatusChange: (expenseId: string, newStatus: string) => void
  onDelete?: (expenseId: string) => void
}

export function PettyExpensesList({ expenses, onStatusChange, onDelete }: PettyExpensesListProps) {
  const getStatusVariant = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "danger"
      default:
        return "warning"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Recent Expenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Submitted By
              </th>
              <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">No expenses yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Submit your first expense to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((expense) => {
                const amount = Number(expense.amount ?? 0)
                const description = expense.description || 'No description'
                const category = expense.category || 'Other'
                const submittedBy = expense.submittedBy || 'Unknown'
                const receipt = expense.receipt || 'No receipt'
                return (
                  <tr 
                    key={expense.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {receipt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="info" size="sm">
                        {category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-red-600 dark:text-red-400">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {submittedBy}
                    </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant={getStatusVariant(expense.status)}>
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-center items-center">
                      <select
                        value={expense.status}
                        onChange={(e) => onStatusChange(expense.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => window.open(expense.receipt, '_blank')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View receipt"
                      >
                        <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
