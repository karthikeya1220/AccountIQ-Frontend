"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface EmployeeFormProps {
  employee?: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    designation?: string
    department_id?: string | null
    base_salary?: number
    join_date?: string
    date_of_joining?: string
    is_active?: boolean
  }
  onSuccess: () => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const isEditMode = !!employee
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    email: employee?.email || "",
    designation: employee?.designation || "",
    department_id: employee?.department_id || "",
    base_salary: employee?.base_salary?.toString() || "",
    join_date: employee?.join_date ? employee.join_date.split("T")[0] : (employee?.date_of_joining ? employee.date_of_joining.split("T")[0] : ""),
    is_active: employee?.is_active ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError("First name and last name are required")
      return
    }

    // Validate email format if provided
    if (formData.email && !formData.email.includes("@")) {
      setError("Invalid email format")
      return
    }

    setLoading(true)

    try {
      // Prepare payload - only include fields that have values
      const payload: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      }

      if (formData.email.trim()) payload.email = formData.email.trim()
      if (formData.designation.trim()) payload.designation = formData.designation.trim()
      if (formData.department_id.trim()) payload.department_id = formData.department_id.trim()
      if (formData.base_salary) payload.base_salary = parseFloat(formData.base_salary)
      if (formData.join_date) payload.join_date = formData.join_date

      console.log("[EMPLOYEE FORM] Submitting payload:", payload)
      console.log("[EMPLOYEE FORM] Is edit mode:", isEditMode)

      if (isEditMode) {
        // Include is_active for edit
        payload.is_active = formData.is_active
        console.log("[EMPLOYEE FORM] Updating employee:", employee.id)
        await apiClient.updateEmployee(employee.id, payload)
        console.log("[EMPLOYEE FORM] Update successful")
      } else {
        console.log("[EMPLOYEE FORM] Creating new employee")
        const result = await apiClient.createEmployee(payload)
        console.log("[EMPLOYEE FORM] Create successful. Result:", result)
      }

      console.log("[EMPLOYEE FORM] Calling onSuccess callback")
      onSuccess()
    } catch (err: any) {
      console.error("[EMPLOYEE FORM] Error during submission:", err)
      console.error("[EMPLOYEE FORM] Error message:", err.message)
      console.error("[EMPLOYEE FORM] Error status:", err.status)
      setError(err.message || `Failed to ${isEditMode ? "update" : "create"} employee`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Employee" : "Add New Employee"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <Input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="e.g., John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name *
            </label>
            <Input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="e.g., Doe"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email (Optional)
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@company.com"
          />
        </div>

        {/* Designation and Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Designation (Optional)
            </label>
            <Input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="e.g., Senior Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department ID (Optional)
            </label>
            <Input
              type="text"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              placeholder="UUID"
            />
          </div>
        </div>

        {/* Salary and Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Base Salary (Optional)
            </label>
            <Input
              type="number"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleInputChange}
              placeholder="85000"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Join Date (Optional)
            </label>
            <Input
              type="date"
              name="join_date"
              value={formData.join_date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Active Status - Only show in edit mode */}
        {isEditMode && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Active Employee
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? `${isEditMode ? "Updating" : "Creating"}...` : (isEditMode ? "Update Employee" : "Create Employee")}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
