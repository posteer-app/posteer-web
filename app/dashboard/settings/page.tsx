import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Trash2,
} from 'lucide-react'
import { Icons } from '@/components/ui/icons'
import { getCurrentProfileServer } from '@/utils/profile-server'
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import DeleteProfileForm from '@/components/dashboard/settings/deleteProfileForm'
import YouTubeConnectModal from '@/components/dashboard/settings/youtubeConnectModal'

export default async function SettingsPage() {
  const currentProfile = await getCurrentProfileServer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/60">
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <h2 className="text-muted-foreground">for profile: {currentProfile?.name || 'No profile selected'}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Social Media Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Platform Connectors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'YouTube (google)', icon: Icons.google, connected: false, handle: '' },
                ].map((social) => (
                  <div key={social.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <social.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{social.name}</p>
                        {social.connected && (
                          <p className="text-sm text-muted-foreground">{social.handle}</p>
                        )}
                      </div>
                    </div>
                    <YouTubeConnectModal connected={social.connected} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            
            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"> 
                  <DeleteProfileForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}