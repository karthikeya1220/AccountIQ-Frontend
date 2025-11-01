'use client';

import React from 'react';
import { Reminder } from '@/lib/types';
import { formatReminderDate, formatReminderTime, getTypeLabel, getStatusLabel } from '@/lib/reminders-validators';
import { Button } from '@/components/ui/button';

interface ReminderDetailsProps {
  reminder: Reminder;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  isDeleting?: boolean;
}

export const ReminderDetails: React.FC<ReminderDetailsProps> = ({
  reminder,
  onEdit,
  onDelete,
  onClose,
  canEdit = false,
  canDelete = false,
  isDeleting = false,
}) => {
  const handleDeleteClick = () => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      onDelete?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{reminder.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getTypeLabel(reminder.type)}
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                reminder.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {getStatusLabel(reminder.is_active)}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Description */}
      {reminder.description && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{reminder.description}</p>
        </div>
      )}

      {/* Schedule Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Reminder Date
          </h3>
          <p className="mt-2 text-lg text-gray-900">
            {formatReminderDate(reminder.reminder_date)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Reminder Time
          </h3>
          <p className="mt-2 text-lg text-gray-900">
            {formatReminderTime(reminder.reminder_time)}
          </p>
        </div>
      </div>

      {/* Notification Settings */}
      {(reminder.notification_methods?.length || 0) > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Notification Methods
          </h3>
          <div className="flex flex-wrap gap-2">
            {reminder.notification_methods?.map(method => (
              <span
                key={method}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
              >
                {method === 'in_app' ? 'In-App' : method.charAt(0).toUpperCase() + method.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recipients */}
      {(reminder.recipients?.length || 0) > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Recipients
          </h3>
          <div className="space-y-1">
            {reminder.recipients?.map(email => (
              <div key={email} className="text-gray-700">
                {email}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Item */}
      {reminder.related_id && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Related Item
          </h3>
          <p className="mt-2 text-gray-700 font-mono text-sm">{reminder.related_id}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-gray-500 font-medium">Created</h4>
            <p className="text-gray-700">
              {new Date(reminder.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <h4 className="text-gray-500 font-medium">Last Updated</h4>
            <p className="text-gray-700">
              {new Date(reminder.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {(canEdit || canDelete || onClose) && (
        <div className="flex justify-end gap-3 border-t pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
          {canEdit && onEdit && (
            <Button onClick={onEdit}>
              Edit Reminder
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Reminder'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
