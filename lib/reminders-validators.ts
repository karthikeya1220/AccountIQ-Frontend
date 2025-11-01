import { ReminderFormData } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate reminder form data
 */
export function validateReminderForm(data: ReminderFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Title is required
  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required',
    });
  } else if (data.title.length < 3) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 3 characters',
    });
  } else if (data.title.length > 255) {
    errors.push({
      field: 'title',
      message: 'Title cannot exceed 255 characters',
    });
  }

  // Reminder date is required
  if (!data.reminder_date) {
    errors.push({
      field: 'reminder_date',
      message: 'Reminder date is required',
    });
  } else if (!isValidDate(data.reminder_date)) {
    errors.push({
      field: 'reminder_date',
      message: 'Invalid date format. Use YYYY-MM-DD',
    });
  } else if (new Date(data.reminder_date) < new Date()) {
    // Note: This check might be too strict for updating past reminders
    // Uncomment if you want to prevent past dates
    // errors.push({
    //   field: 'reminder_date',
    //   message: 'Reminder date cannot be in the past',
    // });
  }

  // Description optional but max length 1000
  if (data.description && data.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Description cannot exceed 1000 characters',
    });
  }

  // Reminder time optional but must be valid if provided
  if (data.reminder_time && !isValidTime(data.reminder_time)) {
    errors.push({
      field: 'reminder_time',
      message: 'Invalid time format. Use HH:MM (24-hour format)',
    });
  }

  // Type is optional but must be valid if provided
  if (data.type && !['bill', 'expense', 'salary', 'custom'].includes(data.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid reminder type',
    });
  }

  // Related ID optional but must be UUID if provided
  if (data.related_id && !isValidUUID(data.related_id)) {
    errors.push({
      field: 'related_id',
      message: 'Invalid related item ID format',
    });
  }

  // Validate notification methods if provided
  if (data.notification_methods && data.notification_methods.length > 0) {
    const validMethods = ['email', 'sms', 'in_app', 'push'];
    const invalidMethods = data.notification_methods.filter(m => !validMethods.includes(m));
    if (invalidMethods.length > 0) {
      errors.push({
        field: 'notification_methods',
        message: `Invalid notification methods: ${invalidMethods.join(', ')}`,
      });
    }
  }

  // Validate recipients if provided
  if (data.recipients && data.recipients.trim().length > 0) {
    const emails = data.recipients.split(',').map(e => e.trim());
    const invalidEmails = emails.filter(e => !isValidEmail(e));
    if (invalidEmails.length > 0) {
      errors.push({
        field: 'recipients',
        message: `Invalid email addresses: ${invalidEmails.join(', ')}`,
      });
    }
  }

  return errors;
}

/**
 * Validate date format YYYY-MM-DD
 */
export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  try {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Validate time format HH:MM
 */
export function isValidTime(timeStr: string): boolean {
  const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(timeStr);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Format date for display
 */
export function formatReminderDate(dateStr: string): string {
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format time for display
 */
export function formatReminderTime(timeStr: string | undefined): string {
  if (!timeStr) return 'Not set';
  try {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const min = parseInt(minutes);
    return new Date(0, 0, 0, hour, min).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeStr;
  }
}

/**
 * Get readable status label
 */
export function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Inactive';
}

/**
 * Get readable type label
 */
export function getTypeLabel(type: string | undefined): string {
  const labels: Record<string, string> = {
    bill: 'Bill',
    expense: 'Expense',
    salary: 'Salary',
    custom: 'Custom',
  };
  return labels[type || ''] || 'General';
}
