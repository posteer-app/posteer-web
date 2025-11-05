import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_API_CLIENT_ID,
      process.env.GOOGLE_API_CLIENT_SECRET,
      process.env.GOOGLE_API_REDIRECT_URI
    )

    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request refresh token
      scope: scopes,
      prompt: 'consent' // Force consent screen to get refresh token
    })
    
    return NextResponse.redirect(authUrl)

  } catch (error) {
    
    return NextResponse.json({
      error: 'Failed to initiate OAuth flow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}