"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"
import { apiClient } from "@/lib/api-client"
import { supabase } from "@/lib/supabase-client"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/common/page-header"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { ErrorBanner } from "@/components/common/error-banner"
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  CreditCardIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ClockIcon
} from "@heroicons/react/24/outline"

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  department?: string
  designation?: string
  role: string
  is_active: boolean
  created_at: string
}

export default function ProfilePage() {
  const { user, session } = useSupabaseAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
    designation: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError("")
      
      // For now, use the user data from Supabase auth context
      // In a real app, you might fetch additional profile data from employees table
      const profileData: UserProfile = {
        id: user.id,
        email: user.email || "",
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || "",
        department: user.user_metadata?.department || "",
        designation: user.user_metadata?.designation || "",
        role: user.user_metadata?.role || "employee",
        is_active: true,
        created_at: user.created_at || new Date().toISOString()
      }
      
      setProfile(profileData)
      setEditForm({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone || "",
        department: profileData.department || "",
        designation: profileData.designation || ""
      })
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      setIsSaving(true)
      setError("")
      
      // Update user metadata in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          department: editForm.department,
          designation: editForm.designation
        }
      })
      
      if (updateError) {
        throw updateError
      }
      
      // Reload profile to reflect changes
      await loadProfile()
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="My Profile"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Profile" }
            ]}
          />
          <LoadingSkeleton lines={8} />
        </div>
        </main>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="My Profile"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Profile" }
            ]}
          />
          <ErrorBanner message="Profile not found" />
        </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="My Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" }
        ]}
        actions={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
          ) : null
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Header with gradient */}
            <div className="h-24 sm:h-32 bg-gradient-to-br from-primary to-accent"></div>
            
            {/* Profile Picture */}
            <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
              <div className="relative -mt-12 sm:-mt-16 mb-3 sm:mb-4">
                <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl font-bold text-foreground">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </span>
                  </div>
                </div>
                {profile.is_active && (
                  <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-5 sm:w-6 h-5 sm:h-6 bg-green-500 rounded-full border-4 border-card"></div>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-sm text-muted-foreground">{profile.designation || "No designation"}</p>
              </div>

              {/* Role Badge */}
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
                <ShieldCheckIcon className="w-4 h-4" />
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </div>

              {/* Stats */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ClockIcon className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs">Member Since</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-xs">Status</p>
                    <p className="text-sm font-medium text-foreground">{profile.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Personal Information */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-primary flex-shrink-0" />
                Personal Information
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    disabled={isSaving}
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={isSaving}
                  >
                    <CheckIcon className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-foreground font-medium text-sm">{profile.first_name || "-"}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-foreground font-medium text-sm">{profile.last_name || "-"}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                  Email Address
                </label>
                <p className="text-foreground font-medium text-sm">{profile.email}</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-foreground font-medium text-sm">{profile.phone || "-"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-4 sm:mb-6">
              <BuildingOfficeIcon className="w-5 h-5 text-primary flex-shrink-0" />
              Work Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter department"
                  />
                ) : (
                  <p className="text-foreground font-medium text-sm">{profile.department || "-"}</p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter designation"
                  />
                ) : (
                  <p className="text-foreground font-medium text-sm">{profile.designation || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
    </>
  )
}
