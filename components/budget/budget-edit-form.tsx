"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, EditableSelect, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface BudgetEditFormProps {
  budget: {
    id: string
    category: string
    limit: number
    spent: number
    period: string
    status: string
  }
  onSave: (updatedBudget: any) => void
  onCancel: () => void
}

export function BudgetEditForm({ budget, onSave, onCancel }: BudgetEditFormProps) {
  const { userRole } = useSupabaseAuth()
  const [category, setCategory] = useState(budget.category)
  const [limit, setLimit] = useState(budget.limit.toString())
  const [period, setPeriod] = useState(budget.period)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["category_name", "budget_limit", "period"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!category || !limit) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        category_name: category,
        budget_limit: Number.parseFloat(limit),
        period,
      }

      const updated = await apiClient.updateBudget(budget.id, updateData)

      onSave({
        id: budget.id,
        category,
        limit: Number.parseFloat(limit),
        spent: budget.spent,
        period,
        status: budget.status,
        ...updated,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update budget")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Edit Budget</h2>

      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount Spent</label>
          <input
            type="text"
            value={`$${budget.spent.toFixed(2)}`}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Auto-tracked from expenses</p>
        </div>

        {/* Editable fields */}
        <EditableField
          name="category_name"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          metadata={metadata}
          placeholder="e.g., Software & Tools"
          required
        />

        <EditableField
          name="budget_limit"
          label="Budget Limit ($)"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
          required
        />

        <EditableSelect
          label="Period"
          name="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "yearly", label: "Yearly" },
          ]}
          metadata={metadata}
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
