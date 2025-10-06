'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
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
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Combobox } from './navbar/combobox'
import { toast } from "sonner"

interface Profile {
  uuid: string
  name: string
}

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [profileOptions, setProfileOptions] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        await fetchUserProfiles()
      }
    }
    
    const fetchUserProfiles = async () => {
      try {
        // bc of rls, selecting all will only return those that are owned by user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')

        if (error) {
          throw error
        }

        setProfileOptions(data.map((profile) => ({
          uuid: profile.id,
          name: profile.name,
        })))
      } catch (err: any) {
        toast('Error fetching profiles:', err.message)
      }
    };
    
    
    getUser()
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
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
          {(user && !pathname?.includes("dashboard")) ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Combobox profiles={profileOptions} />
          )}
        </div>
        <div className="flex items-center space-x-3">
          <DarkModeToggle />
          {loading ? (
            <div className="w-10 h-10 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
              <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/settings">
                  <Icons.settings className="h-4 w-4" />
                </Link>
              </Button>
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
