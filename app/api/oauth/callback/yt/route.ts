import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  console.log('=== YouTube OAuth Callback ===')
  console.log('Code:', code)
  console.log('Error:', error)

  if (error) {
    console.error('OAuth Error:', error)
    const errorDescription = searchParams.get('error_description')
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', error)
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    console.error('No authorization code received')
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 'No authorization code received from Google')
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_API_CLIENT_ID,
      process.env.GOOGLE_API_CLIENT_SECRET,
      process.env.GOOGLE_API_REDIRECT_URI
    )

    console.log('OAuth2 Client Config:')
    console.log('- Client ID:', process.env.GOOGLE_API_CLIENT_ID)
    console.log('- Redirect URI:', process.env.GOOGLE_API_REDIRECT_URI)

    // Exchange authorization code for tokens
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
    
    console.log('=== OAuth Tokens Received ===')
    console.log('Access Token:', tokens.access_token)
    console.log('Refresh Token:', tokens.refresh_token)
    console.log('Token Type:', tokens.token_type)
    console.log('Expires In:', tokens.expiry_date)
    console.log('Scope:', tokens.scope)
    console.log('Full Tokens Object:', JSON.stringify(tokens, null, 2))

    // Set credentials on the OAuth2 client
    oauth2Client.setCredentials(tokens)

    // Test the credentials by making a simple API call
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client })
    
    try {
      const channelResponse = await youtube.channels.list({
        part: ['snippet'],
        mine: true
      })
      
      console.log('=== YouTube API Test Call ===')
      console.log('Channel Data:', JSON.stringify(channelResponse.data, null, 2))
    } catch (apiError) {
      console.error('YouTube API Test Error:', apiError)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'OAuth credentials received and logged to console',
      tokens: {
        access_token: tokens.access_token ? '***RECEIVED***' : null,
        refresh_token: tokens.refresh_token ? '***RECEIVED***' : null,
        expires_in: tokens.expiry_date
      }
    })

  } catch (error) {
    console.error('=== OAuth Token Exchange Error ===')
    console.error('Error:', error)
    
    const redirectUrl = new URL('/auth/oauth-error', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 'Failed to exchange authorization code for tokens. This may be due to insufficient permissions or an expired authorization code.')
    return NextResponse.redirect(redirectUrl)
  }
}