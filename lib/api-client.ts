function resolveApiBase(): string {
  // Use Next.js API proxy route to avoid CORS issues entirely
  // This makes all API calls same-origin through /api/* route
  if (typeof window !== 'undefined') {
    // In browser: use same-origin proxy
    return '/api';
  }
  
  // Server-side rendering: use direct backend URL
  // Priority: explicit env var
  const envBase = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  if (envBase) return envBase;
  
  // Fallback for local dev
  return 'http://localhost:5001/api';
}

const API_BASE_URL = resolveApiBase();

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Permission metadata from backend responses
 * Indicates which fields the user can edit
 */
export interface PermissionMetadata {
  editable: string[];
  editingEnabled: boolean;
  userRole: 'admin' | 'user';
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    });

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
      console.log(`[API] Token attached for ${endpoint}`);
    } else {
      console.warn(`[API] No token available for ${endpoint}`);
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred',
        }));
        throw {
          message: error.message || 'Request failed',
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();

      // Note: Backend responses may include _metadata field with permission information
      // This is automatically included by the backend's withPermissionMetadata() function
      // Frontend can check data._metadata to know what fields are editable
      console.log(`[API] Response includes metadata:`, data._metadata ? 'yes' : 'no');

      return data;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me', { method: 'GET' });
  }

  // Bills endpoints
  async getBills(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/bills${queryString}`, { method: 'GET' });
  }

  async createBill(data: any) {
    return this.request<any>('/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBill(id: string, data: any) {
    return this.request<any>(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBill(id: string) {
    return this.request<any>(`/bills/${id}`, { method: 'DELETE' });
  }

  // Cards endpoints
  async getCards() {
    return this.request<any>('/cards', { method: 'GET' });
  }

  async createCard(data: any) {
    return this.request<any>('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCard(id: string, data: any) {
    return this.request<any>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string) {
    return this.request<any>(`/cards/${id}`, { method: 'DELETE' });
  }

  // Cash transactions endpoints
  async getCashTransactions(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/cash-transactions${queryString}`, { method: 'GET' });
  }

  async createCashTransaction(data: any) {
    return this.request<any>('/cash-transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCashTransaction(id: string, data: any) {
    return this.request<any>(`/cash-transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCashTransaction(id: string) {
    return this.request<any>(`/cash-transactions/${id}`, { method: 'DELETE' });
  }

  // Salary endpoints
  async getSalaries(params?: { month?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/salary${queryString}`, { method: 'GET' });
  }

  async createSalary(data: any) {
    return this.request<any>('/salary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSalary(id: string, data: any) {
    return this.request<any>(`/salary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Petty expenses endpoints
  async getPettyExpenses(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/petty-expenses${queryString}`, { method: 'GET' });
  }

  async createPettyExpense(data: any) {
    return this.request<any>('/petty-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePettyExpense(id: string, data: any) {
    return this.request<any>(`/petty-expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePettyExpense(id: string) {
    return this.request<any>(`/petty-expenses/${id}`, { method: 'DELETE' });
  }

  // Budget endpoints
  async getBudgets() {
    return this.request<any>('/budgets', { method: 'GET' });
  }

  async createBudget(data: any) {
    return this.request<any>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: string, data: any) {
    return this.request<any>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: string) {
    return this.request<any>(`/budgets/${id}`, { method: 'DELETE' });
  }

  // Employees endpoints
  async getEmployees(params?: { is_active?: boolean }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/employees${queryString}`, { method: 'GET' });
  }

  async getEmployeeById(id: string) {
    return this.request<any>(`/employees/${id}`, { method: 'GET' });
  }

  async createEmployee(data: any) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request<any>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<any>(`/employees/${id}`, { method: 'DELETE' });
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.request<any>('/dashboard', { method: 'GET' });
  }

  async getDashboardKPIs() {
    // Backend route is /dashboard/kpis/summary
    return this.request<any>('/dashboard/kpis/summary', { method: 'GET' });
  }

  async getExpensesChart(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/dashboard/charts/expenses${queryString}`, { method: 'GET' });
  }

  async getMonthlyTrend(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/dashboard/charts/monthly-trend${queryString}`, { method: 'GET' });
  }

  // Reminders endpoints
  async getReminders() {
    return this.request<any>('/reminders', { method: 'GET' });
  }

  async createReminder(data: any) {
    return this.request<any>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReminder(id: string, data: any) {
    return this.request<any>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(id: string) {
    return this.request<any>(`/reminders/${id}`, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
