"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

interface BillUploadFormProps {
  onAddBill: (bill: any) => void
}

export function BillUploadForm({ onAddBill }: BillUploadFormProps) {
  const [vendor, setVendor] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor || !amount || !dueDate || !fileName) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddBill({
      vendor,
      amount: Number.parseFloat(amount),
      dueDate,
      status: "pending",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileName,
      description,
    })

    setVendor("")
    setAmount("")
    setDueDate("")
    setDescription("")
    setFileName("")
    setIsLoading(false)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload New Bill</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Vendor Name"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="e.g., AWS, Slack, GitHub"
          required
        />

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          required
        />

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Add any additional details..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Invoice File *
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
              accept=".pdf,.doc,.docx,.xlsx"
              required
            />
          </div>
          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Upload className="h-4 w-4" />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? "Uploading..." : "Upload Bill"}
        </Button>
      </form>
    </Card>
  )
}
