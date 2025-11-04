import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_API_CLIENT_ID,
      process.env.GOOGLE_API_CLIENT_SECRET,
      process.env.GOOGLE_API_REDIRECT_URI
    )

    console.log('=== Initiating YouTube OAuth Flow ===')
    console.log('Client ID:', process.env.GOOGLE_API_CLIENT_ID)
    console.log('Redirect URI:', process.env.GOOGLE_API_REDIRECT_URI)

    // Define the scopes for YouTube API access
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]

    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request refresh token
      scope: scopes,
      prompt: 'consent' // Force consent screen to get refresh token
    })

    console.log('Generated Auth URL:', authUrl)
    console.log('Scopes requested:', scopes)

    // Redirect to Google's OAuth consent screen
    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('=== OAuth Initiation Error ===')
    console.error('Error:', error)
    
    return NextResponse.json({
      error: 'Failed to initiate OAuth flow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}