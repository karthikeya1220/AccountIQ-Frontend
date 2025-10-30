"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Download, FileText } from "lucide-react"
import { EmptyState } from "@/components/common"

interface Bill {
  id: string
  vendor: string
  amount: number
  dueDate: string
  status: string
  uploadedAt: string
  fileName: string
}

interface BillsListProps {
  bills: Bill[]
  onStatusChange: (billId: string, newStatus: string) => void
  onEdit?: (bill: Bill) => void
  onDelete?: (billId: string) => void
}

export function BillsList({ bills, onStatusChange, onEdit, onDelete }: BillsListProps) {
  const getStatusVariant = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case "paid":
        return "success"
      case "pending":
        return "warning"
      case "overdue":
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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bills List</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Vendor
              </th>
              <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Due Date
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
            {bills.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <EmptyState
                    icon={<FileText className="h-8 w-8" />}
                    title="No bills yet"
                    description="Upload a bill to start tracking your payables."
                  />
                </td>
              </tr>
            ) : (
              bills.map((bill) => {
                const amount = Number(bill.amount ?? 0)
                const vendor = bill.vendor || 'Unknown Vendor'
                const fileName = bill.fileName || 'No file'
                const dueDate = bill.dueDate || new Date().toISOString()
                return (
                  <tr 
                    key={bill.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{vendor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{fileName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900 dark:text-white">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {formatDate(dueDate)}
                    </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant={getStatusVariant(bill.status)}>
                      {bill.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-center items-center">
                      <select
                        value={bill.status}
                        onChange={(e) => onStatusChange(bill.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(bill)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit bill"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(bill.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete bill"
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
