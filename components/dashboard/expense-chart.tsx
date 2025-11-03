"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Card } from "@/components/ui/card"
import { ExpenseByCategoryPoint } from "@/hooks/useDashboard"

interface ExpenseChartProps {
  data: ExpenseByCategoryPoint[]
  loading?: boolean
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// export function ExpenseChart({ data, loading = false }: ExpenseChartProps) {
//   console.log('[ExpenseChart] Props:', { data, loading })
  
//   if (loading || !data || data.length === 0) {
//     console.log('[ExpenseChart] Showing empty state - loading:', loading, 'data:', data, 'length:', data?.length)
//     return (
//       <Card className="p-6">
//         <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//           Expenses by Category
//         </h2>
//         <div className="mt-4 h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
//       </Card>
//     )
//   }

//   return (
//     <Card className="p-6">
//       <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//         Expenses by Category
//       </h2>
//       <div className="mt-4">
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
//             <XAxis 
//               dataKey="category" 
//               stroke="#9ca3af" 
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis 
//               stroke="#9ca3af"
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: '#ffffff',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '8px',
//                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//               }}
//               labelStyle={{ color: '#111827', fontWeight: 'bold' }}
//               formatter={(value: number) => `$${value.toLocaleString()}`}
//             />
//             <Legend />
//             <Bar 
//               dataKey="amount" 
//               name="Amount ($)" 
//               radius={[8, 8, 0, 0]}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </Card>
//   )
// }
