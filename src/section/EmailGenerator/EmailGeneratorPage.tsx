'use client'

import { FormikProvider, useFormik } from 'formik'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import EmailGeneratorForm from './EmailGeneratorForm'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { emailFormValidationSchema } from '@/utils/validations'
import dynamic from 'next/dynamic'
import Typography from '@/components/Typography'
import EmailForm from '@/form/EmailForm'
import CustomButton from '@/components/ui/customButton'

// Dynamic import for TextEditor
const TextEditor = dynamic(() => import('../TextEditor/TextEditor'), {
  ssr: false,
})

export interface EmailGeneratorFormValues {
  fromName: string
  toName: string
  emailPrompt: string
  tone: string[]
}

const EmailGeneratePage = () => {
  const route = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [emailForm, setEmailForm] = useState<{
    onSave: () => void
    onCancel: () => void
  } | null>(null)

  // Handles opening the email form
  const handleInformationProfileButtonClick = () => {
    setEmailForm({
      onSave: () => setEmailForm(null),
      onCancel: () => setEmailForm(null),
    })
  }

  // Utility function to convert \n to <br /> for Quill editor
  const convertNewLinesToHtml = (text: string) => text.replace(/\n/g, '<br />')

  // Formik setup
  const formik = useFormik<EmailGeneratorFormValues>({
    initialValues: {
      fromName: '',
      toName: '',
      emailPrompt: '',
      tone: [],
    },
    validationSchema: toFormikValidationSchema(emailFormValidationSchema),
    onSubmit: async (values) => {
      setIsSubmitted(true)
      try {
        const requestBody = {
          userName: values.fromName,
          toName: values.toName,
          emailPrompt: values.emailPrompt,
          tone: values.tone,
        }

        const response = await fetch('/api/emailGenerating', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        const data = await response.json()

        if (data.email) {
          setSubject(data.email.subject || '')
          setEmail(convertNewLinesToHtml(data.email.body || ''))
        }
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        setIsSubmitted(false)
      }
    },
    enableReinitialize: true,
    validateOnMount: true,
  })

  const { handleSubmit, isSubmitting, isValid } = formik

  return (
    <div className='flex items-start'>
      <div className='h-screen w-1/2'>
        <FormikProvider value={formik}>
          <EmailGeneratorForm
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={isValid}
          />
        </FormikProvider>
      </div>

      <div className='mx-auto h-screen w-1/2 space-y-4 p-10'>
        <div className='mb-8'>
          <Typography
            size='xl'
            weight='semibold'
            className='mb-3'
          >
            Subject:
          </Typography>
          <TextEditor
            value={subject}
            onChange={setSubject}
            toolbarId='toolbar-subject'
            isSubmitted={isSubmitted}
          />
        </div>

        <div>
          <Typography
            size='xl'
            weight='semibold'
            className='mb-3'
          >
            Email Body:
          </Typography>
          <TextEditor
            value={email}
            onChange={setEmail}
            toolbarId='toolbar-body'
            isSubmitted={isSubmitted}
          />
        </div>

        <CustomButton onClick={handleInformationProfileButtonClick}>
          Send Email
        </CustomButton>
      </div>

      {emailForm && (
        <EmailForm
          onSave={emailForm.onSave}
          onCancel={emailForm.onCancel}
          subject={subject}
          content={email}
        />
      )}
    </div>
  )
}

export default EmailGeneratePage
