'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from '@/components/ui/icons'
import { getCurrentProfile } from '@/utils/profile'
import { useState } from 'react'

interface YouTubeConnectModalProps {
  connected: boolean
}

export default function YouTubeConnectModal({ connected }: YouTubeConnectModalProps) {
  const profile = getCurrentProfile()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    setIsLoading(true)
    window.location.href = '/api/oauth/initiate/yt'
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={connected ? "outline" : "default"} size="sm">
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.google className="h-5 w-5" />
            YouTube (google) connection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border border-destructive/20 dark:border-destructive/40 rounded-lg bg-destructive/10 dark:bg-destructive/10">
            <div className="flex gap-3">
              <Icons.alertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-2 text-destructive">
                  Important: Connect the correct Google account.
                </h4>
                <p className="text-sm text-destructive/80">
                  You must connect the Google account that owns the YouTube channel you want to manage.
                  If you have multiple Google accounts, make sure you're signed into the correct one before proceeding.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
            <h4 className="font-medium mb-2">Permissions required:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• create, update, and delete videos and comments</li>
              <li>• access to your analytics information</li>
            </ul>
            <hr />
            <p className="flex items-center gap-2  text-xs text-muted-foreground">
              <Icons.check className="h-3 w-3 text-green-600" />
              Your data is secure. You can revoke access at any time from your Google Account settings.
            </p>
          </div>

          

          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Connect with Google to '{profile?.name}'
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}