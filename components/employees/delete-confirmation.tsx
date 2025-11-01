"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

interface DeleteConfirmationProps {
  employee: {
    id: string
    first_name: string
    last_name: string
    email: string | null
  }
  onSuccess: () => void
  onCancel: () => void
}

export function DeleteConfirmation({ employee, onSuccess, onCancel }: DeleteConfirmationProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setError("")
    setLoading(true)

    try {
      await apiClient.deleteEmployee(employee.id)
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to delete employee")
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto border-red-200 dark:border-red-900/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete Employee?</h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Are you sure you want to delete <strong>{employee.first_name} {employee.last_name}</strong>?
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-3 mb-4">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          <strong>Note:</strong> If this employee has salary records, they will be deactivated instead of permanently deleted.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? "Deleting..." : "Delete Employee"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </Card>
  )
}
