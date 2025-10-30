"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/input"
import { FileUpload } from "@/components/common"
import { apiClient } from "@/lib/api-client"

interface PettyExpenseFormProps {
  onAddExpense: (expense: any) => void
}

export function PettyExpenseForm({ onAddExpense }: PettyExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Supplies")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [submittedBy, setSubmittedBy] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileUpload = (file: File) => {
    setReceipt(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!description || !amount || !submittedBy) {
      setError("Please fill in required fields")
      return
    }

    setIsLoading(true)

    try {
      const expenseData = {
        expense_date: date,
        amount: Number.parseFloat(amount),
        description: `${description} (Submitted by: ${submittedBy})`,
        category,
        is_approved: false,
      }

      const created = await apiClient.createPettyExpense(expenseData)

      onAddExpense(created ?? {
        id: Date.now().toString(),
        description,
        amount: Number.parseFloat(amount),
        category,
        date,
        submittedBy,
        status: "pending",
        receipt: receipt?.name || "receipt.pdf",
      })

      // Reset form
      setDescription("")
      setAmount("")
      setCategory("Supplies")
      setSubmittedBy("")
      setReceipt(null)
    } catch (err: any) {
      setError(err?.message || "Failed to create expense")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "Supplies", label: "Office Supplies" },
    { value: "Meals", label: "Meals & Entertainment" },
    { value: "Travel", label: "Travel" },
    { value: "Utilities", label: "Utilities" },
    { value: "Other", label: "Other" },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Submit New Expense
      </h2>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was the expense for?"
          required
        />

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Input
          label="Submitted By"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          placeholder="Your name"
          required
        />

        <FileUpload
          label="Receipt (Optional)"
          onFile={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={5}
        />

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit Expense"}
        </Button>
      </form>
    </Card>
  )
}
