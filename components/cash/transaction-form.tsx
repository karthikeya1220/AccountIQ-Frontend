"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { EditableField, EditableSelect, PermissionBanner } from "@/components/common/editable-field"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface TransactionFormProps {
  onAddTransaction: (transaction: any) => void
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const { userRole } = useSupabaseAuth()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const metadata = {
    editable: userRole === "admin" ? ["type", "category", "amount", "date", "paymentMethod", "description"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!category || !amount) {
      setError("Please fill in category and amount")
      return
    }

    setIsLoading(true)

    try {
      const transactionData = {
        type,
        category,
        amount: type === "expense" ? -Math.abs(Number.parseFloat(amount)) : Math.abs(Number.parseFloat(amount)),
        date,
        description,
        payment_method: paymentMethod,
      }

      const created = await apiClient.createCashTransaction(transactionData)

      onAddTransaction(created ?? {
        id: Date.now().toString(),
        type,
        category,
        amount: Number.parseFloat(amount),
        date,
        description,
        paymentMethod,
      })

      setCategory("")
      setAmount("")
      setDescription("")
    } catch (err: any) {
      setError(err?.message || "Failed to create transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Add Transaction</h2>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PermissionBanner metadata={metadata} />

        <EditableSelect
          label="Type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          options={[
            { value: "expense", label: "Expense" },
            { value: "income", label: "Income" },
          ]}
          metadata={metadata}
        />

        <EditableField
          label="Category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-full"
          placeholder="e.g., Office Supplies"
          metadata={metadata}
        />

        <EditableField
          label="Amount ($)"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field w-full"
          placeholder="0.00"
          step="0.01"
          metadata={metadata}
        />

        <EditableField
          label="Date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field w-full"
          metadata={metadata}
        />

        <EditableSelect
          label="Payment Method"
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            { value: "cash", label: "Cash" },
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "check", label: "Check" },
          ]}
          metadata={metadata}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-field w-full ${!metadata.editingEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            placeholder="Optional notes"
            rows={2}
            disabled={!metadata.editingEnabled}
          />
        </div>

        <Button type="submit" disabled={isLoading || !metadata.editingEnabled} className="w-full btn-primary">
          {isLoading ? "Adding..." : "Add Transaction"}
        </Button>
      </form>
    </div>
  )
}
