"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditableField, PermissionBanner } from "@/components/common/editable-field"
import { apiClient } from "@/lib/api-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

interface CardEditFormProps {
  card: {
    id: string
    name: string
    lastFour: string
    balance: number
    limit: number
    status: string
  }
  onSave: (updatedCard: any) => void
  onCancel: () => void
}

export function CardEditForm({ card, onSave, onCancel }: CardEditFormProps) {
  const { userRole } = useSupabaseAuth()
  const [name, setName] = useState(card.name)
  const [limit, setLimit] = useState(card.limit.toString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Create metadata based on user role
  const metadata = {
    editable: userRole === "admin" ? ["card_name", "credit_limit"] : [],
    editingEnabled: userRole === "admin",
    userRole: (userRole as "admin" | "user") || "user",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!name || !limit) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        card_holder: name,
        card_limit: Number.parseFloat(limit),
      }

      const updated = await apiClient.updateCard(card.id, updateData)

      onSave({
        id: card.id,
        name,
        lastFour: card.lastFour,
        balance: card.balance,
        limit: Number.parseFloat(limit),
        status: card.status,
        ...updated,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update card")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Edit Card Details</h2>
      
      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last 4 Digits</label>
          <input
            type="text"
            value={`•••• •••• •••• ${card.lastFour}`}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Current Balance</label>
          <input
            type="text"
            value={`$${card.balance.toFixed(2)}`}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Updated automatically</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <input
            type="text"
            value={card.status.charAt(0).toUpperCase() + card.status.slice(1)}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Managed separately</p>
        </div>

        {/* Editable fields */}
        <EditableField
          name="card_name"
          label="Card Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          metadata={metadata}
          placeholder="e.g., Corporate Amex"
          required
        />

        <EditableField
          name="credit_limit"
          label="Credit Limit ($)"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          metadata={metadata}
          placeholder="10000"
          step="100"
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
