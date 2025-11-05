'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function OAuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  const getErrorInfo = () => {
    switch (error) {
      case 'access_denied':
        return {
          title: 'Authorization Declined',
          description: 'The necessary permissions required were declined'
        }
      case 'invalid_scope':
        return {
          title: 'Insufficient Permissions',
          description: 'All of the required permissions must be selected to continue'
        }
      case 'server_error':
        return {
          title: 'Server Error',
          description: 'There was a problem processing your authorization.'
        }
      default:
        return {
          title: 'Connection Failed',
          description: errorDescription || 'Unable to connect your YouTube account.'
        }
    }
  }

  const errorInfo = getErrorInfo()

  const handleRetry = () => {
    // Redirect back to settings page where they can try connecting again
    router.push('/dashboard/settings')
  }

  const handleTryAgain = () => {
    // Directly initiate the OAuth flow again
    window.location.href = '/api/oauth/initiate/yt'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">{errorInfo.title}</CardTitle>
          <CardDescription>
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="flex flex-col gap-2">
            <Button onClick={handleTryAgain} className="w-full">
              <Icons.google className="mr-2 h-4 w-4" />
              Try Connecting Again
            </Button>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              <Icons.settings className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You can revoke access at any time from your{' '}
              <a 
                href="https://myaccount.google.com/permissions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Account settings
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OAuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    }>
      <OAuthErrorContent />
    </Suspense>
  )
}