"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { SalaryList } from "@/components/salary/salary-list"
import { SalaryForm } from "@/components/salary/salary-form"
import { ExportModal } from "@/components/export/export-modal"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadSalaries = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiClient.getSalaries()
      const data = response?.data || response || []
      if (Array.isArray(data)) {
        setSalaries(
          data.map((s: any) => ({
            id: s.id,
            employeeName: s.employee_name || s.employeeName || 'Employee',
            position: s.position || '',
            baseSalary: Number(s.base_salary ?? s.baseSalary ?? 0),
            bonus: Number(s.allowances ?? s.bonus ?? 0),
            deductions: Number(s.deductions ?? 0),
            netSalary: Number(s.net_salary ?? s.netSalary ?? 0),
            payDate: s.payment_date || s.pay_date || s.payDate || new Date().toISOString(),
            status: s.payment_status || s.status || 'pending',
            date: s.salary_month || s.date || s.created_at || new Date().toISOString(),
          }))
        )
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load salaries")
      setSalaries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSalaries()
  }, [])

  const [showExportModal, setShowExportModal] = useState(false)

  const handleAddSalary = async (newSalary: any) => {
    // Optimistically add to list
    setSalaries((prev) => [
      ...prev,
      { ...newSalary, id: newSalary.id || Date.now().toString(), date: new Date().toISOString().split("T")[0] },
    ])
    // Form already handles the API call, reload to get fresh data
    loadSalaries()
  }

  const handleStatusChange = (salaryId: string, newStatus: string) => {
    setSalaries((prev) => prev.map((s) => (s.id === salaryId ? { ...s, status: newStatus } : s)))
    apiClient.updateSalary(salaryId, { payment_status: newStatus }).catch(() => void 0)
  }

  const totalPayroll = salaries.reduce((sum, s) => sum + s.netSalary, 0)
  const pendingPayroll = salaries.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.netSalary, 0)

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Salary Management</h1>
            <p className="mt-2 text-foreground-secondary">Track employee salaries and payroll</p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Export Payroll
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card">
            <p className="text-sm text-foreground-secondary">Total Payroll</p>
            <p className="mt-2 text-2xl font-bold text-foreground">${totalPayroll.toFixed(2)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">{salaries.length} employees</p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Pending Payment</p>
            <p className="mt-2 text-2xl font-bold text-warning">${pendingPayroll.toFixed(2)}</p>
            <p className="mt-1 text-xs text-foreground-secondary">
              {salaries.filter((s) => s.status === "pending").length} pending
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-foreground-secondary">Average Salary</p>
            <p className="mt-2 text-2xl font-bold text-foreground">${(totalPayroll / salaries.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <SalaryForm onAddSalary={handleAddSalary} />
          <div className="md:col-span-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading salaries...</div>
            ) : (
              <SalaryList salaries={salaries} onStatusChange={handleStatusChange} />
            )}
          </div>
        </div>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={salaries.map((s) => ({
            Employee: s.employeeName,
            Position: s.position,
            "Base Salary": `$${s.baseSalary}`,
            Bonus: `$${s.bonus}`,
            Deductions: `$${s.deductions}`,
            "Net Salary": `$${s.netSalary}`,
            "Pay Date": s.payDate,
            Status: s.status,
          }))}
          filename="payroll"
          title="Salary Payroll"
        />
      </main>
    </ProtectedRoute>
  )
}
