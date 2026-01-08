'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocalhost ? 'http' : (headersList.get('x-forwarded-proto') || 'https')
  return `${protocol}://${host}`
}

export async function magicLinkLogin(formData: FormData) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const data = {
    email: formData.get('email') as string,
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/google-callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  redirect('/auth/magic-link-sent')
}

export async function googleLogin() {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/google-callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  // If data.url exists, it means Supabase is redirecting to the OAuth provider
  // Otherwise, if data.session exists, the user is already logged in or the OAuth flow completed directly
  if (data.url) {
    redirect(data.url)
  }
}

export async function facebookLogin() {
  // TODO: Implement Facebook login
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}