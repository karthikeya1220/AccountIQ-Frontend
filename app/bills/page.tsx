"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { BillsList } from "@/components/bills/bills-list"
import { BillUploadForm } from "@/components/bills/bill-upload-form"
import { ExportModal } from "@/components/export/export-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader, Toolbar, ErrorBanner, LoadingSkeleton, LastUpdated } from "@/components/common"
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
    vendor: b.vendor_name || b.vendor || '',
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

  const filteredBills = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return bills
    return bills.filter((b) => b.vendor.toLowerCase().includes(term))
  }, [bills, searchTerm])

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
      <main className="px-6 py-8">
        <PageHeader
          title="Bills Management"
          description="Upload and track vendor bills"
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Bills' }]}
          meta={<LastUpdated />}
          actions={
            <Button onClick={() => setShowExportModal(true)} variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Export Bills
            </Button>
          }
        />

        <Toolbar>
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
            <Input
              placeholder="Search by vendor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input type="date" placeholder="From date" />
          <Input type="date" placeholder="To date" />
        </Toolbar>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BillUploadForm onAddBill={handleAddBill} />
          </div>
          <div className="lg:col-span-2">
            {error && <ErrorBanner message={error} onRetry={loadBills} />}
            {loading ? (
              <Card className="p-6">
                <LoadingSkeleton lines={6} />
              </Card>
            ) : (
              <BillsList
                bills={filteredBills}
                onStatusChange={handleStatusChange}
                onEdit={handleEditBill}
                onDelete={handleDeleteBill}
              />
            )}
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
