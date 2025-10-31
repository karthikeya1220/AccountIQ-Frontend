import type React from "react"
import type { PermissionMetadata } from "@/lib/rbac-utils"
import { canEditField, getFieldState } from "@/lib/rbac-utils"
import { Lock } from "lucide-react"

interface EditableFieldProps {
  name: string
  label: string
  type?: string
  value: string | number | readonly string[] | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  metadata?: PermissionMetadata
  placeholder?: string
  required?: boolean
  multiline?: boolean
  rows?: number
  className?: string
  disabled?: boolean
  children?: React.ReactNode
  readOnly?: boolean
  min?: number | string
  max?: number | string
  step?: number | string
}

/**
 * EditableField Component
 * 
 * A wrapper around input/textarea that automatically:
 * 1. Disables editing based on permissions
 * 2. Shows lock icon for read-only fields
 * 3. Shows permission status in title
 * 4. Respects user role
 */
export function EditableField({
  name,
  label,
  type = "text",
  value,
  onChange,
  metadata,
  placeholder,
  required = false,
  multiline = false,
  rows = 3,
  className = "",
  disabled = false,
  readOnly = false,
  min,
  max,
  step,
}: EditableFieldProps) {
  const isEditable = canEditField(name, metadata)
  const fieldState = getFieldState(name, metadata)

  // Combine disabled states
  const isDisabled = disabled || !isEditable

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!isEditable && (
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={isDisabled}
          readOnly={!isEditable}
          title={fieldState.title}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isDisabled
              ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
              : "hover:border-gray-400 dark:hover:border-gray-500"
          } ${className}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={!isEditable}
          title={fieldState.title}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isDisabled
              ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
              : "hover:border-gray-400 dark:hover:border-gray-500"
          } ${className}`}
        />
      )}

      {!isEditable && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          {metadata?.userRole === "admin"
            ? "Field is not editable"
            : "You do not have permission to edit this field"}
        </p>
      )}
    </div>
  )
}

/**
 * EditableSelect Component
 * Similar to EditableField but for select inputs
 */
interface EditableSelectProps {
  name: string
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  metadata?: PermissionMetadata
  options: Array<{ value: string | number; label: string }>
  required?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function EditableSelect({
  name,
  label,
  value,
  onChange,
  metadata,
  options,
  required = false,
  className = "",
  disabled = false,
  placeholder,
}: EditableSelectProps) {
  const isEditable = canEditField(name, metadata)
  const fieldState = getFieldState(name, metadata)
  const isDisabled = disabled || !isEditable

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!isEditable && (
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        title={fieldState.title}
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          isDisabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
            : "hover:border-gray-400 dark:hover:border-gray-500"
        } ${className}`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {!isEditable && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          You do not have permission to edit this field
        </p>
      )}
    </div>
  )
}

/**
 * ReadOnlyField Component
 * Display a field as read-only with visual indicator
 */
interface ReadOnlyFieldProps {
  label: string
  value: string | number | undefined
  className?: string
}

export function ReadOnlyField({
  label,
  value,
  className = "",
}: ReadOnlyFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white">
        <span className="text-gray-500 dark:text-gray-400">
          {value || "—"}
        </span>
        <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-auto" />
      </div>
    </div>
  )
}

/**
 * PermissionBanner Component
 * Display current permission level at top of form
 */
interface PermissionBannerProps {
  metadata?: PermissionMetadata
  className?: string
}

export function PermissionBanner({
  metadata,
  className = "",
}: PermissionBannerProps) {
  if (!metadata) return null

  const isAdmin = metadata.userRole === "admin"
  const canEdit = metadata.editingEnabled || metadata.editable.length > 0

  if (isAdmin) {
    return (
      <div className={`p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm ${className}`}>
        <span className="font-semibold">👑 Admin Access</span> - You can view and edit all fields
      </div>
    )
  }

  if (canEdit) {
    return (
      <div className={`p-4 mb-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 text-sm ${className}`}>
        <span className="font-semibold">✏️ Limited Edit Access</span> - You can edit {metadata.editable.length} field{metadata.editable.length === 1 ? "" : "s"}
      </div>
    )
  }

  return (
    <div className={`p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm ${className}`}>
      <span className="font-semibold">👁️ View Only</span> - You can only view this data
    </div>
  )
}
