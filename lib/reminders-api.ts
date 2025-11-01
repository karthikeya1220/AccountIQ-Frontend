import { apiClient } from './api-client';
import { Reminder, ReminderFormData, ReminderFilters } from './types';

/**
 * Get all reminders with optional filters
 */
export async function getReminders(filters?: ReminderFilters): Promise<Reminder[]> {
  try {
    const params = filters ? {
      type: filters.type,
      isActive: filters.isActive !== undefined ? filters.isActive : undefined,
      startDate: filters.startDate,
      endDate: filters.endDate,
      searchText: filters.searchText,
    } : undefined;

    const data = await apiClient.getReminders(params);
    return data;
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    throw error;
  }
}

/**
 * Get today's reminders and upcoming reminders
 * @param days - Number of days to look ahead (default: 7)
 */
export async function getTodayReminders(days: number = 7): Promise<Reminder[]> {
  try {
    const data = await apiClient.getTodayReminders(days);
    return data;
  } catch (error) {
    console.error('Failed to fetch today reminders:', error);
    throw error;
  }
}

/**
 * Get a specific reminder by ID
 */
export async function getReminderById(id: string): Promise<Reminder> {
  try {
    const data = await apiClient.getReminderById(id);
    return data;
  } catch (error) {
    console.error(`Failed to fetch reminder ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new reminder
 * Required fields: title, reminder_date
 */
export async function createReminder(formData: ReminderFormData): Promise<Reminder> {
  try {
    // Parse recipients from comma-separated string if needed
    const recipients = formData.recipients
      ? formData.recipients.split(',').map(e => e.trim())
      : [];

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      reminder_date: formData.reminder_date,
      reminder_time: formData.reminder_time || undefined,
      type: formData.type || undefined,
      related_id: formData.related_id || undefined,
      notification_methods: formData.notification_methods || [],
      recipients: recipients.length > 0 ? recipients : undefined,
      is_active: formData.is_active !== false,
    };

    const data = await apiClient.createReminder(payload);
    return data;
  } catch (error) {
    console.error('Failed to create reminder:', error);
    throw error;
  }
}

/**
 * Update an existing reminder
 * All fields are optional - only send what needs updating
 */
export async function updateReminder(id: string, formData: Partial<ReminderFormData>): Promise<Reminder> {
  try {
    const payload: Record<string, any> = {};

    if (formData.title !== undefined) payload.title = formData.title;
    if (formData.description !== undefined) payload.description = formData.description;
    if (formData.reminder_date !== undefined) payload.reminder_date = formData.reminder_date;
    if (formData.reminder_time !== undefined) payload.reminder_time = formData.reminder_time;
    if (formData.type !== undefined) payload.type = formData.type;
    if (formData.related_id !== undefined) payload.related_id = formData.related_id;
    if (formData.notification_methods !== undefined) payload.notification_methods = formData.notification_methods;
    if (formData.is_active !== undefined) payload.is_active = formData.is_active;
    
    if (formData.recipients !== undefined) {
      payload.recipients = formData.recipients
        ? formData.recipients.split(',').map(e => e.trim())
        : [];
    }

    const data = await apiClient.updateReminder(id, payload);
    return data;
  } catch (error) {
    console.error(`Failed to update reminder ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a reminder
 */
export async function deleteReminder(id: string): Promise<{ message: string }> {
  try {
    const data = await apiClient.deleteReminder(id);
    return data;
  } catch (error) {
    console.error(`Failed to delete reminder ${id}:`, error);
    throw error;
  }
}
