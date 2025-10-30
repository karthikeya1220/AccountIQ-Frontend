"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"
import { apiClient } from "@/lib/api-client"

interface BillUploadFormProps {
  onAddBill: (bill: any) => void
}

export function BillUploadForm({ onAddBill }: BillUploadFormProps) {
  const { user } = useSupabaseAuth()
  const [vendor, setVendor] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('bill-attachments')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('bill-attachments')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (error: any) {
      console.error('Error uploading file:', error)
      setError(`File upload failed: ${error.message}`)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!vendor || !amount || !dueDate || !file) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Upload file to Supabase Storage
      const attachmentUrl = await uploadFile(file)
      if (!attachmentUrl) {
        setIsLoading(false)
        return
      }

      // Create bill via backend API (ensures business logic like card balance updates)
      const created = await apiClient.createBill({
        vendor,
        amount: parseFloat(amount),
        billDate: dueDate,
        description: description ? `${description}\nAttachment: ${fileName}\nURL: ${attachmentUrl}` : `Attachment: ${fileName}\nURL: ${attachmentUrl}`,
        status: 'pending',
      })

      // Call parent callback with created bill (or fallback shape)
      onAddBill(created ?? {
        id: Date.now().toString(),
        vendor,
        amount: parseFloat(amount),
        bill_date: dueDate,
        status: 'pending',
        created_at: new Date().toISOString(),
        attachment_name: fileName,
      })

      // Reset form
      setVendor("")
      setAmount("")
      setDueDate("")
      setDescription("")
      setFile(null)
      setFileName("")
    } catch (error: any) {
      console.error('Error creating bill:', error)
      setError(error.message || "Failed to create bill")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload New Bill</h2>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
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
