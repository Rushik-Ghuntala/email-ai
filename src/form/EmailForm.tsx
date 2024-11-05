import Typography from '@/components/Typography'
import CancelButton from '@/components/ui/cancelButton'
import CustomButton from '@/components/ui/customButton'
import FullButton from '@/components/ui/fullButton'
import { InputField } from '@/components/ui/inputField'
import { useFormik } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import he from 'he'
import { useStateSelector } from '@/store/root.reducer'
import { RootState } from '@/store/redux.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { sendEmailFormSchema } from '@/utils/validations'

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
  const user = useStateSelector((state: RootState) => state.user.user) // Fetch user data from Redux

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
      senderEmail: user?.email || '',
      receiverEmail: '',
      subject: subject || '',
      content: content || '',
    },
    validationSchema: toFormikValidationSchema(sendEmailFormSchema), // You can add a validation schema if needed
    onSubmit: async (values) => {
      // try {
      //   console.log('Submit-----------------------')
      //   const payload = {
      //     senderEmail: values.senderEmail,
      //     receiverEmail: values.receiverEmail,
      //     subject: stripHtmlTags(values.subject),
      //     content: values.content,
      //   }

      //   console.log('payload', payload)

      //   const response = await fetch('/api/sendEmail', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(payload),
      //   })

      //   console.log('Response status:', response.status)

      //   const data = await response.json()
      //   console.log('Response data:', data)

      //   if (response.ok) {
      //     toast.success(data.message || 'Email sent successfully!')
      //     onSave()
      //   } else {
      //     toast.error(data.error || 'Failed to send email')
      //   }
      // } catch (error) {
      //   console.error('Error sending email:', error)
      //   toast.error('An error occurred while sending the email')
      // }
      // Encode the subject by removing HTML tags and then encoding it
      const subjectText = subject
        .replace(/<strong>(.*?)<\/strong>/g, '$1') // Remove <strong> tags
        .replace(/<em>(.*?)<\/em>/g, '$1') // Remove <em> tags
        .replace(/<u>(.*?)<\/u>/g, '$1') // Remove <u> tags
        .replace(/<br\s*\/?>/g, '') // Convert <br> tags to newlines
        .replace(/<p>/g, '') // Remove <p> tags
        .replace(/<\/p>/g, '\n') // Replace closing <p> with newlines
        .replace(/<span[^>]*>|<\/span>/g, '') // Remove <span> tags

      const subjectEncoded = encodeURIComponent(subjectText.trim())

      // Remove HTML tags from the email body and preserve formatting
      const bodyText = content
        .replace(/<p>/g, '') // Remove <p> tags
        .replace(/<\/p>/g, '\n') // Replace closing <p> with newlines
        .replace(/<strong>(.*?)<\/strong>/g, '$1') // Remove <strong> tags
        .replace(/<em>(.*?)<\/em>/g, '$1') // Remove <em> tags
        .replace(/<u>(.*?)<\/u>/g, '$1') // Remove <u> tags
        .replace(/<br\s*\/?>/g, '\n') // Convert <br> tags to newlines
        .replace(/<li>(.*?)<\/li>/g, '- $1\n') // Convert <li> to bullet points
        .replace(/<ol>(.*?)<\/ol>/g, '$1') // Remove <ol> tags
        .replace(/<span[^>]*>|<\/span>/g, '') // Remove <span> tags

      // Encode the plain text body
      const bodyEncoded = encodeURIComponent(bodyText.trim())

      // Construct the Gmail compose URL with encoded subject and body
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(values.receiverEmail)}&su=${subjectEncoded}&body=${bodyEncoded}`

      // Open the Gmail compose URL in a new tab
      window.open(gmailComposeUrl, '_blank')
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
              disabled
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
