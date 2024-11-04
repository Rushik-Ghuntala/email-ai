'use client'

import EmailGeneratePage from '@/section/EmailGenerator/EmailGeneratorPage'
import React from 'react'
import { useUser } from '@/hooks/useUser'
import { useSessionContext } from '@supabase/auth-helpers-react'
import Authenticate from '@/components/authenticate'

const Home = () => {
  const { user } = useUser()
  const { session } = useSessionContext()

  return (
    <div>
      {user && session && session.user ? (
        <EmailGeneratePage />
      ) : (
        <Authenticate />
      )}
    </div>
  )
}

export default Home
