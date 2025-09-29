'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function magicLinkLogin(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    origin: formData.get('origin') as string,
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${data.origin}/auth/google-callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  redirect('/auth/magic-link-sent')
}

export async function googleLogin(origin: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/google-callback`,
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