"use client"

interface Reminder {
  id: string
  title: string
  message: string
  type: string
  date: string
  read: boolean
}

interface RemindersListProps {
  reminders: Reminder[]
  onMarkRead: (reminderId: string) => void
  onDelete: (reminderId: string) => void
}

export function RemindersList({ reminders, onMarkRead, onDelete }: RemindersListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-4 border-error bg-error/5"
      case "warning":
        return "border-l-4 border-warning bg-warning/5"
      case "info":
        return "border-l-4 border-primary bg-primary/5"
      default:
        return "border-l-4 border-border bg-background-secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical":
        return "🔴"
      case "warning":
        return "🟡"
      case "info":
        return "ℹ️"
      default:
        return "📌"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const unreadReminders = reminders.filter((r) => !r.read)
  const readReminders = reminders.filter((r) => r.read)

  return (
    <div className="card">
      <h2 className="card-title mb-4">Reminders & Alerts</h2>

      {unreadReminders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Unread ({unreadReminders.length})</h3>
          <div className="space-y-3">
            {unreadReminders.map((reminder) => (
              <div key={reminder.id} className={`p-4 rounded-lg ${getTypeColor(reminder.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getTypeIcon(reminder.type)}</span>
                      <p className="font-semibold text-foreground">{reminder.title}</p>
                    </div>
                    <p className="text-sm text-foreground-secondary mb-2">{reminder.message}</p>
                    <p className="text-xs text-foreground-secondary">{formatDate(reminder.date)}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onMarkRead(reminder.id)}
                      className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-80"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => onDelete(reminder.id)}
                      className="text-xs px-2 py-1 rounded bg-border text-foreground hover:bg-border/80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {readReminders.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Read ({readReminders.length})</h3>
          <div className="space-y-2">
            {readReminders.map((reminder) => (
              <div key={reminder.id} className="p-3 rounded-lg bg-background-secondary opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground line-through">{reminder.title}</p>
                    <p className="text-xs text-foreground-secondary">{formatDate(reminder.date)}</p>
                  </div>
                  <button
                    onClick={() => onDelete(reminder.id)}
                    className="text-xs px-2 py-1 rounded bg-border text-foreground hover:bg-border/80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-foreground-secondary">No reminders yet</p>
        </div>
      )}
    </div>
  )
}
