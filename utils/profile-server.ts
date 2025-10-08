import { createClient } from './supabase/server'
import { cookies } from 'next/headers'

export interface Profile {
  uuid: string
  name: string
}

export async function getCurrentProfileServer(): Promise<Profile | null> {
  const cookieStore = await cookies()
  const profileCookie = cookieStore.get('current_profile')
  
  if (!profileCookie?.value) {
    return null
  }
  
  try {
    const profile = JSON.parse(profileCookie.value)
    
    if (!profile || typeof profile.uuid !== 'string' || typeof profile.name !== 'string') {
      return null
    }
    
    return {
      uuid: profile.id,
      name: profile.name
    }
  } catch (error) {
    console.error('Error reading profile from cookie:', error)
    return null
  }
}