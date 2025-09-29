import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'
import { Button } from './ui/button'
import { DarkModeToggle } from './dark-mode-toggle'
import { Icons } from './ui/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Blur background layer with fade-out */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-lg"
        style={{
          mask: 'linear-gradient(to bottom, black 0%, black 0%, transparent 100%)',
          WebkitMask: 'linear-gradient(to bottom, black 0%, black 0%, transparent 100%)'
        }}
      />
      {/* Navbar content - always fully opaque */}
      <nav className="relative flex items-center justify-between px-3 py-3 bg-card border border-border rounded-xl">
        <div className="flex items-center space-x-3">
          <Button asChild variant="ghost" className="">
            <Link href="/" className="flex items-center space-x-1 text-md font-semibold text-foreground">
              <Icons.posteer className="scale-[200%] mt-[0.2rem]" />
              <span className='mb-[0.1rem]'>posteer</span>
            </Link>
          </Button>
          {user && (
            <div className="flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <DarkModeToggle />
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Icons.user className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className='p-2 text-sm'>
                    <div className='text-xs text-muted-foreground'>you're logged into:</div>
                    {user.email}
                  </div>
                  <DropdownMenuItem onClick={signOut} variant='destructive'>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}
