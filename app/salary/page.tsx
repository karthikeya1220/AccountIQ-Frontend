"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PageHeader, ErrorBanner, LoadingSkeleton, LastUpdated } from "@/components/common"
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
            employeeName: s.employee 
              ? `${s.employee.first_name} ${s.employee.last_name}` 
              : 'Unknown Employee',
            position: s.employee?.designation || '',
            baseSalary: Number(s.base_salary ?? 0),
            bonus: Number(s.allowances ?? 0),
            deductions: Number(s.deductions ?? 0),
            netSalary: Number(s.net_salary ?? 0),
            payDate: s.paid_date || s.month || new Date().toISOString(),
            status: s.status || 'pending',
            date: s.month || s.created_at || new Date().toISOString(),
            employee_id: s.employee_id,
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

  const handleSalaryUpdated = (updatedSalary: any) => {
    // Update the salary in the list
    setSalaries((prev) =>
      prev.map((salary) =>
        salary.id === updatedSalary.id ? updatedSalary : salary
      )
    )
  }

  const totalPayroll = salaries.reduce((sum, s) => sum + s.netSalary, 0)
  const pendingPayroll = salaries.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.netSalary, 0)

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="px-6 py-8">
        <PageHeader
          title="Salary Management"
          description="Track employee salaries and payroll"
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Salary' }]}
          meta={<LastUpdated />}
          actions={
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-secondary"
            >
              Export Payroll
            </button>
          }
        />

        {error && <ErrorBanner message={error} />}

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
              <LoadingSkeleton lines={8} />
            ) : (
              <SalaryList
                salaries={salaries}
                onStatusChange={handleStatusChange}
                onSalaryUpdated={handleSalaryUpdated}
              />
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
