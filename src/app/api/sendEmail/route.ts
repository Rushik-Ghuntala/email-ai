// src/app/api/sendEmail/route.ts
import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Configure OAuth2 credentials
const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/', // Update with your redirect URI
})

// Set up Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

// Function to encode the email message
function createMessage(
  senderEmail: string,
  receiverEmail: string,
  subject: string,
  content: string
) {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const messageParts = [
    `From: ${senderEmail}`,
    `To: ${receiverEmail}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    content,
  ]
  const message = messageParts.join('\n')
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function POST(request: Request) {
  try {
    const { senderEmail, receiverEmail, subject, content } =
      await request.json()

    // Validate required fields
    if (!senderEmail || !receiverEmail || !subject || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Set credentials using refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    // Create the email message
    const raw = createMessage(senderEmail, receiverEmail, subject, content)

    // Send the email using Gmail API
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw,
      },
    })

    if (response.status === 200) {
      return NextResponse.json(
        { message: 'Email sent successfully!' },
        { status: 200 }
      )
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json(
      { message: 'Failed to send email', error: errorMessage },
      { status: 500 }
    )
  }
}
