"use client"

import { useState } from "react"
import { EditIcon, XIcon } from "lucide-react"
import { CardEditForm } from "./card-edit-form"
import { Modal } from "@/components/common/modal"

interface Card {
  id: string
  name: string
  lastFour: string
  balance: number
  limit: number
  status: string
}

interface CardsListProps {
  cards: Card[]
  onCardUpdated?: (updatedCard: Card) => void
}

export function CardsList({ cards, onCardUpdated }: CardsListProps) {
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const editingCard = cards.find(c => c.id === editingCardId)

  const getStatusColor = (status: string) => {
    return status === "active" ? "badge-success" : "badge-warning"
  }

  const getUtilizationColor = (balance: number, limit: number) => {
    const percentage = (balance / limit) * 100
    if (percentage > 80) return "text-red-600 dark:text-red-400"
    if (percentage > 50) return "text-amber-600 dark:text-amber-400"
    return "text-emerald-600 dark:text-emerald-400"
  }

  const handleEditClick = (card: Card) => {
    setEditingCardId(card.id)
  }

  const handleSaveCard = (updatedCard: Card) => {
    setEditingCardId(null)
    onCardUpdated?.(updatedCard)
  }

  return (
    <>
      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-border/40 bg-background/50">
            <div className="text-4xl mb-3">💳</div>
            <p className="font-semibold text-foreground">No cards found</p>
            <p className="text-sm text-muted-foreground mt-2">Add a card to get started</p>
          </div>
        ) : (
          cards.map((card) => {
            const balance = Number(card.balance ?? 0)
            const limit = Number(card.limit ?? 0)
            const utilization = limit > 0 ? ((balance / limit) * 100).toFixed(1) : '0.0'
            const utilizationPercent = Math.min((balance / limit) * 100, 100)

            return (
              <div 
                key={card.id} 
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/95 shadow-md hover:shadow-xl transition-all duration-300 hover:border-border/80"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest mb-1">Card Name</p>
                      <p className="font-bold text-lg text-foreground mb-2">{card.name}</p>
                      <p className="text-xs font-mono text-muted-foreground/60">•••• •••• •••• {card.lastFour}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`badge ${getStatusColor(card.status)}`}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                      <button
                        onClick={() => handleEditClick(card)}
                        className="p-2 rounded-lg bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        title="Edit card"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Balance Section */}
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wide">Current Balance</span>
                        <span className={`text-sm font-bold ${getUtilizationColor(balance, limit)}`}>
                          ${balance.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="w-full bg-background/50 rounded-full h-2.5 overflow-hidden ring-1 ring-border/20">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            utilizationPercent > 80 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : utilizationPercent > 50 
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          }`}
                          style={{ width: `${utilizationPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground/60">
                          {utilization}% of ${limit.toFixed(2)} limit
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground/70">
                          ${(limit - balance).toFixed(2)} available
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                      <div className="bg-background/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground/60 font-medium mb-1">Limit</p>
                        <p className="font-semibold text-foreground">${limit.toFixed(2)}</p>
                      </div>
                      <div className="bg-background/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground/60 font-medium mb-1">Available</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">${(limit - balance).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editingCardId !== null}
        onClose={() => setEditingCardId(null)}
        title={`Edit ${editingCard?.name || 'Card'}`}
      >
        {editingCard && (
          <CardEditForm
            card={editingCard}
            onSave={handleSaveCard}
            onCancel={() => setEditingCardId(null)}
          />
        )}
      </Modal>
    </>
  )
}
