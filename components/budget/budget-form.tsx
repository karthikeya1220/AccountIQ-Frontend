"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BudgetFormProps {
  onAddBudget: (budget: any) => void
}

export function BudgetForm({ onAddBudget }: BudgetFormProps) {
  const [category, setCategory] = useState("")
  const [limit, setLimit] = useState("")
  const [period, setPeriod] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !limit) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddBudget({
      category,
      limit: Number.parseFloat(limit),
      spent: 0,
      period,
    })

    setCategory("")
    setLimit("")
    setPeriod("monthly")
    setIsLoading(false)
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Set Budget</h2>
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
