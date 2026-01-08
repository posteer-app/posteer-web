import { createClient } from './supabase/client'

export interface Profile {
  uuid: string
  name: string
}

const PROFILE_STORAGE_KEY = 'current_profile'
type ProfileChangeListener = (profile: Profile | null) => void
const profileChangeListeners: ProfileChangeListener[] = []

let hasValidatedOnLoad = false

async function validateProfileOnLoad() {
  if (hasValidatedOnLoad || typeof window === 'undefined') return
  hasValidatedOnLoad = true
  
  const localProfile = getCurrentProfile()
  if (!localProfile) return
  
  try {
    document.cookie = `current_profile=${JSON.stringify(localProfile)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
  } catch (error) {
    console.error('Error syncing profile to cookie:', error)
  }
  
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', localProfile.uuid)
    .single()
  
  if (error || !data) {
    localStorage.removeItem(PROFILE_STORAGE_KEY)

    if (typeof document !== 'undefined') {
      document.cookie = 'current_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    notifyProfileChange(null)
  }
}

if (typeof window !== 'undefined') {
  validateProfileOnLoad()
}


export function onProfileChange(listener: ProfileChangeListener): () => void {
  profileChangeListeners.push(listener)
  
  return () => {
    const index = profileChangeListeners.indexOf(listener)
    if (index > -1) {
      profileChangeListeners.splice(index, 1)
    }
  }
}

function notifyProfileChange(profile: Profile | null) {
  profileChangeListeners.forEach(listener => listener(profile))
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name')
    .order('name')
  
  if (error) {
    console.error('Error fetching profiles:', error)
    return []
  }
  
  return data.map(profile => ({
    uuid: profile.id,
    name: profile.name
  }))
}

export function getCurrentProfile(): Profile | null {
  if (typeof window === 'undefined') {
    return null // SSR safety
  }
  
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return null
    
    const profile = JSON.parse(stored)
    
    if (profile && typeof profile.uuid === 'string' && typeof profile.name === 'string') {
      return profile
    }
    
    return null
  } catch (error) {
    console.error('Error reading current profile from localStorage:', error)
    return null
  }
}

export function setCurrentProfile(profile: Profile): void {
  if (typeof window === 'undefined') {
    return // SSR safety
  }
  
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    document.cookie = `current_profile=${JSON.stringify(profile)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    
    notifyProfileChange(profile)
  } catch (error) {
    console.error('Error saving current profile:', error)
  }
}

export function hasProfile(): boolean {
  return getCurrentProfile() !== null
}

export function clearCurrentProfile(): void {
  if (typeof window === 'undefined') {
    return // SSR safety
  }
  
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
    
    document.cookie = 'current_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    notifyProfileChange(null)
  } catch (error) {
    console.error('Error clearing current profile:', error)
  }
}

import { useEffect, useState } from 'react'

export function useCurrentProfile(): Profile | null {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  
  useEffect(() => {
    setCurrentProfile(getCurrentProfile())
    
    const unsubscribe = onProfileChange((profile) => {
      setCurrentProfile(profile)
    })
    
    return unsubscribe
  }, [])
  
  return currentProfile
}