"use client"

import { useState, useEffect, useMemo } from "react"
import { apiClient } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/common/page-header"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { ErrorBanner } from "@/components/common/error-banner"
import { EmptyState } from "@/components/common/empty-state"
import { Toolbar } from "@/components/common/toolbar"
import { Modal } from "@/components/common/modal"
import { EmployeeForm, DeleteConfirmation } from "@/components/employees"
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone?: string
  designation: string
  department?: string | null
  department_id?: string | null
  base_salary: number
  date_of_joining?: string
  join_date?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Modal states
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    console.log("[DEBUG] EmployeesPage mounted - loading initial data")
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("[DEBUG] Starting to load employees...")
      const response = await apiClient.getEmployees()
      console.log("[DEBUG] Raw API response:", response)
      console.log("[DEBUG] Response type:", typeof response)
      
      // Backend returns { success: true, data: [...] }
      let employeeArray: Employee[] = []
      if (response?.data && Array.isArray(response.data)) {
        console.log("[DEBUG] Extracting data from response.data")
        employeeArray = response.data
      } else if (Array.isArray(response)) {
        console.log("[DEBUG] Response is already an array")
        employeeArray = response
      } else {
        console.log("[DEBUG] Response format unexpected:", response)
      }
      
      console.log("[DEBUG] Setting employees with:", employeeArray)
      console.log("[DEBUG] Number of employees:", employeeArray.length)
      
      setEmployees(employeeArray)
    } catch (err: any) {
      console.error("[DEBUG] Error loading employees:", err)
      console.error("[DEBUG] Error message:", err.message)
      console.error("[DEBUG] Error status:", err.status)
      setError(err.message || "Failed to load employees")
      setEmployees([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    // Safety check: ensure employees is always an array
    if (!Array.isArray(employees)) {
      console.log("[DEBUG] Employees is not an array:", typeof employees)
      return []
    }
    
    console.log("[DEBUG] Filtering employees. Total:", employees.length)
    const filtered = employees.filter((emp) => {
      const matchesSearch =
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && emp.is_active) ||
        (filterStatus === "inactive" && !emp.is_active)

      return matchesSearch && matchesStatus
    })
    
    console.log("[DEBUG] Filtered employees. Result:", filtered.length)
    return filtered
  }, [employees, searchTerm, filterStatus])

  const stats = useMemo(() => {
    // Safety check: ensure employees is always an array
    if (!Array.isArray(employees) || employees.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        avgSalary: 0
      }
    }
    
    return {
      total: employees.length,
      active: employees.filter((e) => e.is_active).length,
      inactive: employees.filter((e) => !e.is_active).length,
      avgSalary: Math.round(employees.reduce((sum, e) => sum + e.base_salary, 0) / employees.length)
    }
  }, [employees])

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleFormSuccess = () => {
    console.log("[DEBUG] Form success - closing modal and reloading employees")
    setShowAddForm(false)
    setEditingEmployee(null)
    console.log("[DEBUG] About to call loadEmployees()")
    loadEmployees()
  }

  const handleDeleteSuccess = () => {
    setDeletingEmployee(null)
    loadEmployees()
  }

  const closeAllModals = () => {
    setShowAddForm(false)
    setEditingEmployee(null)
    setDeletingEmployee(null)
  }

  if (loading) {
    console.log("[DEBUG] Page is in loading state")
    return (
      <>
        <Navbar />
        <div className="p-6 space-y-6">
          <PageHeader
            title="Employee Directory"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Employees" }
            ]}
          />
          <LoadingSkeleton lines={8} />
        </div>
      </>
    )
  }

  console.log("[DEBUG] Rendering employees page. Filtered count:", filteredEmployees.length)
  console.log("[DEBUG] Total employees:", employees.length)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="Employee Directory"
            description="Manage and view all employees in your organization"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Employees" }
            ]}
        actions={
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add Employee
          </button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={loadEmployees} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Salary</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatSalary(stats.avgSalary)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        right={
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-background border border-border hover:bg-muted"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-background border border-border hover:bg-muted"
              }`}
            >
              List
            </button>
          </div>
        }
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </Toolbar>

      {/* Employees Display */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={<UserGroupIcon className="w-12 h-12" />}
          title="No employees found"
          description={searchTerm ? "Try adjusting your search or filters" : "Get started by adding your first employee"}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold shadow-sm">
                    {employee.first_name[0]}{employee.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{employee.designation}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.is_active
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {employee.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BriefcaseIcon className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Base Salary</p>
                  <p className="text-sm font-semibold text-foreground">{formatSalary(employee.base_salary)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(employee.date_of_joining)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => setEditingEmployee(employee)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeletingEmployee(employee)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                          {employee.first_name[0]}{employee.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {employee.phone || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {employee.designation}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {employee.department || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {formatSalary(employee.base_salary)}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.is_active
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {employee.is_active ? (
                          <>
                            <CheckCircleIcon className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingEmployee(employee)}
                          className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEmployee(employee)}
                          className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      {/* Add/Edit Employee Modal */}
      <Modal 
        isOpen={showAddForm || !!editingEmployee} 
        onClose={closeAllModals}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
      >
        {(showAddForm || editingEmployee) && (
          <EmployeeForm
            employee={editingEmployee || undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeAllModals}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        title="Delete Employee"
      >
        {deletingEmployee && (
          <DeleteConfirmation
            employee={deletingEmployee}
            onSuccess={handleDeleteSuccess}
            onCancel={() => setDeletingEmployee(null)}
          />
        )}
      </Modal>
        </div>
      </main>
    </>
  )
}
