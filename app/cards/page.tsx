"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { CardsList } from "@/components/cards/cards-list"
import { CardForm } from "@/components/cards/card-form"
import { useState } from "react"

export default function CardsPage() {
  const [cards, setCards] = useState([
    {
      id: "1",
      name: "Corporate Amex",
      lastFour: "3456",
      balance: 5200,
      limit: 10000,
      status: "active",
    },
    {
      id: "2",
      name: "Business Visa",
      lastFour: "7890",
      balance: 3000,
      limit: 8000,
      status: "active",
    },
    {
      id: "3",
      name: "Travel Card",
      lastFour: "1234",
      balance: 0,
      limit: 5000,
      status: "inactive",
    },
  ])

  const handleAddCard = (newCard: any) => {
    setCards([...cards, { ...newCard, id: Date.now().toString() }])
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cards</h1>
          <p className="mt-2 text-foreground-secondary">Manage corporate credit cards and balances</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <CardForm onAddCard={handleAddCard} />
          <div className="md:col-span-2">
            <CardsList cards={cards} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
