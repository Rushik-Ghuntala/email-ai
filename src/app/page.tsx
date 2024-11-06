'use client'

import EmailGeneratePage from '@/section/EmailGenerator/EmailGeneratorPage'
import React from 'react'
import { useUser } from '@/hooks/useUser'
import { useSessionContext } from '@supabase/auth-helpers-react'
import Authenticate from '@/components/authenticate'
import { useStateSelector } from '@/store/root.reducer'
import { RootState } from '@/store/redux.types'
import Navbar from '@/components/Navbar'

const Home = () => {
  const user = useStateSelector((state: RootState) => state.user.user)
  // const { user } = useUser()
  const { session } = useSessionContext()

  return (
    <div>
      {user && session && session.user ? (
        <>
          <Navbar />
          <EmailGeneratePage />
        </>
      ) : (
        <Authenticate />
      )}
    </div>
  )
}

export default Home
