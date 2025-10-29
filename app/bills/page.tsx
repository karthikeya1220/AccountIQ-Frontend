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
import { useState } from "react"

export default function BillsPage() {
  const [bills, setBills] = useState([
    {
      id: "1",
      vendor: "AWS",
      amount: 1250,
      dueDate: "2025-11-15",
      status: "pending",
      uploadedAt: "2025-10-29",
      fileName: "aws-invoice-oct.pdf",
      date: "2025-10-29",
    },
    {
      id: "2",
      vendor: "Slack",
      amount: 450,
      dueDate: "2025-11-05",
      status: "paid",
      uploadedAt: "2025-10-28",
      fileName: "slack-invoice.pdf",
      date: "2025-10-28",
    },
    {
      id: "3",
      vendor: "GitHub Enterprise",
      amount: 800,
      dueDate: "2025-11-20",
      status: "pending",
      uploadedAt: "2025-10-27",
      fileName: "github-invoice.pdf",
      date: "2025-10-27",
    },
  ])

  const [showExportModal, setShowExportModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddBill = (newBill: any) => {
    setBills([...bills, { ...newBill, id: Date.now().toString(), date: new Date().toISOString().split("T")[0] }])
  }

  const handleStatusChange = (billId: string, newStatus: string) => {
    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, status: newStatus } : bill)))
  }

  const handleDeleteBill = (billId: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      setBills(bills.filter((bill) => bill.id !== billId))
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
            <BillsList 
              bills={bills} 
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
