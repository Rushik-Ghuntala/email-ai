'use client'

import { FormikProvider, useFormik } from 'formik'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import EmailGeneratorForm from './EmailGeneratorForm'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { emailFormValidationSchema } from '@/utils/validations'
import dynamic from 'next/dynamic'
import Typography from '@/components/Typography'

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

  // Convert \n to <br /> for Quill editor
  const convertNewLinesToHtml = (text: string) => text.replace(/\n/g, '<br />')

  const formik = useFormik<EmailGeneratorFormValues>({
    initialValues: {
      fromName: '',
      toName: '',
      emailPrompt: '',
      tone: [],
    },
    validationSchema: toFormikValidationSchema(emailFormValidationSchema),
    onSubmit: async (values) => {
      await submitForm(values)
    },
    enableReinitialize: true,
    validateOnMount: true,
  })

  const submitForm = async (values: EmailGeneratorFormValues) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (data.email) {
        setSubject(data.email.subject || '')
        // Convert line breaks before setting the email content
        setEmail(convertNewLinesToHtml(data.email.body || ''))
      }
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setIsSubmitted(false)
    }
  }

  const handleSubjectChange = (content: string) => {
    setSubject(content)
  }

  const handleEmailChange = (content: string) => {
    setEmail(content)
  }

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
        {/* Subject Editor */}
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
            onChange={handleSubjectChange}
            toolbarId='toolbar-subject'
            isSubmitted={isSubmitted}
          />
        </div>

        {/* Email Body Editor */}
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
            onChange={handleEmailChange}
            toolbarId='toolbar-body'
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
    </div>
  )
}

export default EmailGeneratePage
