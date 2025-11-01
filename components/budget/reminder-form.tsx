'use client';

import React, { useState, useEffect } from 'react';
import { ReminderFormData, Reminder } from '@/lib/types';
import { validateReminderForm, ValidationError } from '@/lib/reminders-validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/common/modal';

interface ReminderFormProps {
  reminder?: Reminder;
  isOpen: boolean;
  isLoading?: boolean;
  onSubmit: (data: ReminderFormData) => Promise<void>;
  onClose: () => void;
  title?: string;
}

const REMINDER_TYPES = [
  { value: 'bill', label: 'Bill' },
  { value: 'expense', label: 'Expense' },
  { value: 'salary', label: 'Salary' },
  { value: 'custom', label: 'Custom' },
];

const NOTIFICATION_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-App' },
  { value: 'push', label: 'Push' },
];

export const ReminderForm: React.FC<ReminderFormProps> = ({
  reminder,
  isOpen,
  isLoading = false,
  onSubmit,
  onClose,
  title = reminder ? 'Edit Reminder' : 'Create Reminder',
}) => {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    reminder_date: '',
    description: '',
    reminder_time: '',
    type: 'custom',
    notification_methods: [],
    recipients: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form with reminder data if editing
  useEffect(() => {
    if (reminder && isOpen) {
      setFormData({
        title: reminder.title,
        reminder_date: reminder.reminder_date,
        description: reminder.description || '',
        reminder_time: reminder.reminder_time || '',
        type: reminder.type || 'custom',
        related_id: reminder.related_id,
        notification_methods: reminder.notification_methods || [],
        recipients: reminder.recipients?.join(', ') || '',
        is_active: reminder.is_active,
      });
      setErrors([]);
      setSubmitError(null);
    } else if (isOpen && !reminder) {
      // Reset form for new reminder
      setFormData({
        title: '',
        reminder_date: '',
        description: '',
        reminder_time: '',
        type: 'custom',
        notification_methods: [],
        recipients: '',
        is_active: true,
      });
      setErrors([]);
      setSubmitError(null);
    }
  }, [reminder, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    setErrors(prev => prev.filter(err => err.field !== name));
  };

  const handleNotificationMethodChange = (method: string) => {
    setFormData(prev => {
      const methods = prev.notification_methods || [];
      const newMethods = methods.includes(method as any)
        ? methods.filter(m => m !== method)
        : [...methods, method as any];
      return {
        ...prev,
        notification_methods: newMethods,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    const validationErrors = validateReminderForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setSubmitError(error?.message || 'Failed to save reminder. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  const getErrorMessage = (field: string): string | undefined => {
    return errors.find(err => err.field === field)?.message;
  };

  const hasError = (field: string): boolean => {
    return errors.some(err => err.field === field);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Bill Payment Due"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            className={hasError('title') ? 'border-red-500' : ''}
          />
          {getErrorMessage('title') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('title')}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Additional details about this reminder"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('description') ? 'border-red-500' : 'border-gray-300'
            } ${isLoading ? 'bg-gray-100' : ''}`}
          />
          {getErrorMessage('description') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('description')}</p>
          )}
        </div>

        {/* Reminder Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type || 'custom'}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('type') ? 'border-red-500' : 'border-gray-300'
            } ${isLoading ? 'bg-gray-100' : ''}`}
          >
            {REMINDER_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {getErrorMessage('type') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('type')}</p>
          )}
        </div>

        {/* Reminder Date */}
        <div>
          <label htmlFor="reminder_date" className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="reminder_date"
            name="reminder_date"
            type="date"
            value={formData.reminder_date}
            onChange={handleChange}
            disabled={isLoading}
            className={hasError('reminder_date') ? 'border-red-500' : ''}
          />
          {getErrorMessage('reminder_date') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('reminder_date')}</p>
          )}
        </div>

        {/* Reminder Time */}
        <div>
          <label htmlFor="reminder_time" className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Time (Optional)
          </label>
          <Input
            id="reminder_time"
            name="reminder_time"
            type="time"
            value={formData.reminder_time}
            onChange={handleChange}
            disabled={isLoading}
            className={hasError('reminder_time') ? 'border-red-500' : ''}
          />
          {getErrorMessage('reminder_time') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('reminder_time')}</p>
          )}
        </div>

        {/* Notification Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Methods
          </label>
          <div className="space-y-2">
            {NOTIFICATION_METHODS.map(method => (
              <div key={method.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`notification_${method.value}`}
                  checked={(formData.notification_methods || []).includes(method.value as any)}
                  onChange={() => handleNotificationMethodChange(method.value)}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor={`notification_${method.value}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {method.label}
                </label>
              </div>
            ))}
          </div>
          {getErrorMessage('notification_methods') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('notification_methods')}</p>
          )}
        </div>

        {/* Recipients */}
        <div>
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">
            Recipients (comma-separated emails)
          </label>
          <Input
            id="recipients"
            name="recipients"
            type="text"
            placeholder="user1@company.com, user2@company.com"
            value={formData.recipients}
            onChange={handleChange}
            disabled={isLoading}
            className={hasError('recipients') ? 'border-red-500' : ''}
          />
          {getErrorMessage('recipients') && (
            <p className="mt-1 text-sm text-red-500">{getErrorMessage('recipients')}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active !== false}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Error Banner */}
        {submitError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : reminder ? 'Update Reminder' : 'Create Reminder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
