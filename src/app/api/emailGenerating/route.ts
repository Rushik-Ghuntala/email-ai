import { NextResponse } from 'next/server'
import Together from 'together-ai'

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY })

// Define email size configurations
const EMAIL_SIZES = {
  short: { minSentences: 3, maxSentences: 5 },
  medium: { minSentences: 5, maxSentences: 8 },
  large: { minSentences: 8, maxSentences: 10 },
}

type EmailSize = 'short' | 'medium' | 'large'

export async function POST(request: Request) {
  try {
    const { userName, toName, emailPrompt, tone, size } = await request.json()

    // Validate input
    if (!userName || !toName || !emailPrompt || !tone || !size) {
      return NextResponse.json(
        { error: 'All fields including size are required.' },
        { status: 400 }
      )
    }

    // Validate size value
    if (!['short', 'medium', 'large'].includes(size)) {
      return NextResponse.json(
        { error: 'Size must be either "short", "medium", or "large".' },
        { status: 400 }
      )
    }

    // Get sentence range for specified size
    const { minSentences, maxSentences } = EMAIL_SIZES[size as EmailSize]

    // Construct a detailed prompt for better email generation
    const structuredPrompt = `
Generate a professional business email with the following requirements:

CONTEXT:
- From: ${userName}
- To: ${toName}
- Purpose: ${emailPrompt}
- Tone: ${tone}
- Length: ${size} (${minSentences}-${maxSentences} sentences)

REQUIREMENTS:
1. Start with a compelling subject line that is professional and attention-grabbing
2. Include ${minSentences}-${maxSentences} well-structured sentences
3. Follow proper business email format with greeting and signature
4. Maintain the specified ${tone} tone throughout
5. Include clear call-to-action if applicable
6. End with a professional closing
7. Keep the email length appropriate for a ${size} email

FORMAT YOUR RESPONSE AS:
Subject: [Your subject line here]

[Email body with proper spacing and formatting]

Please ensure the email is:
- Clear and concise
- Grammatically correct
- Professional yet engaging
- Easy to read with proper paragraphing
- Contains ${minSentences}-${maxSentences} sentences
- Maintains consistent tone
- Appropriate length for a ${size} email

Generate the email now:`

    // Call the Together AI API with the enhanced prompt
    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a professional email writing assistant. You excel at crafting clear, effective, and well-structured business emails that achieve their intended purpose while maintaining appropriate tone and professionalism. You can adapt your writing to different length requirements while maintaining quality and impact.',
        },
        {
          role: 'user',
          content: structuredPrompt,
        },
      ],
      model: 'meta-llama/Llama-Vision-Free',
      temperature: 0.7, // Add some creativity while keeping it professional
      max_tokens: 1000, // Ensure enough length for a proper email
      top_p: 0.9,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.3, // Encourage diverse language
    })

    // Extract and validate the generated content
    const emailContent = response?.choices?.[0]?.message?.content

    if (!emailContent) {
      throw new Error('Failed to generate email content')
    }

    // Parse the email to separate subject and body
    const emailParts = parseEmailContent(emailContent)

    return NextResponse.json({
      success: true,
      email: emailParts,
      size: size, // Include size in response for reference
    })
  } catch (error: any) {
    console.error(
      'Error generating email:',
      error?.response?.data || error?.message || error
    )
    return NextResponse.json(
      { error: 'Failed to generate email.' },
      { status: 500 }
    )
  }
}

// Helper function to parse email content and separate subject from body
function parseEmailContent(content: string) {
  const lines = content.split('\n')
  let subject = ''
  let body = ''
  let foundSubject = false

  for (const line of lines) {
    if (line.toLowerCase().startsWith('subject:')) {
      subject = line.substring(8).trim()
      foundSubject = true
      continue
    }

    if (foundSubject) {
      body += line + '\n'
    }
  }

  return {
    subject: subject || 'No subject found',
    body: body.trim() || 'No body content found',
  }
}
