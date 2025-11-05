import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/utils/supabase/server'
import { getCurrentProfileServer } from '@/utils/profile-server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')


  if (error) {
    const errorDescription = searchParams.get('error_description')
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', error)
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 'No authorization code received from Google')
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_API_CLIENT_ID,
      process.env.GOOGLE_API_CLIENT_SECRET,
      process.env.GOOGLE_API_REDIRECT_URI
    )


    const { tokens } = await oauth2Client.getToken(code)

    if(!(
      tokens.scope?.includes("youtube.readonly") &&
      tokens.scope?.includes("youtube.upload") &&
      tokens.scope?.includes("youtube.force-ssl")
    )) {
      const redirectUrl = new URL('/auth/oauth-error', request.url)
      redirectUrl.searchParams.set('error', 'invalid_scope')
      return NextResponse.redirect(redirectUrl)
    }
    

    // Set credentials on the OAuth2 client
    oauth2Client.setCredentials(tokens)

    // Test the credentials by making a simple API call
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client })
    
    try {
      const channelResponse = await youtube.channels.list({
        part: ['snippet'],
        mine: true
      })
      
    } catch (apiError) {
      console.error('YouTube API test failed:', apiError)
      const redirectUrl = new URL('/auth/oauth-error', request.url)
      redirectUrl.searchParams.set('error', 'api_test_failed')
      redirectUrl.searchParams.set('error_description', 'Failed to verify YouTube API access')
      return NextResponse.redirect(redirectUrl)
    }

    // Get the current profile from the cookie
    const currentProfile = await getCurrentProfileServer()
    
    if (!currentProfile) {
      const redirectUrl = new URL('/auth/oauth-error', request.url)
      redirectUrl.searchParams.set('error', 'no_profile')
      redirectUrl.searchParams.set('error_description', 'No profile selected. Please select a profile before connecting YouTube.')
      return NextResponse.redirect(redirectUrl)
    }

    const { data, error } = await supabase
      .from('youtube_secrets')
      .upsert({
        id: currentProfile.uuid,
        token_json: JSON.stringify(tokens)
      });

    if (error) {
      console.error('Error inserting data:', error);

      const redirectUrl = new URL('/auth/oauth-error', request.url)
      redirectUrl.searchParams.set('error', 'unknown')
      redirectUrl.searchParams.set('error_description', error.message)
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('Data inserted successfully:', data);
    }

    // Redirect to settings page with toast message
    const redirectUrl = new URL('/dashboard/settings', request.url)
    redirectUrl.searchParams.set('toast', 'YouTube account connected successfully!')
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('OAuth callback error:', error)
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 'Failed to exchange authorization code for tokens. This may be due to insufficient permissions or an expired authorization code.')
    return NextResponse.redirect(redirectUrl)
  }
}