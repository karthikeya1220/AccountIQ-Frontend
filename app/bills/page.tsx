"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { BillsList } from "@/components/bills/bills-list"
import { BillUploadForm } from "@/components/bills/bill-upload-form"
import { ExportModal } from "@/components/export/export-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { apiClient } from "@/lib/api-client"

type UIBill = {
  id: string
  vendor: string
  amount: number
  dueDate: string
  status: string
  uploadedAt: string
  fileName: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<UIBill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const [showExportModal, setShowExportModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const mapBillToUI = (b: any): UIBill => ({
    id: b.id,
    vendor: b.vendor,
    amount: Number(b.amount ?? 0),
    dueDate: b.bill_date ?? b.dueDate ?? new Date().toISOString().split("T")[0],
    status: b.status ?? "pending",
    uploadedAt: b.created_at ?? b.uploadedAt ?? new Date().toISOString(),
    fileName: b.attachment_name ?? b.fileName ?? "",
  })

  const loadBills = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await apiClient.getBills()
      if (Array.isArray(data)) {
        setBills(data.map(mapBillToUI))
      } else {
        // Fallback: backend returned unexpected shape
        setBills([])
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load bills")
      setBills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBills()
  }, [])

  const handleAddBill = (newBill: any) => {
    // Optimistically add to list; BillUploadForm will call backend
    setBills((prev) => [mapBillToUI(newBill), ...prev])
  }

  const handleStatusChange = (billId: string, newStatus: string) => {
    setBills((prev) => prev.map((bill) => (bill.id === billId ? { ...bill, status: newStatus } : bill)))
    // Persist change
    apiClient
      .updateBill(billId, { status: newStatus })
      .catch(() => loadBills()) // Revert by reloading on error
  }

  const handleDeleteBill = (billId: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      setBills((prev) => prev.filter((bill) => bill.id !== billId))
      apiClient.deleteBill(billId).catch(() => loadBills())
    }
  }

  const handleEditBill = (bill: any) => {
    // TODO: Implement edit functionality
    console.log("Edit bill:", bill)
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bills Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Upload and track vendor bills</p>
          </div>
          <Button
            onClick={() => setShowExportModal(true)}
            variant="secondary"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Bills
          </Button>
        </div>

        {/* Search & Filter */}
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by vendor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input type="date" placeholder="From date" />
            <Input type="date" placeholder="To date" />
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BillUploadForm onAddBill={handleAddBill} />
          </div>
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            <BillsList
              bills={useMemo(() => {
                const term = searchTerm.trim().toLowerCase()
                if (!term) return bills
                return bills.filter((b) => b.vendor.toLowerCase().includes(term))
              }, [bills, searchTerm])}
              onStatusChange={handleStatusChange}
              onEdit={handleEditBill}
              onDelete={handleDeleteBill}
            />
          </div>
        </div>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={bills.map((b) => ({
            Vendor: b.vendor,
            Amount: `$${b.amount}`,
            "Due Date": b.dueDate,
            Status: b.status,
            "Uploaded At": b.uploadedAt,
          }))}
          filename="bills"
          title="Bills"
        />
      </main>
    </ProtectedRoute>
  )
}
