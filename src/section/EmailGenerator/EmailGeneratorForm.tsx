'use client'

import Typography from '@/components/Typography'
import { InputField } from '@/components/ui/inputField'
import { useFormikContext } from 'formik'
import React from 'react'

interface EmailGeneratorFormProps {
  handleSubmit: () => void
  isSubmitting: boolean
  isValid: boolean
}

const EmailGeneratorForm = ({
  handleSubmit,
  isSubmitting,
  isValid,
}: EmailGeneratorFormProps) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<{
    fromName: string
    toName: string
    emailPrompt: string
    tone: string[]
  }>()

  const toneOptions = [
    { label: 'Professional', value: 'professional' },
    { label: 'Friendly', value: 'friendly' },
    { label: 'Formal', value: 'formal' },
    { label: 'Casual', value: 'casual' },
    { label: 'Urgent', value: 'urgent' },
  ]

  const handleChange = (field: string, value: any) => {
    setFieldValue(field, value)
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6 p-6'>
      <div className='space-y-4'>
        {/* From Name Field */}
        <div className='space-y-2'>
          <Typography className='font-medium'>From Name</Typography>
          <InputField
            id='fromName'
            name='fromName'
            placeholder="Enter sender's name"
            value={values.fromName}
            onChange={(e) => handleChange('fromName', e.target.value)}
            className='w-full'
          />
        </div>

        {/* To Name Field */}
        <div className='space-y-2'>
          <Typography className='font-medium'>To Name</Typography>
          <InputField
            id='toName'
            name='toName'
            placeholder="Enter recipient's name"
            value={values.toName}
            onChange={(e) => handleChange('toName', e.target.value)}
            className='w-full'
          />
        </div>

        {/* Email Prompt Field */}
        <div className='space-y-2'>
          <Typography className='font-medium'>Email Content Prompt</Typography>
          <textarea
            id='emailPrompt'
            placeholder='Describe what you want to say in the email...'
            value={values.emailPrompt}
            onChange={(e) => handleChange('emailPrompt', e.target.value)}
            className='min-h-[120px] w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Tone Selection */}
        <div className='space-y-2'>
          <Typography className='font-medium'>Email Tone</Typography>
          <select
            id='tone'
            multiple
            value={values.tone}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              )
              handleChange('tone', selectedOptions)
            }}
            className='w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {toneOptions.map((tone) => (
              <option
                key={tone.value}
                value={tone.value}
              >
                {tone.label}
              </option>
            ))}
          </select>
          <div className='text-sm text-gray-500'>
            Hold Ctrl (Windows) or Command (Mac) to select multiple tones
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className='mt-6 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400'
        >
          {isSubmitting ? 'Generating...' : 'Generate Email'}
        </button>
      </div>
    </div>
  )
}

export default EmailGeneratorForm
