export type UserRole = "admin" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface Bill {
  id: string
  date: Date
  amount: number
  description: string
  expenseType: "office" | "travel" | "software" | "equipment" | "other"
  linkedCard?: string
  linkedCash?: boolean
  fileUrl?: string
  fileName?: string
  uploadedAt: Date
  uploadedBy: string
}

export interface Card {
  id: string
  cardName: string
  cardNumber: string
  holderName: string
  expiryDate: string
  balance: number
  limit: number
  status: "active" | "inactive"
  createdAt: Date
}

export interface CardTransaction {
  id: string
  cardId: string
  amount: number
  description: string
  date: Date
  category: string
  status: "pending" | "completed"
}

export interface CashTransaction {
  id: string
  type: "inflow" | "outflow"
  amount: number
  description: string
  date: Date
  category: string
  recordedBy: string
}

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  joinDate: Date
  baseSalary: number
}

export interface Salary {
  id: string
  employeeId: string
  month: Date
  amount: number
  status: "pending" | "paid"
  paidDate?: Date
}

export interface PettyExpense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  recordedBy: string
}

export interface Budget {
  id: string
  cardId?: string
  category?: string
  limit: number
  spent: number
  month: Date
  alertThreshold: number // percentage
}

export interface Reminder {
  id: string
  title: string
  description?: string
  reminder_date: string // YYYY-MM-DD format
  reminder_time?: string // HH:MM format
  type?: "bill" | "expense" | "salary" | "custom"
  related_id?: string // UUID of linked item
  notification_methods?: ("email" | "sms" | "in_app" | "push")[]
  recipients?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ReminderFormData {
  title: string
  description?: string
  reminder_date: string
  reminder_time?: string
  type?: string
  related_id?: string
  notification_methods?: string[]
  recipients?: string
  is_active?: boolean
}

export interface ReminderFilters {
  type?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
  searchText?: string
}

export interface DashboardMetrics {
  totalExpenses: number
  totalIncome: number
  cardBalances: number
  cashOnHand: number
  budgetStatus: {
    onTrack: number
    warning: number
    exceeded: number
  }
}
