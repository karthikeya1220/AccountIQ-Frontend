"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, EditableSelect, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface SalaryFormProps {
  onAddSalary: (salary: any) => void
}

export function SalaryForm({ onAddSalary }: SalaryFormProps) {
  const { userRole } = useSupabaseAuth()
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [baseSalary, setBaseSalary] = useState("")
  const [bonus, setBonus] = useState("0")
  const [deductions, setDeductions] = useState("0")
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["employee_id", "base_salary", "allowances", "deductions", "salary_month"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const response = await apiClient.getEmployees({ is_active: true })
      const data = response?.data || response || []
      if (Array.isArray(data)) {
        setEmployees(data)
      }
    } catch (err) {
      console.error("Failed to load employees:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!selectedEmployeeId || !baseSalary) {
      setError("Please select an employee and enter base salary")
      return
    }

    setIsLoading(true)

    try {
      const base = Number.parseFloat(baseSalary)
      const bon = Number.parseFloat(bonus)
      const ded = Number.parseFloat(deductions)
      const netSalary = base + bon - ded

      const salaryData = {
        employee_id: selectedEmployeeId,
        salary_month: payDate,
        base_salary: base,
        allowances: bon,
        deductions: ded,
        net_salary: netSalary,
        payment_status: "pending",
      }

      const created = await apiClient.createSalary(salaryData)

      onAddSalary(created ?? {
        id: Date.now().toString(),
        employee_id: selectedEmployeeId,
        baseSalary: base,
        bonus: bon,
        deductions: ded,
        netSalary,
        payDate,
        status: "pending",
      })

      setSelectedEmployeeId("")
      setBaseSalary("")
      setBonus("0")
      setDeductions("0")
    } catch (err: any) {
      setError(err?.message || "Failed to create salary record")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Add Salary</h2>
      
      {/* Show permission banner */}
      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <EditableSelect
          name="employee_id"
          label="Employee"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          metadata={metadata}
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.first_name} ${emp.last_name} ${emp.designation ? `- ${emp.designation}` : ''}`,
          }))}
          placeholder="Select Employee"
          required
        />

        <EditableField
          name="base_salary"
          label="Base Salary ($)"
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          metadata={metadata}
          placeholder="8500"
          step="100"
          required
        />

        <EditableField
          name="allowances"
          label="Allowances/Bonus ($)"
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          metadata={metadata}
          placeholder="0"
          step="100"
        />

        <EditableField
          name="deductions"
          label="Deductions ($)"
          type="number"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          metadata={metadata}
          placeholder="0"
          step="100"
        />

        <EditableField
          name="salary_month"
          label="Pay Month"
          type="date"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          metadata={metadata}
          required
        />

        <Button 
          type="submit" 
          disabled={isLoading || !metadata.editingEnabled} 
          className="w-full btn-primary"
        >
          {isLoading ? "Adding..." : metadata.editingEnabled ? "Add Salary" : "View Only - Cannot Add"}
        </Button>
      </form>
    </div>
  )
}
