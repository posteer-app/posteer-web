'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkYouTubeConnection(profileId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('youtube_secrets')
    .select('id')
    .eq('id', profileId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return true
}

export async function disconnectYouTube(profileId: string): Promise<{ success: boolean, error?: string }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('youtube_secrets')
    .delete()
    .eq('id', profileId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  revalidatePath('/dashboard/settings')
  return { success: true }
}