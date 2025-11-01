'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { useSupabaseAuth } from '@/lib/supabase-auth-context';
import { Reminder, ReminderFormData } from '@/lib/types';
import * as remindersApi from '@/lib/reminders-api';
import { PageHeader, ErrorBanner, LastUpdated } from '@/components/common';
import { Button } from '@/components/ui/button';
import { ReminderForm } from '@/components/budget/reminder-form';
import { RemindersTable } from '@/components/budget/reminders-list';
import { ReminderDetails } from '@/components/budget/reminder-details';

type ViewMode = 'list' | 'details';

export default function RemindersPage() {
  const { user, userRole } = useSupabaseAuth();
  const isAdmin = userRole === 'admin';

  // State management
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Details view state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all reminders and today's reminders
        const [allReminders, todayRems] = await Promise.all([
          remindersApi.getReminders(),
          remindersApi.getTodayReminders(7),
        ]);

        setReminders(allReminders);
        setTodayReminders(todayRems);
      } catch (err: any) {
        console.error('Failed to fetch reminders:', err);
        setError(err?.message || 'Failed to load reminders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (formData: ReminderFormData) => {
    try {
      setIsFormLoading(true);
      setError(null);

      if (editingReminder) {
        // Update existing reminder
        const updated = await remindersApi.updateReminder(editingReminder.id, formData);
        setReminders(reminders.map(r => (r.id === updated.id ? updated : r)));
        if (selectedReminder?.id === updated.id) {
          setSelectedReminder(updated);
        }
      } else {
        // Create new reminder
        const created = await remindersApi.createReminder(formData);
        setReminders([created, ...reminders]);
      }

      setEditingReminder(null);
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err?.message || 'Failed to save reminder');
      throw err;
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
    setViewMode('list');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);

      await remindersApi.deleteReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
      
      if (selectedReminder?.id === id) {
        setSelectedReminder(null);
        setViewMode('list');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err?.message || 'Failed to delete reminder');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle view reminder details
  const handleViewDetails = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setViewMode('details');
  };

  // Handle create new reminder
  const handleCreateNew = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  // Handle close details
  const handleCloseDetails = () => {
    setViewMode('list');
    setSelectedReminder(null);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="Reminders"
            description="Manage and track your accounting reminders"
            breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Reminders' }]}
            meta={<LastUpdated />}
          />

          {error && <ErrorBanner message={error} onRetry={() => setError(null)} />}

          {/* Today's Reminders Widget */}
          {!isLoading && todayReminders.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Today's Reminders
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    You have {todayReminders.length} reminder{todayReminders.length !== 1 ? 's' : ''} due in the next 7 days
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600">{todayReminders.length}</div>
              </div>

              {/* Quick list of today's reminders */}
              <div className="mt-4 space-y-2">
                {todayReminders.slice(0, 3).map(reminder => (
                  <div
                    key={reminder.id}
                    className="text-sm text-blue-700 flex items-center gap-2 cursor-pointer hover:text-blue-900 transition-colors"
                    onClick={() => handleViewDetails(reminder)}
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    <span className="flex-1 truncate">{reminder.title}</span>
                    <span className="text-xs text-blue-600 whitespace-nowrap">
                      ({new Date(reminder.reminder_date).toLocaleDateString()})
                    </span>
                  </div>
                ))}
                {todayReminders.length > 3 && (
                  <p className="text-xs text-blue-600 italic">
                    +{todayReminders.length - 3} more...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {/* Header with create button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-2xl font-bold text-gray-900">All Reminders</h2>
                {isAdmin && (
                  <Button onClick={handleCreateNew} className="w-full sm:w-auto">
                    + Create Reminder
                  </Button>
                )}
              </div>

              {/* Reminders List */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <RemindersTable
                  reminders={reminders}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={isAdmin}
                  canDelete={isAdmin}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
              {selectedReminder && (
                <ReminderDetails
                  reminder={selectedReminder}
                  onEdit={() => handleEdit(selectedReminder)}
                  onDelete={() => handleDelete(selectedReminder.id)}
                  onClose={handleCloseDetails}
                  canEdit={isAdmin}
                  canDelete={isAdmin}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          )}

          {/* Reminder Form Modal */}
          <ReminderForm
            reminder={editingReminder || undefined}
            isOpen={isFormOpen}
            isLoading={isFormLoading}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
            title={editingReminder ? 'Edit Reminder' : 'Create Reminder'}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
