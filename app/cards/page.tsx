"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { CardsList } from "@/components/cards/cards-list"
import { CardForm } from "@/components/cards/card-form"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCards = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiClient.getCards()
      const data = response?.data || response || []
      if (Array.isArray(data)) {
        setCards(
          data.map((c: any) => ({
            id: c.id,
            name: c.card_holder || c.name || 'Card',
            lastFour: (c.card_number || '').toString().slice(-4),
            balance: Number(c.balance ?? 0),
            limit: Number(c.card_limit ?? c.limit ?? 0),
            status: c.is_active === false ? 'inactive' : (c.status || 'active'),
          }))
        )
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load cards")
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  const handleAddCard = async (newCard: any) => {
    // Optimistically add to list
    setCards((prev) => [...prev, { ...newCard, id: newCard.id || Date.now().toString() }])
    // Card form already handles the API call, so just reload to get fresh data
    loadCards()
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cards</h1>
          <p className="mt-2 text-foreground-secondary">Manage corporate credit cards and balances</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <CardForm onAddCard={handleAddCard} />
          <div className="md:col-span-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading cards...</div>
            ) : (
              <CardsList cards={cards} />
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
