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
  
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', localProfile.uuid)
    .single()
  
  if (error || !data) {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
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
    notifyProfileChange(profile)
  } catch (error) {
    console.error('Error saving current profile to localStorage:', error)
  }
}

export function hasProfile(): boolean {
  return getCurrentProfile() !== null
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