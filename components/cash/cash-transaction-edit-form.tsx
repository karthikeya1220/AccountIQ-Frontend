"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface CashTransactionEditFormProps {
  transaction: {
    id: string
    type: string
    category: string
    amount: number
    date: string
    description: string
    paymentMethod: string
  }
  onSave: (updatedTransaction: any) => void
  onCancel: () => void
}

export function CashTransactionEditForm({ transaction, onSave, onCancel }: CashTransactionEditFormProps) {
  const { userRole } = useSupabaseAuth()
  const [category, setCategory] = useState(transaction.category)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [date, setDate] = useState(transaction.date.split("T")[0])
  const [description, setDescription] = useState(transaction.description)
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["category", "amount", "date", "description", "payment_method"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!category || !amount || !date) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        category,
        amount: Number.parseFloat(amount),
        transaction_date: date,
        description,
        payment_method: paymentMethod,
      }

      const updated = await apiClient.updateCashTransaction(transaction.id, updateData)

      onSave({
        id: transaction.id,
        type: transaction.type,
        category,
        amount: Number.parseFloat(amount),
        date,
        description,
        paymentMethod,
        ...updated,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Edit Transaction</h2>

      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <input
            type="text"
            value={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Cannot be changed</p>
        </div>

        {/* Editable fields */}
        <EditableField
          name="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          metadata={metadata}
          placeholder="e.g., Lunch, Office Supplies"
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
          name="date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          metadata={metadata}
          required
        />

        <EditableField
          name="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          metadata={metadata}
          placeholder="Additional details..."
        />

        <EditableField
          name="payment_method"
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          metadata={metadata}
          placeholder="e.g., cash, card"
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
