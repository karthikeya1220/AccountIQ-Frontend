/**
 * Input validators
 * Validates and sanitizes user inputs
 */

export const validators = {
  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * Validate password (client-side basic check)
   */
  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password || password.length === 0) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Sanitize email
   */
  sanitizeEmail(email: string): string {
    return email.trim().toLowerCase().slice(0, 254);
  },

  /**
   * Sanitize string (prevent XSS)
   */
  sanitizeString(str: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return str.replace(/[&<>"']/g, (char) => map[char]);
  },

  /**
   * Check for injection attempts
   */
  containsSuspiciousPatterns(str: string): boolean {
    const suspiciousPatterns = [
      /(\bOR\b|AND\b).*(1|true)/i, // SQL injection
      /<script|<iframe|javascript:/i, // XSS
      /['";\\]/g, // Quote escaping
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(str));
  },
};
