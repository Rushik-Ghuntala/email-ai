// emailValidationSchema.ts
import { z } from 'zod'

export const emailFormValidationSchema = z.object({
  fromName: z.string({ required_error: 'From Name is required' }),
  toName: z.string({ required_error: 'To Name is required' }),
  emailPrompt: z.string({ required_error: 'Email Prompt is required' }),
  tone: z
    .array(z.string(), { required_error: 'Tone is required' })
    .min(1, 'At least one tone is required'),
})
