"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SalaryFormProps {
  onAddSalary: (salary: any) => void
}

export function SalaryForm({ onAddSalary }: SalaryFormProps) {
  const [employeeName, setEmployeeName] = useState("")
  const [position, setPosition] = useState("")
  const [baseSalary, setBaseSalary] = useState("")
  const [bonus, setBonus] = useState("0")
  const [deductions, setDeductions] = useState("0")
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeName || !position || !baseSalary) {
      alert("Please fill in required fields")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const base = Number.parseFloat(baseSalary)
    const bon = Number.parseFloat(bonus)
    const ded = Number.parseFloat(deductions)
    const netSalary = base + bon - ded

    onAddSalary({
      employeeName,
      position,
      baseSalary: base,
      bonus: bon,
      deductions: ded,
      netSalary,
      payDate,
      status: "pending",
    })

    setEmployeeName("")
    setPosition("")
    setBaseSalary("")
    setBonus("0")
    setDeductions("0")
    setIsLoading(false)
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Add Salary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Employee Name</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="input-field w-full"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Position</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="input-field w-full"
            placeholder="Senior Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Base Salary ($)</label>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            className="input-field w-full"
            placeholder="8500"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Bonus ($)</label>
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            className="input-field w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Deductions ($)</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            className="input-field w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Pay Date</label>
          <input
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? "Adding..." : "Add Salary"}
        </Button>
      </form>
    </div>
  )
}
