'use client';

import React, { useState, useEffect } from 'react';
import { Reminder, ReminderFilters } from '@/lib/types';
import { formatReminderDate, formatReminderTime, getTypeLabel, getStatusLabel } from '@/lib/reminders-validators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { EmptyState } from '@/components/common/empty-state';

interface RemindersTableProps {
  reminders: Reminder[];
  isLoading?: boolean;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onFiltersChange?: (filters: ReminderFilters) => void;
  canEdit?: boolean; // Usually admin only
  canDelete?: boolean; // Usually admin only
}

export const RemindersTable: React.FC<RemindersTableProps> = ({
  reminders,
  isLoading = false,
  onEdit,
  onDelete,
  onFiltersChange,
  canEdit = false,
  canDelete = false,
}) => {
  const [filters, setFilters] = useState<ReminderFilters>({});
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>(reminders);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Apply filters when reminders or filter values change
  useEffect(() => {
    let result = [...reminders];

    // Search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(
        r =>
          r.title.toLowerCase().includes(search) ||
          (r.description?.toLowerCase() || '').includes(search)
      );
    }

    // Type filter
    if (selectedType) {
      result = result.filter(r => r.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== '') {
      const isActive = selectedStatus === 'active';
      result = result.filter(r => r.is_active === isActive);
    }

    setFilteredReminders(result);

    // Notify parent of filter changes
    if (onFiltersChange) {
      onFiltersChange({
        type: selectedType || undefined,
        isActive: selectedStatus === '' ? undefined : selectedStatus === 'active',
        searchText: searchText || undefined,
      });
    }
  }, [reminders, searchText, selectedType, selectedStatus, onFiltersChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  if (reminders.length === 0) {
    return <EmptyState title="No reminders" description="Create your first reminder to get started." />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search reminders..."
          value={searchText}
          onChange={handleSearchChange}
          className="w-full"
        />
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="bill">Bill</option>
          <option value="expense">Expense</option>
          <option value="salary">Salary</option>
          <option value="custom">Custom</option>
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredReminders.length} of {reminders.length} reminders
      </div>

      {/* Table */}
      {filteredReminders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Methods</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map(reminder => (
                <tr key={reminder.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{reminder.title}</div>
                      {reminder.description && (
                        <div className="text-sm text-gray-600 truncate">{reminder.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {getTypeLabel(reminder.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatReminderDate(reminder.reminder_date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatReminderTime(reminder.reminder_time)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        reminder.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusLabel(reminder.is_active)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {reminder.notification_methods && reminder.notification_methods.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {reminder.notification_methods.map(method => (
                          <span
                            key={method}
                            className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(reminder)}
                          >
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(reminder.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No reminders found"
          description="Try adjusting your search or filters"
        />
      )}
    </div>
  );
};

// Backward compatibility export for budget page
export const RemindersList = RemindersTable;
