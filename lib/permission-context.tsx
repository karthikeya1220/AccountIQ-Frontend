"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import type { UserRole } from "./types"
import type { PermissionMetadata } from "./rbac-utils"
import { extractMetadata } from "./rbac-utils"

/**
 * Permission context for managing RBAC across the app
 */
interface PermissionContextType {
  // Current user's permission metadata
  currentMetadata: PermissionMetadata | null

  // Set metadata (usually called after API response)
  setMetadata: (metadata: PermissionMetadata | null) => void

  // Set metadata from API response (automatically extracts _metadata)
  setMetadataFromResponse: (response: any) => void

  // Get metadata for a specific resource
  getResourceMetadata: (resource: string) => PermissionMetadata | null
  setResourceMetadata: (resource: string, metadata: PermissionMetadata) => void

  // User role
  userRole: UserRole | null
  setUserRole: (role: UserRole | null) => void

  // Clear all permissions (on logout)
  clearPermissions: () => void
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
)

/**
 * Provider component for permission context
 */
export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [currentMetadata, setCurrentMetadata] = useState<PermissionMetadata | null>(
    null
  )
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  // Store per-resource metadata
  const [resourceMetadata, setResourceMetadataState] = useState<
    Record<string, PermissionMetadata>
  >({})

  const setMetadataFromResponse = useCallback((response: any) => {
    const metadata = extractMetadata(response)
    setCurrentMetadata(metadata)
  }, [])

  const getResourceMetadata = useCallback(
    (resource: string): PermissionMetadata | null => {
      return resourceMetadata[resource] ?? null
    },
    [resourceMetadata]
  )

  const setResourceMetadata = useCallback(
    (resource: string, metadata: PermissionMetadata) => {
      setResourceMetadataState((prev) => ({
        ...prev,
        [resource]: metadata,
      }))
    },
    []
  )

  const clearPermissions = useCallback(() => {
    setCurrentMetadata(null)
    setUserRole(null)
    setResourceMetadataState({})
  }, [])

  const value: PermissionContextType = {
    currentMetadata,
    setMetadata: setCurrentMetadata,
    setMetadataFromResponse,
    getResourceMetadata,
    setResourceMetadata,
    userRole,
    setUserRole,
    clearPermissions,
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

/**
 * Hook to use permission context
 */
export function usePermissions() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider")
  }
  return context
}

/**
 * Hook to get permissions for a specific resource from context
 */
export function useResourcePermissions(resource: string) {
  const { getResourceMetadata } = usePermissions()
  const metadata = getResourceMetadata(resource)

  return {
    metadata,
    canEdit: metadata?.editingEnabled ?? false,
    editableFields: metadata?.editable ?? [],
    userRole: metadata?.userRole ?? "user",
    isAdmin: metadata?.userRole === "admin",
  }
}

/**
 * Hook to update permissions after API call
 */
export function useUpdatePermissions() {
  const { setMetadata, setResourceMetadata } = usePermissions()

  const updateFromResponse = useCallback(
    (resource: string, response: any) => {
      const metadata = extractMetadata(response)
      setMetadata(metadata)
      setResourceMetadata(resource, metadata)
    },
    [setMetadata, setResourceMetadata]
  )

  return { updateFromResponse }
}
