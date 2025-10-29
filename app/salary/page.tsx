"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { SalaryList } from "@/components/salary/salary-list"
import { SalaryForm } from "@/components/salary/salary-form"
import { ExportModal } from "@/components/export/export-modal"
import { useState } from "react"

export default function SalaryPage() {
  const [salaries, setSalaries] = useState([
    {
      id: "1",
      employeeName: "John Smith",
      position: "Senior Developer",
      baseSalary: 8500,
      bonus: 1000,
      deductions: 500,
      netSalary: 9000,
      payDate: "2025-10-31",
      status: "pending",
      date: "2025-10-31",
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      position: "Project Manager",
      baseSalary: 7500,
      bonus: 500,
      deductions: 400,
      netSalary: 7600,
      payDate: "2025-10-31",
      status: "paid",
      date: "2025-10-31",
    },
    {
      id: "3",
      employeeName: "Mike Chen",
      position: "Designer",
      baseSalary: 6500,
      bonus: 300,
      deductions: 350,
      netSalary: 6450,
      payDate: "2025-10-31",
      status: "pending",
      date: "2025-10-31",
    },
  ])

  const [showExportModal, setShowExportModal] = useState(false)

  const handleAddSalary = (newSalary: any) => {
    setSalaries([
      ...salaries,
      { ...newSalary, id: Date.now().toString(), date: new Date().toISOString().split("T")[0] },
    ])
  }

  const handleStatusChange = (salaryId: string, newStatus: string) => {
    setSalaries(salaries.map((s) => (s.id === salaryId ? { ...s, status: newStatus } : s)))
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
            <SalaryList salaries={salaries} onStatusChange={handleStatusChange} />
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
