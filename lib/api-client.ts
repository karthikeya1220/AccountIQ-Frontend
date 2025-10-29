import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Token expired - clear and redirect to login
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token;
  }

  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(endpoint, config);
    return (response.data.data ?? (response.data as unknown as T)) as T;
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(endpoint, data, config);
    return (response.data.data ?? (response.data as unknown as T)) as T;
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(endpoint, data, config);
    return (response.data.data ?? (response.data as unknown as T)) as T;
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(endpoint, config);
    return (response.data.data ?? (response.data as unknown as T)) as T;
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(endpoint, data, config);
    return (response.data.data ?? (response.data as unknown as T)) as T;
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  signup: (email: string, password: string, name: string) =>
    apiClient.post('/auth/signup', { email, password, name }),
  logout: () => apiClient.post('/auth/logout'),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
};

// Bills API
export const billsAPI = {
  getAll: (filters?: any) => apiClient.get('/bills', { params: filters }),
  getById: (id: string) => apiClient.get(`/bills/${id}`),
  create: (data: any) => apiClient.post('/bills', data),
  update: (id: string, data: any) => apiClient.put(`/bills/${id}`, data),
  delete: (id: string) => apiClient.delete(`/bills/${id}`),
  getStats: () => apiClient.get('/bills/stats/summary'),
  export: (format: 'pdf' | 'excel') => apiClient.get(`/bills/export/${format}`),
  uploadAttachment: (billId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/bills/${billId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Cards API
export const cardsAPI = {
  getAll: () => apiClient.get('/cards'),
  getById: (id: string) => apiClient.get(`/cards/${id}`),
  create: (data: any) => apiClient.post('/cards', data),
  update: (id: string, data: any) => apiClient.put(`/cards/${id}`, data),
  delete: (id: string) => apiClient.delete(`/cards/${id}`),
  getStats: () => apiClient.get('/cards/stats/summary'),
};

// Cash Transactions API
export const cashTransactionsAPI = {
  getAll: (filters?: any) => apiClient.get('/cash-transactions', { params: filters }),
  getById: (id: string) => apiClient.get(`/cash-transactions/${id}`),
  create: (data: any) => apiClient.post('/cash-transactions', data),
  update: (id: string, data: any) => apiClient.put(`/cash-transactions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/cash-transactions/${id}`),
  getStats: () => apiClient.get('/cash-transactions/stats/summary'),
  export: (format?: string) => apiClient.get(`/cash-transactions/export/${format || 'excel'}`),
};

// Salary API
export const salaryAPI = {
  getAll: (filters?: any) => apiClient.get('/salary', { params: filters }),
  getById: (id: string) => apiClient.get(`/salary/${id}`),
  create: (data: any) => apiClient.post('/salary', data),
  update: (id: string, data: any) => apiClient.put(`/salary/${id}`, data),
  delete: (id: string) => apiClient.delete(`/salary/${id}`),
  getStats: () => apiClient.get('/salary/stats/summary'),
  getEmployeeSalaryHistory: (employeeId: string) =>
    apiClient.get(`/salary/employee/${employeeId}`),
  markAsPaid: (id: string) => apiClient.put(`/salary/${id}/mark-paid`),
};

// Petty Expenses API
export const pettyExpensesAPI = {
  getAll: (filters?: any) => apiClient.get('/petty-expenses', { params: filters }),
  getById: (id: string) => apiClient.get(`/petty-expenses/${id}`),
  create: (data: any) => apiClient.post('/petty-expenses', data),
  update: (id: string, data: any) => apiClient.put(`/petty-expenses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/petty-expenses/${id}`),
  getStats: () => apiClient.get('/petty-expenses/stats/summary'),
  getMonthlySummary: (year?: number, month?: number) =>
    apiClient.get('/petty-expenses/summary/monthly', {
      params: { year, month },
    }),
};

// Budgets API
export const budgetsAPI = {
  getAll: (filters?: any) => apiClient.get('/budgets', { params: filters }),
  getById: (id: string) => apiClient.get(`/budgets/${id}`),
  create: (data: any) => apiClient.post('/budgets', data),
  update: (id: string, data: any) => apiClient.put(`/budgets/${id}`, data),
  delete: (id: string) => apiClient.delete(`/budgets/${id}`),
  getAlerts: () => apiClient.get('/budgets/alerts/current'),
};

// Reminders API
export const remindersAPI = {
  getAll: (filters?: any) => apiClient.get('/reminders', { params: filters }),
  getById: (id: string) => apiClient.get(`/reminders/${id}`),
  create: (data: any) => apiClient.post('/reminders', data),
  update: (id: string, data: any) => apiClient.put(`/reminders/${id}`, data),
  delete: (id: string) => apiClient.delete(`/reminders/${id}`),
  getUpcoming: (days?: number) =>
    apiClient.get('/reminders/upcoming/next-days', { params: { days } }),
  markAsSent: (id: string) => apiClient.put(`/reminders/${id}/mark-sent`),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getKPIs: () => apiClient.get('/dashboard/kpis/summary'),
  getExpensesChart: () => apiClient.get('/dashboard/charts/expenses'),
  getBudgetStatusChart: () => apiClient.get('/dashboard/charts/budget-status'),
  getMonthlyTrend: () => apiClient.get('/dashboard/charts/monthly-trend'),
  getRecentTransactions: (limit?: number) =>
    apiClient.get('/dashboard/recent-transactions', { params: { limit } }),
};

// Sessions API
export const sessionsAPI = {
  getAll: () => apiClient.get('/sessions'),
  getUserSessions: () => apiClient.get('/sessions/user'),
  revokeSession: (sessionId: string) => apiClient.delete(`/sessions/${sessionId}`),
  revokeAllUserSessions: (userId: string) =>
    apiClient.delete(`/sessions/user/${userId}/all`),
};

export default apiClient;
