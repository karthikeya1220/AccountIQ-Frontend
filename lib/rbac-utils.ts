import type { UserRole } from "./types"

/**
 * Metadata attached to API responses by backend
 * Tells frontend what fields are editable for the current user
 */
export interface PermissionMetadata {
  editable: string[]
  editingEnabled: boolean
  userRole: UserRole
}

/**
 * Extended response with permission metadata
 */
export interface ResponseWithMetadata<T> {
  _metadata?: PermissionMetadata
  [key: string]: any
}

/**
 * Check if a user can edit a specific resource
 * @param userRole - The user's role (admin or user)
 * @param metadata - Permission metadata from backend response
 * @returns boolean - true if user can edit anything in this resource
 */
export const canEditResource = (
  userRole: UserRole,
  metadata?: PermissionMetadata
): boolean => {
  if (!metadata) return false
  return metadata.editingEnabled || metadata.editable.length > 0
}

/**
 * Check if a specific field is editable for the user
 * @param fieldName - The field to check
 * @param metadata - Permission metadata from backend response
 * @returns boolean - true if user can edit this field
 */
export const canEditField = (
  fieldName: string,
  metadata?: PermissionMetadata
): boolean => {
  if (!metadata) return false
  return metadata.editable.includes(fieldName)
}

/**
 * Get list of editable fields from metadata
 * @param metadata - Permission metadata from backend response
 * @returns string[] - List of field names that can be edited
 */
export const getEditableFields = (metadata?: PermissionMetadata): string[] => {
  return metadata?.editable ?? []
}

/**
 * Check if user has admin role
 * @param userRole - The user's role
 * @returns boolean - true if user is admin
 */
export const isAdmin = (userRole?: UserRole): boolean => {
  return userRole === "admin"
}

/**
 * Check if user is regular user (non-admin)
 * @param userRole - The user's role
 * @returns boolean - true if user is regular user
 */
export const isRegularUser = (userRole?: UserRole): boolean => {
  return userRole === "user"
}

/**
 * Extract metadata from API response
 * @param response - API response object
 * @returns PermissionMetadata - Extracted metadata or default
 */
export const extractMetadata = (
  response: any
): PermissionMetadata => {
  if (!response || !response._metadata) {
    return {
      editable: [],
      editingEnabled: false,
      userRole: "user",
    }
  }

  return {
    editable: response._metadata.editable ?? [],
    editingEnabled: response._metadata.editingEnabled ?? false,
    userRole: response._metadata.userRole ?? "user",
  }
}

/**
 * Get display text for user permission status
 * @param metadata - Permission metadata
 * @returns string - User-friendly permission status
 */
export const getPermissionStatus = (metadata?: PermissionMetadata): string => {
  if (!metadata) return "Loading..."

  if (metadata.userRole === "admin") {
    return "Admin - Full Edit Access"
  }

  if (metadata.editingEnabled || metadata.editable.length > 0) {
    return `Edit Access (${metadata.editable.length} field${metadata.editable.length === 1 ? "" : "s"})`
  }

  return "View Only"
}

/**
 * Check if data has permission metadata
 * @param data - Response data
 * @returns boolean - true if metadata exists
 */
export const hasPermissionMetadata = (data: any): boolean => {
  return data && typeof data === "object" && "_metadata" in data
}

/**
 * Remove metadata from data object (for sending to backend)
 * @param data - Data with potential metadata
 * @returns Object without metadata
 */
export const removeMetadata = (data: any): any => {
  if (!data || typeof data !== "object") return data

  const { _metadata, ...cleanData } = data
  return cleanData
}

/**
 * Filter object to only include editable fields
 * @param data - Original data object
 * @param editableFields - List of editable field names
 * @returns Filtered object with only editable fields
 */
export const filterToEditableFields = (
  data: any,
  editableFields: string[]
): any => {
  if (!data || typeof data !== "object") return {}

  return editableFields.reduce(
    (acc, field) => {
      if (field in data) {
        acc[field] = data[field]
      }
      return acc
    },
    {} as any
  )
}

/**
 * Build form field state based on permissions
 * Useful for disabling/enabling form fields
 */
export interface FieldState {
  disabled: boolean
  readOnly: boolean
  title?: string
}

export const getFieldState = (
  fieldName: string,
  metadata?: PermissionMetadata
): FieldState => {
  const isEditable = canEditField(fieldName, metadata)

  return {
    disabled: !isEditable,
    readOnly: !isEditable,
    title: isEditable
      ? "You can edit this field"
      : "You do not have permission to edit this field",
  }
}

/**
 * Get all data including metadata as a clean object
 * @param response - API response with metadata
 * @returns Object with both data and metadata properties
 */
export const parseResponseWithMetadata = (
  response: any
): { data: any; metadata: PermissionMetadata } => {
  const metadata = extractMetadata(response)
  const data = removeMetadata(response)

  return {
    data,
    metadata,
  }
}

/**
 * Create a permission-aware form state
 * This is useful for tracking which fields should be disabled
 */
export const createPermissionAwareFormState = (
  formData: any,
  metadata?: PermissionMetadata
): Record<string, FieldState> => {
  const fields: Record<string, FieldState> = {}

  if (!formData || typeof formData !== "object") return fields

  Object.keys(formData).forEach((fieldName) => {
    // Skip metadata field itself
    if (fieldName === "_metadata") return

    fields[fieldName] = getFieldState(fieldName, metadata)
  })

  return fields
}
