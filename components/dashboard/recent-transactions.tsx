"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  description: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const transactions: Transaction[] = [
  { description: 'Office Supplies', amount: 450, date: 'Jan 15', status: 'Approved' },
  { description: 'Client Meeting', amount: 125, date: 'Jan 14', status: 'Approved' },
  { description: 'Software License', amount: 299, date: 'Jan 13', status: 'Pending' },
  { description: 'Travel Expenses', amount: 580, date: 'Jan 12', status: 'Approved' },
  { description: 'Marketing Campaign', amount: 1200, date: 'Jan 11', status: 'Pending' },
];

export function RecentTransactions() {
  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-center py-3 px-3 sm:px-4 md:px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm font-medium text-gray-900 dark:text-white">
                  {item.description}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm font-bold text-gray-900 dark:text-white text-right">
                  ${item.amount.toFixed(2)}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-sm text-gray-600 dark:text-gray-400">
                  {item.date}
                </td>
                <td className="py-4 px-3 sm:px-4 md:px-6 text-center">
                  <Badge 
                    variant={
                      item.status === 'Approved' ? 'success' : 
                      item.status === 'Pending' ? 'warning' : 
                      'danger'
                    }
                  >
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
