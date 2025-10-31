"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditableField, EditableSelect, PermissionBanner } from "@/components/common/editable-field"
import { extractMetadata, filterToEditableFields } from "@/lib/rbac-utils"
import { apiClient } from "@/lib/api-client"

interface BillEditFormProps {
  billId: string
  onSave?: (bill: any) => void
  onCancel?: () => void
}

/**
 * Example implementation of RBAC-aware form component
 * 
 * This component demonstrates:
 * 1. Using EditableField components
 * 2. Respecting permission metadata from backend
 * 3. Filtering editable data before submission
 * 4. Showing permission status with PermissionBanner
 */
export function BillEditForm({ billId, onSave, onCancel }: BillEditFormProps) {
  const [bill, setBill] = useState<any>(null)
  const [formData, setFormData] = useState({
    vendor_name: "",
    amount: "",
    bill_date: "",
    description: "",
    status: "pending",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Load bill data on mount
  useEffect(() => {
    const loadBill = async () => {
      try {
        setLoading(true)
        // Fetch all bills and find the one we need
        // Note: Backend returns response with _metadata for permission info
        const response = await apiClient.getBills()
        const foundBill = response.find((b: any) => b.id === billId)
        
        if (!foundBill) {
          setError("Bill not found")
          return
        }
        
        setBill(foundBill)
        setFormData({
          vendor_name: foundBill.vendor_name || "",
          amount: foundBill.amount?.toString() || "",
          bill_date: foundBill.bill_date || "",
          description: foundBill.description || "",
          status: foundBill.status || "pending",
        })
      } catch (err: any) {
        setError(err.message || "Failed to load bill")
      } finally {
        setLoading(false)
      }
    }

    loadBill()
  }, [billId])

  // Extract permission metadata from bill response
  const metadata = extractMetadata(bill)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setSubmitting(true)

      // Filter data to only include editable fields
      // This prevents users from editing fields they shouldn't have access to
      const editableData = filterToEditableFields(formData, metadata.editable)

      if (Object.keys(editableData).length === 0) {
        setError("No editable fields to update")
        return
      }

      // Send only editable fields to backend
      const response = await apiClient.updateBill(billId, editableData)
      
      // Update bill with response (which includes new metadata)
      setBill(response)
      
      // Call parent callback
      onSave?.(response)
    } catch (err: any) {
      setError(err.message || "Failed to save bill")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">Loading bill...</div>
      </Card>
    )
  }

  if (!bill) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-red-600">Bill not found</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Edit Bill #{bill.id?.slice(0, 8)}
      </h2>

      {/* Show permission status banner */}
      <PermissionBanner metadata={metadata} />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Vendor Name - Editable for admin, read-only for user */}
        <EditableField
          name="vendor_name"
          label="Vendor Name"
          type="text"
          value={formData.vendor_name}
          onChange={handleInputChange}
          metadata={metadata}
          placeholder="e.g., AWS, Slack"
          required
        />

        {/* Amount - Editable for admin, read-only for user */}
        <EditableField
          name="amount"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          metadata={metadata}
          placeholder="0.00"
          step="0.01"
          required
        />

        {/* Bill Date - Editable for admin, read-only for user */}
        <EditableField
          name="bill_date"
          label="Bill Date"
          type="date"
          value={formData.bill_date}
          onChange={handleInputChange}
          metadata={metadata}
          required
        />

        {/* Status - Editable for admin, read-only for user */}
        <EditableSelect
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleInputChange}
          metadata={metadata}
          options={[
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "overdue", label: "Overdue" },
          ]}
          required
        />

        {/* Description - Editable for admin, read-only for user */}
        <EditableField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
          metadata={metadata}
          placeholder="Add any additional details..."
          multiline
          rows={3}
        />

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={submitting || !metadata.editingEnabled}
            className="flex-1"
          >
            {submitting ? "Saving..." : metadata.editingEnabled ? "Save Changes" : "View Only"}
          </Button>

          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Permission info message */}
        {!metadata.editingEnabled && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
            💡 You have view-only access to this bill. Only administrators can make changes.
          </div>
        )}
      </form>
    </Card>
  )
}
