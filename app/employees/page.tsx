"use client"

import { useState, useEffect, useMemo } from "react"
import { apiClient } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/common/page-header"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { ErrorBanner } from "@/components/common/error-banner"
import { EmptyState } from "@/components/common/empty-state"
import { Toolbar } from "@/components/common/toolbar"
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
  FunnelIcon
} from "@heroicons/react/24/outline"

interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  designation: string
  department?: string
  base_salary: number
  date_of_joining?: string
  is_active: boolean
  created_at: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiClient.getEmployees()
      // Ensure data is always an array
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || "Failed to load employees")
      setEmployees([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    // Safety check: ensure employees is always an array
    if (!Array.isArray(employees)) {
      return []
    }
    
    return employees.filter((emp) => {
      const matchesSearch =
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && emp.is_active) ||
        (filterStatus === "inactive" && !emp.is_active)

      return matchesSearch && matchesStatus
    })
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  if (loading) {
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

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Manage and view all employees in your organization"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Employees" }
        ]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <UserPlusIcon className="w-4 h-4" />
            Add Employee
          </button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={loadEmployees} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
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

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
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

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
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

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
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
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {employee.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {employee.department || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {formatSalary(employee.base_salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
    </div>
    </>
  )
}
