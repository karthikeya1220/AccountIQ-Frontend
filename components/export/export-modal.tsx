"use client"

import { useState } from "react"
import { exportToCSV, exportToPDF, filterDataByDateRange } from "@/lib/export-utils"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: any[]
  filename: string
  title: string
}

export function ExportModal({ isOpen, onClose, data, filename, title }: ExportModalProps) {
  const [dateRange, setDateRange] = useState<"all" | "month" | "custom">("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  if (!isOpen) return null

  const getFilteredData = () => {
    if (dateRange === "all") return data
    if (dateRange === "month") {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return filterDataByDateRange(data, "date", monthStart, monthEnd)
    }
    if (dateRange === "custom" && startDate && endDate) {
      return filterDataByDateRange(data, "date", new Date(startDate), new Date(endDate))
    }
    return data
  }

  const filteredData = getFilteredData()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{`Export ${title}`}</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Data</option>
              <option value="month">Current Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="End Date"
              />
            </div>
          )}

          <p className="text-sm text-foreground-secondary">{`Records to export: ${filteredData.length}`}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => exportToCSV(filteredData, filename)}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToPDF(filteredData, filename, title)}
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md hover:bg-background-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
