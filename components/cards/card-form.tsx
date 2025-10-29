"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CardFormProps {
  onAddCard: (card: any) => void
}

export function CardForm({ onAddCard }: CardFormProps) {
  const [name, setName] = useState("")
  const [lastFour, setLastFour] = useState("")
  const [limit, setLimit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !lastFour || !limit) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddCard({
      name,
      lastFour,
      balance: 0,
      limit: Number.parseFloat(limit),
      status: "active",
    })

    setName("")
    setLastFour("")
    setLimit("")
    setIsLoading(false)
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Add Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Card Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="e.g., Corporate Amex"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last 4 Digits</label>
          <input
            type="text"
            value={lastFour}
            onChange={(e) => setLastFour(e.target.value.slice(0, 4))}
            className="input-field w-full"
            placeholder="3456"
            maxLength={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Credit Limit ($)</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="input-field w-full"
            placeholder="10000"
            step="100"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? "Adding..." : "Add Card"}
        </Button>
      </form>
    </div>
  )
}
