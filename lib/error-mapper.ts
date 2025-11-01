/**
 * Maps Supabase and API errors to user-friendly messages
 */

export interface MappedError {
  message: string;
  userMessage: string;
  code: string;
  retryable: boolean;
}

export const errorMapper = {
  mapAuthError(error: any): MappedError {
    // Supabase auth errors
    if (error.message === 'Invalid login credentials') {
      return {
        message: error.message,
        userMessage:
          'Invalid email or password. Please check and try again.',
        code: 'INVALID_CREDENTIALS',
        retryable: true,
      };
    }

    if (error.message?.includes('Email not confirmed')) {
      return {
        message: error.message,
        userMessage:
          'Email not confirmed. Check your email for confirmation link.',
        code: 'EMAIL_NOT_CONFIRMED',
        retryable: false,
      };
    }

    if (error.message?.includes('too many requests')) {
      return {
        message: error.message,
        userMessage:
          'Too many login attempts. Please wait a few minutes before trying again.',
        code: 'RATE_LIMITED',
        retryable: false,
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        message: error.message,
        userMessage:
          'Login request timed out. Please check your internet connection and try again.',
        code: 'TIMEOUT',
        retryable: true,
      };
    }

    // Network errors
    if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
      return {
        message: error.message,
        userMessage:
          'Network error. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
        retryable: true,
      };
    }

    // Server errors
    if (error.status === 500) {
      return {
        message: error.message,
        userMessage:
          'Server error. Our team has been notified. Please try again later.',
        code: 'SERVER_ERROR',
        retryable: true,
      };
    }

    if (error.status === 503) {
      return {
        message: error.message,
        userMessage:
          'Service temporarily unavailable. We are performing maintenance. Please try again later.',
        code: 'SERVICE_UNAVAILABLE',
        retryable: false,
      };
    }

    // Default error
    return {
      message: error.message || 'Unknown error',
      userMessage:
        'An error occurred during login. Please try again. If the problem persists, contact support.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
    };
  },

  mapNetworkError(error: any): MappedError {
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout',
        userMessage:
          'Login request timed out. Please check your connection and try again.',
        code: 'TIMEOUT',
        retryable: true,
      };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        message: 'Connection refused',
        userMessage:
          'Cannot connect to the server. Please check your internet connection.',
        code: 'CONNECTION_REFUSED',
        retryable: true,
      };
    }

    return {
      message: error.message,
      userMessage: 'Network error. Please try again.',
      code: 'NETWORK_ERROR',
      retryable: true,
    };
  },
};
