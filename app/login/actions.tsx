'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: 'http://localhost:3000/auth/confirm',
    },
  })

  if (error) {
    redirect('/error')
  }

  redirect('/auth/magic-link-sent')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}