"use client"

import { useState } from "react"
import { Edit2 } from "lucide-react"
import { Modal } from "@/components/common/modal"
import { SalaryEditForm } from "./salary-edit-form"

interface Salary {
  id: string
  employeeName: string
  position: string
  baseSalary: number
  bonus: number
  deductions: number
  netSalary: number
  payDate: string
  status: string
}

interface SalaryListProps {
  salaries: Salary[]
  onStatusChange: (salaryId: string, newStatus: string) => void
  onEdit?: (salary: Salary) => void
  onSalaryUpdated?: (updatedSalary: Salary) => void
}

export function SalaryList({ salaries, onStatusChange, onEdit, onSalaryUpdated }: SalaryListProps) {
  const [editingSalaryId, setEditingSalaryId] = useState<string | null>(null)
  const editingSalary = salaries.find(s => s.id === editingSalaryId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "badge-success"
      case "pending":
        return "badge-warning"
      default:
        return "badge-warning"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleEditClick = (salary: Salary) => {
    setEditingSalaryId(salary.id)
    onEdit?.(salary)
  }

  const handleSaveSalary = (updatedSalary: Salary) => {
    setEditingSalaryId(null)
    onSalaryUpdated?.(updatedSalary)
  }

  return (
    <>
      <div className="card p-3 sm:p-4 md:p-6">
        <h2 className="card-title mb-3 sm:mb-4 text-base sm:text-lg">Salaries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-cell text-left font-semibold text-xs sm:text-sm py-2 px-1 sm:px-2">Employee</th>
                <th className="table-cell text-right font-semibold text-xs sm:text-sm py-2 px-1 sm:px-2">Net Salary</th>
                <th className="table-cell text-left font-semibold text-xs sm:text-sm py-2 px-1 sm:px-2">Pay Date</th>
                <th className="table-cell text-left font-semibold text-xs sm:text-sm py-2 px-1 sm:px-2">Status</th>
                <th className="table-cell text-left font-semibold text-xs sm:text-sm py-2 px-1 sm:px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => {
                const netSalary = Number(salary.netSalary ?? 0)
                const employeeName = salary.employeeName || 'Unknown Employee'
                const position = salary.position || 'N/A'
                const payDate = salary.payDate || new Date().toISOString()
                return (
                  <tr key={salary.id} className="border-b border-border hover:bg-background-secondary">
                    <td className="table-cell py-2 sm:py-3 px-1 sm:px-2">
                      <div>
                        <p className="font-medium text-xs sm:text-sm text-foreground truncate">{employeeName}</p>
                        <p className="text-xs text-foreground-secondary truncate">{position}</p>
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold text-xs sm:text-sm text-foreground py-2 sm:py-3 px-1 sm:px-2">${netSalary.toFixed(2)}</td>
                    <td className="table-cell text-foreground-secondary text-xs sm:text-sm py-2 sm:py-3 px-1 sm:px-2">{formatDate(payDate)}</td>
                    <td className="table-cell py-2 sm:py-3 px-1 sm:px-2">
                      <span className={`badge ${getStatusColor(salary.status)} text-xs`}>{salary.status}</span>
                    </td>
                    <td className="table-cell py-2 sm:py-3 px-1 sm:px-2">
                      <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
                        <select
                          value={salary.status}
                          onChange={(e) => onStatusChange(salary.id, e.target.value)}
                          className="input-field text-xs py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                        <button
                          onClick={() => handleEditClick(salary)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit salary"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editingSalaryId !== null}
        onClose={() => setEditingSalaryId(null)}
        title={`Edit ${editingSalary?.employeeName || 'Salary'}`}
      >
        {editingSalary && (
          <SalaryEditForm
            salary={editingSalary}
            onSave={handleSaveSalary}
            onCancel={() => setEditingSalaryId(null)}
          />
        )}
      </Modal>
    </>
  )
}
