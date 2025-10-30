"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface BudgetFormProps {
  onAddBudget: (budget: any) => void
}

export function BudgetForm({ onAddBudget }: BudgetFormProps) {
  const [category, setCategory] = useState("")
  const [limit, setLimit] = useState("")
  const [period, setPeriod] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!category || !limit) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const budgetData = {
        category,
        amount: Number.parseFloat(limit),
        period,
        start_date: new Date().toISOString().split("T")[0],
      }

      const created = await apiClient.createBudget(budgetData)

      onAddBudget(created ?? {
        id: Date.now().toString(),
        category,
        limit: Number.parseFloat(limit),
        spent: 0,
        period,
      })

      setCategory("")
      setLimit("")
      setPeriod("monthly")
    } catch (err: any) {
      setError(err?.message || "Failed to create budget")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Set Budget</h2>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-full"
            placeholder="e.g., Software & Tools"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Budget Limit ($)</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="input-field w-full"
            placeholder="5000"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Period</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field w-full">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? "Setting..." : "Set Budget"}
        </Button>
      </form>
    </div>
  )
}
