"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface CardFormProps {
  onAddCard: (card: any) => void
}

export function CardForm({ onAddCard }: CardFormProps) {
  const [name, setName] = useState("")
  const [lastFour, setLastFour] = useState("")
  const [limit, setLimit] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!name || !lastFour || !limit) {
      setError("Please fill in all fields")
      return
    }

    if (lastFour.length !== 4) {
      setError("Last 4 digits must be exactly 4 digits")
      return
    }

    setIsLoading(true)

    try {
      const cardData = {
        cardNumber: lastFour.padStart(16, '0'), // Pad to make it a valid card number for validation
        cardHolder: name,
        cardType: 'credit' as const,
        bank: 'Default Bank',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        limit: Number.parseFloat(limit),
      }

      const created = await apiClient.createCard(cardData)

      onAddCard(created ?? {
        id: Date.now().toString(),
        name,
        lastFour,
        balance: 0,
        limit: Number.parseFloat(limit),
        status: "active",
      })

      setName("")
      setLastFour("")
      setLimit("")
    } catch (err: any) {
      setError(err?.message || "Failed to create card")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Add Card</h2>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
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
