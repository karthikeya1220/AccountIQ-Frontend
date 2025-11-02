"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { MonthlyTrendPoint } from "@/hooks/useDashboard"

interface TrendChartProps {
  data: MonthlyTrendPoint[]
  loading?: boolean
}

export function TrendChart({ data, loading = false }: TrendChartProps) {
  if (loading || !data || data.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Monthly Expense Trend
        </h2>
        <div className="mt-4 h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Monthly Expense Trend
      </h2>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#111827', fontWeight: 'bold' }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#0ea5e9"
              name="Actual Expenses"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#d1d5db"
              name="Budget Limit"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
