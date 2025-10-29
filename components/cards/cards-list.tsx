"use client"

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
}

export function CardsList({ cards }: CardsListProps) {
  const getStatusColor = (status: string) => {
    return status === "active" ? "badge-success" : "badge-warning"
  }

  const getUtilizationColor = (balance: number, limit: number) => {
    const percentage = (balance / limit) * 100
    if (percentage > 80) return "text-error"
    if (percentage > 50) return "text-warning"
    return "text-success"
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Cards</h2>
      <div className="space-y-4">
        {cards.map((card) => {
          const utilization = ((card.balance / card.limit) * 100).toFixed(1)
          return (
            <div key={card.id} className="border border-border rounded-lg p-4 hover:bg-background-secondary">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{card.name}</p>
                  <p className="text-xs text-foreground-secondary">•••• {card.lastFour}</p>
                </div>
                <span className={`badge ${getStatusColor(card.status)}`}>{card.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Balance</span>
                  <span className={`font-semibold ${getUtilizationColor(card.balance, card.limit)}`}>
                    ${card.balance.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((card.balance / card.limit) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-foreground-secondary">
                  <span>
                    {utilization}% of ${card.limit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
