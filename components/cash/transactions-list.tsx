"use client"

interface Transaction {
  id: string
  type: string
  category: string
  amount: number
  date: string
  description: string
  paymentMethod: string
}

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const getTypeColor = (type: string) => {
    return type === "income" ? "text-success" : "text-error"
  }

  const getTypeSign = (type: string) => {
    return type === "income" ? "+" : "-"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-cell text-left font-semibold">Category</th>
              <th className="table-cell text-left font-semibold">Date</th>
              <th className="table-cell text-left font-semibold">Method</th>
              <th className="table-cell text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const paymentMethod = transaction.paymentMethod || 'cash'
              const amount = Number(transaction.amount ?? 0)
              return (
                <tr key={transaction.id} className="border-b border-border hover:bg-background-secondary">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-foreground">{transaction.category}</p>
                      <p className="text-xs text-foreground-secondary">{transaction.description}</p>
                    </div>
                  </td>
                  <td className="table-cell text-foreground-secondary">{formatDate(transaction.date)}</td>
                  <td className="table-cell text-foreground-secondary capitalize">
                    {paymentMethod.replace(/_/g, " ")}
                  </td>
                  <td className={`table-cell text-right font-semibold ${getTypeColor(transaction.type)}`}>
                    {getTypeSign(transaction.type)}${amount.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
