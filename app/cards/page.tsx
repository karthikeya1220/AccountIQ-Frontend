"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { PageHeader, ErrorBanner, LoadingSkeleton, LastUpdated } from "@/components/common"
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

  const handleCardUpdated = (updatedCard: any) => {
    // Update the card in the list
    setCards((prev) =>
      prev.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Cards"
          description="Manage corporate credit cards and balances"
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Cards' }]}
          meta={<LastUpdated />}
        />

        {error && <ErrorBanner message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
          <CardForm onAddCard={handleAddCard} />
          <div className="md:col-span-2">
            {loading ? (
              <LoadingSkeleton lines={8} />
            ) : (
              <CardsList cards={cards} onCardUpdated={handleCardUpdated} />
            )}
          </div>
        </div>
      </div>
      </main>
    </ProtectedRoute>
  )
}
