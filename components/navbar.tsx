import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'
import { Button } from './ui/button'
import { DarkModeToggle } from './dark-mode-toggle'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-md font-semibold">
          Home
        </Link>
        <Link href="/dashboard" className="text-md font-semibold">
          Dashboard
        </Link>
      </div>
      <div className="flex items-center space-x-4 flex-row">
        <DarkModeToggle />
        {user ? (
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        ) : (
          <Button>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}