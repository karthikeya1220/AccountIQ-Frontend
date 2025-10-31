"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface PettyExpenseEditFormProps {
  expense: {
    id: string
    description: string
    amount: number
    category: string
    date: string
    submittedBy: string
    status: string
    receipt: string
  }
  onSave: (updatedExpense: any) => void
  onCancel: () => void
}

export function PettyExpenseEditForm({ expense, onSave, onCancel }: PettyExpenseEditFormProps) {
  const { userRole } = useSupabaseAuth()
  const [description, setDescription] = useState(expense.description)
  const [amount, setAmount] = useState(expense.amount.toString())
  const [category, setCategory] = useState(expense.category)
  const [date, setDate] = useState(expense.date.split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["description", "amount", "expense_date"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description || !amount) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        description,
        amount: Number.parseFloat(amount),
        expense_date: date,
      }

      const updated = await apiClient.updatePettyExpense(expense.id, updateData)

      onSave({
        id: expense.id,
        description,
        amount: Number.parseFloat(amount),
        date,
        submittedBy: expense.submittedBy,
        status: expense.status,
        receipt: expense.receipt,
        ...updated,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update expense")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Edit Expense Details</h2>

      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Submitted By</label>
          <input
            type="text"
            value={expense.submittedBy}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Original submitter</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <input
            type="text"
            value={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Use status dropdown to change</p>
        </div>

        {/* Editable fields */}
        <EditableField
          name="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          metadata={metadata}
          placeholder="e.g., Office supplies"
          required
        />

        <EditableField
          name="amount"
          label="Amount ($)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
          required
        />

        <EditableField
          name="expense_date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
