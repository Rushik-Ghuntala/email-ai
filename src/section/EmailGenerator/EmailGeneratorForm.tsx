'use client'

import Typography from '@/components/Typography'
import { InputField } from '@/components/ui/inputField'
import { TextArea } from '@/components/ui/textArea'
import { CustomChips } from '@/components/ui/customChips'
import { useFormikContext } from 'formik'
import React from 'react'
import CustomButton from '@/components/ui/customButton'
import { imageConfig } from '@/constant/imageConfig'
import { EmailGeneratorFormValues } from './EmailGeneratorPage'

interface EmailGeneratorFormProps {
  handleSubmit: () => void
  isSubmitting: boolean
  isValid: boolean
}

const EmailGeneratorForm: React.FC<EmailGeneratorFormProps> = ({
  handleSubmit,
  isSubmitting,
  isValid,
}) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<EmailGeneratorFormValues>()

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

  const handleToneChange = (selectedTone: string) => {
    const currentTones = values.tone
    const newTones = currentTones.includes(selectedTone)
      ? currentTones.filter((tone) => tone !== selectedTone)
      : [...currentTones, selectedTone]

    handleChange('tone', newTones)
  }

  return (
    <div className='mx-auto space-y-6 p-10'>
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
          {errors.fromName && touched.fromName && (
            <div className='text-red-500'>{errors.fromName}</div>
          )}
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
          {errors.toName && touched.toName && (
            <div className='text-red-500'>{errors.toName}</div>
          )}
        </div>

        {/* Email Prompt Field */}
        <div className='space-y-2'>
          <Typography className='font-medium'>Email Content Prompt</Typography>
          <TextArea
            id='emailPrompt'
            placeholder='Describe what you want to say in the email...'
            value={values.emailPrompt}
            onChange={(e) => handleChange('emailPrompt', e.target.value)}
            variant='primaryBordered'
            className='w-full'
          />
          {errors.emailPrompt && touched.emailPrompt && (
            <div className='text-red-500'>{errors.emailPrompt}</div>
          )}
        </div>

        {/* Tone Selection with CustomChips */}
        <div>
          <Typography className='font-medium'>Email Tone</Typography>
          <CustomChips
            id='tone'
            data={toneOptions.map((option) => option.label)}
            name='tone'
            onSelect={(name, item) =>
              handleToneChange(
                toneOptions.find((tone) => tone.label === item)?.value || ''
              )
            }
            selected={values.tone}
          />
          {errors.tone && touched.tone && (
            <div className='text-red-500'>{errors.tone}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex items-center justify-center py-8'>
          <CustomButton
            type='button'
            onClick={() => {
              if (isValid) {
                handleSubmit()
              }
            }}
            color='primary'
            iconSrc={`${imageConfig.STARS}`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Email'}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default EmailGeneratorForm
