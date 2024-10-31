'use client'

import { FormikProvider, useFormik } from 'formik'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import EmailGeneratorForm from './EmailGeneratorForm'

const EmailGeneratePage = () => {
  const route = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  //   const [loading, setLoading] = useState(true)

  const formik = useFormik<any>({
    initialValues: {
      fromName: '',
      toName: '',
      emailPrompt: '',
      tone: [],
    },
    // validationSchema: toFormikValidationSchema(postCreationForm),
    onSubmit: async (values) => {
      await submitForm(values)
    },
    enableReinitialize: true,
    validateOnMount: true,
  })

  const submitForm = async (values: any) => {
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

      console.log('resposce: ', response)

      const data = await response.json()

      console.log('body', data)

      //   const response = await fetch(`${AI_API_ENDPOINTS.GENERATE_CONTENT}`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(requestBody),
      //   })

      //   if (!response.ok) {
      //     const errorData = await response.json()
      //     throw new Error(errorData?.message || 'Failed to generate content')
      //   }

      //   const data = await response.json()
      //   formik.setFieldValue('isDirty', false)
    } catch (error) {
      console.error('API Error:', error)
    }
  }

  const {
    values,
    setFieldValue,
    touched,
    errors,
    isValid,
    setFieldTouched,
    handleSubmit,
    isSubmitting,
  } = formik

  console.log('vale', values)

  const renderComponent = () => {
    // if (loading) {
    //   return <div>Loading...</div>
    // }
    // if (hasGenerationParam) {
    //   return (
    //     <PostGeneration
    //       handleSubmit={handleSubmit}
    //       generatedContent={generatedContent}
    //       isSubmitting={isSubmitting}
    //       isValid={isValid}
    //     />
    //   )
    // } else if (hasIdParam) {
    //   return (
    //     <PostCreationTemplate
    //       handleSubmit={handleSubmit}
    //       isSubmitting={isSubmitting}
    //       isValid={isValid}
    //     />
    //   )
    // } else if (hasPostIdParam) {
    //   return <PostView />
    // } else {
    //   return (
    //     <PostCreation
    //       handleSubmit={handleSubmit}
    //       isSubmitting={isSubmitting}
    //       isValid={isValid}
    //     />
    //   )
    // }
  }

  return (
    <div>
      <FormikProvider value={formik}>
        <EmailGeneratorForm
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </FormikProvider>
    </div>
  )
}

export default EmailGeneratePage
