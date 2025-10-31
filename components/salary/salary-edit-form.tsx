"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface SalaryEditFormProps {
  salary: {
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
  onSave: (updatedSalary: any) => void
  onCancel: () => void
}

export function SalaryEditForm({ salary, onSave, onCancel }: SalaryEditFormProps) {
  const { userRole } = useSupabaseAuth()
  const [baseSalary, setBaseSalary] = useState(salary.baseSalary.toString())
  const [allowances, setAllowances] = useState(salary.bonus.toString())
  const [deductions, setDeductions] = useState(salary.deductions.toString())
  const [payDate, setPayDate] = useState(salary.payDate.split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Calculate net salary
  const netSalary = Number.parseFloat(baseSalary) + Number.parseFloat(allowances) - Number.parseFloat(deductions)

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["base_salary", "allowances", "deductions", "pay_date"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!baseSalary || !payDate) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        base_salary: Number.parseFloat(baseSalary),
        allowances: Number.parseFloat(allowances) || 0,
        deductions: Number.parseFloat(deductions) || 0,
        paid_date: payDate,
      }

      const updated = await apiClient.updateSalary(salary.id, updateData)

      onSave({
        id: salary.id,
        employeeName: salary.employeeName,
        position: salary.position,
        baseSalary: Number.parseFloat(baseSalary),
        bonus: Number.parseFloat(allowances) || 0,
        deductions: Number.parseFloat(deductions) || 0,
        netSalary,
        payDate,
        status: salary.status,
        ...updated,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update salary")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Edit Salary Details</h2>

      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Employee Name</label>
          <input
            type="text"
            value={salary.employeeName}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Position</label>
          <input
            type="text"
            value={salary.position}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Managed in employees section</p>
        </div>

        {/* Editable fields */}
        <EditableField
          name="base_salary"
          label="Base Salary ($)"
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
          required
        />

        <EditableField
          name="allowances"
          label="Allowances ($)"
          type="number"
          value={allowances}
          onChange={(e) => setAllowances(e.target.value)}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
        />

        <EditableField
          name="deductions"
          label="Deductions ($)"
          type="number"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Net Salary</label>
          <input
            type="text"
            value={`$${isNaN(netSalary) ? "0.00" : netSalary.toFixed(2)}`}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Auto-calculated</p>
        </div>

        <EditableField
          name="pay_date"
          label="Pay Date"
          type="date"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          metadata={metadata}
          required
        />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !metadata.editingEnabled}
            className="flex-1 btn-primary"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1"
            variant="outline"
          >
            Cancel
          </Button>
        </div>

        {!metadata.editingEnabled && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            💡 You are viewing as read-only. Contact an admin to make changes.
          </p>
        )}
      </form>
    </div>
  )
}
