import Typography from '@/components/Typography'
import CancelButton from '@/components/ui/cancelButton'
import CustomButton from '@/components/ui/customButton'
import FullButton from '@/components/ui/fullButton'
import { InputField } from '@/components/ui/inputField'
import { useFormik } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import he from 'he'

export interface EmailFormProps {
  onSave: () => void
  onCancel: () => void
  subject: string
  content: string
}

// Helper function to strip HTML tags from the subject
function stripHtmlTags(input: string): string {
  return he.decode(input.replace(/<\/?[^>]+(>|$)/g, ''))
}

const EmailForm: React.FC<EmailFormProps> = ({
  onSave,
  onCancel,
  subject,
  content,
}) => {
  const {
    values,
    touched,
    errors,
    isValid,
    setFieldValue,
    setFieldTouched,
    setErrors,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      senderEmail: '',
      receiverEmail: '',
      subject: subject || '',
      content: content || '',
    },
    validationSchema: null, // You can add a validation schema if needed
    onSubmit: async (values) => {
      try {
        console.log('aavooooo')
        console.log('values', values)
        // Sanitize the subject to remove HTML tags
        const sanitizedSubject = stripHtmlTags(values.subject)
        console.log('sanitizedSubject', sanitizedSubject)
        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            subject: sanitizedSubject, // Use sanitized subject
          }),
        })

        console.log('res', response)

        const data = await response.json()

        console.log('data', data)
        if (response.ok) {
          toast.success('Email sent successfully!')
          onSave()
        } else {
          setErrors({ content: data.message })
          toast.error(data.message || 'Failed to send email')
        }
      } catch (error) {
        console.error('Error sending email:', error)
        toast.error('An error occurred while sending the email')
      }
    },
    validateOnMount: true,
  })

  const handleChange = (key: string, value: string) => {
    setFieldValue(key, value)
  }

  const handleOnBlur = (key: string) => {
    setFieldTouched(key, true)
  }

  return (
    <div className='fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-brightness-50'>
      <div className='border-richblack-400 w-11/12 max-w-[320px] overflow-hidden rounded-2xl border bg-white px-8 py-8 max-[350px]:max-w-[330px] sm:max-w-[550px] sm:px-10 sm:py-12'>
        <form
          id='send-email-form'
          name='send-email-form'
          className='flex flex-col gap-y-8'
          onSubmit={handleSubmit}
          method='POST'
        >
          <div className='space-y-2'>
            <Typography className='font-medium'>Sender Email</Typography>
            <InputField
              id='senderEmail'
              name='senderEmail'
              type='email'
              placeholder='Enter sender email'
              value={values.senderEmail.trimStart()}
              onChange={(e) => handleChange('senderEmail', e.target.value)}
              onBlur={() => handleOnBlur('senderEmail')}
              className='w-full'
            />
            {errors.senderEmail && touched.senderEmail && (
              <div className='text-red-500'>{errors.senderEmail}</div>
            )}
          </div>

          <div className='space-y-2'>
            <Typography className='font-medium'>Receiver Email</Typography>
            <InputField
              id='receiverEmail'
              name='receiverEmail'
              type='email'
              placeholder='Enter receiver email'
              value={values.receiverEmail}
              onChange={(e) => handleChange('receiverEmail', e.target.value)}
              onBlur={() => handleOnBlur('receiverEmail')}
              className='w-full'
            />
            {errors.receiverEmail && touched.receiverEmail && (
              <div className='text-red-500'>{errors.receiverEmail}</div>
            )}
          </div>

          {/* <div className='space-y-2'>
            <Typography className='font-medium'>Subject</Typography>
            <InputField
              id='subject'
              name='subject'
              type='text'
              placeholder='Enter subject'
              value={values.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleOnBlur('subject')}
              className='w-full'
            />
            {errors.subject && touched.subject && (
              <div className='text-red-500'>{errors.subject}</div>
            )}
          </div>

          <div className='space-y-2'>
            <Typography className='font-medium'>Content</Typography>
            <InputField
              id='content'
              name='content'
              type='textarea'
              placeholder='Enter content'
              value={values.content}
              onChange={(e) => handleChange('content', e.target.value)}
              onBlur={() => handleOnBlur('content')}
              className='w-full'
            />
            {errors.content && touched.content && (
              <div className='text-red-500'>{errors.content}</div>
            )}
          </div> */}

          <div className='flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-4 min-[400px]:flex-nowrap'>
            <FullButton
              type='submit'
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              className='ring-2 ring-[#1A73E8]'
            >
              Send
            </FullButton>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailForm
